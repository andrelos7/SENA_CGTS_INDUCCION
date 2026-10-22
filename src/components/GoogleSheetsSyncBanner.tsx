import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  logout, 
  initAuth, 
  getAccessToken,
  setAccessToken
} from '../services/googleAuth';
import { 
  getOrCreateInductionSpreadsheet, 
  queueAutoSync,
  subscribeToSyncStatus,
  SpreadsheetInfo,
  SyncState
} from '../services/googleSheetsService';
import { ApprenticeProgress, CohortStudent } from '../types/induction';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  User as UserIcon,
  CloudCheck,
  Zap
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface GoogleSheetsSyncBannerProps {
  currentApprentice: ApprenticeProgress;
  cohortStudents: CohortStudent[];
  onSpreadsheetLinked?: (url: string) => void;
}

export const GoogleSheetsSyncBanner: React.FC<GoogleSheetsSyncBannerProps> = ({
  currentApprentice,
  cohortStudents,
  onSpreadsheetLinked
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('sena_last_sync_time');
  });
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetInfo | null>(() => {
    const saved = localStorage.getItem('sena_linked_spreadsheet');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Subscribe to background sync state changes
  useEffect(() => {
    const unsubscribeSync = subscribeToSyncStatus((state, time, errMsg) => {
      setSyncState(state);
      if (time) setLastSyncTime(time);
      if (errMsg && state === 'error') setErrorMessage(errMsg);
    });
    return () => unsubscribeSync();
  }, []);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribeAuth = initAuth(
      async (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        if (currentToken && !spreadsheet) {
          try {
            const sheet = await getOrCreateInductionSpreadsheet(currentToken);
            setSpreadsheet(sheet);
            if (onSpreadsheetLinked) onSpreadsheetLinked(sheet.url);
          } catch (e) {}
        }
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribeAuth();
  }, [spreadsheet]);

  const handleGoogleLogin = async () => {
    sounds.playClick();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setAccessToken(res.accessToken);

        // Automatically connect or create spreadsheet silently
        const sheet = await getOrCreateInductionSpreadsheet(res.accessToken);
        setSpreadsheet(sheet);
        if (onSpreadsheetLinked) {
          onSpreadsheetLinked(sheet.url);
        }
        setStatusMessage('Vinculado con éxito. Sincronización continua activada.');
        
        // Immediate first sync
        queueAutoSync(currentApprentice, cohortStudents);
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        return;
      }
      console.error('Error al conectar Google:', err);
      setErrorMessage(
        err.message || 'No se pudo conectar a Google. Por favor intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = () => {
    sounds.playClick();
    queueAutoSync(currentApprentice, cohortStudents);
  };

  const handleLogout = async () => {
    sounds.playClick();
    await logout();
    setUser(null);
    setToken(null);
    setStatusMessage(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Service Branding & Info */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-[#39A900] shrink-0 border border-emerald-100">
            <FileSpreadsheet className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Sincronización Automática en Google Drive & Sheets
              </h3>

              {user ? (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#39A900]" />
                  <span>Automática Continua</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Vincular una sola vez
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Cada lección, evaluación aprobada y cambio de estado se actualiza en segundo plano sin intervención manual.
            </p>

            {spreadsheet && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <a
                  href={spreadsheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#00324D] hover:text-[#39A900] underline flex items-center gap-1 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#39A900]" />
                  <span>{spreadsheet.name}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Live Sync Micro-Badge */}
                <div className="flex items-center gap-1 text-[11px]">
                  {syncState === 'syncing' ? (
                    <span className="text-amber-600 flex items-center gap-1 font-medium">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Guardando cambios en Drive...
                    </span>
                  ) : lastSyncTime ? (
                    <span className="text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-[#39A900]" />
                      Sincronizado a las {lastSyncTime}
                    </span>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!user ? (
            /* Sign in with Google Button (Once only) */
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="inline-flex items-center gap-2.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs disabled:opacity-60 cursor-pointer"
            >
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isLoading ? 'Conectando...' : 'Activar Sincronización Automática'}</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {/* Linked user email badge */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[150px] font-medium font-mono text-[11px]">
                  {user.email || user.displayName}
                </span>
              </div>

              {/* Direct Open Link */}
              {spreadsheet && (
                <a
                  href={spreadsheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#00324D] hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ver Hoja en Drive</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              {/* Instant Manual Re-sync button */}
              <button
                onClick={handleManualSync}
                disabled={syncState === 'syncing'}
                className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Forzar actualización inmediata"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncState === 'syncing' ? 'animate-spin text-[#39A900]' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                title="Desconectar cuenta"
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages / Alerts */}
      {statusMessage && (
        <div className="mt-3 text-xs text-emerald-800 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mt-3 text-xs text-rose-800 bg-rose-50/80 p-2.5 rounded-lg border border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-700 hover:text-rose-900 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
