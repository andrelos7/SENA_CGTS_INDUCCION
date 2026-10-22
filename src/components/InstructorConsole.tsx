import React, { useState } from 'react';
import { ApprenticeProgress, CohortStudent } from '../types/induction';
import { AdminTrackingDashboard } from './AdminTrackingDashboard';
import { GoogleSheetsSyncBanner } from './GoogleSheetsSyncBanner';
import { 
  Users, 
  FileSpreadsheet, 
  Share2, 
  Settings, 
  Copy, 
  Check, 
  ExternalLink, 
  Eye, 
  ShieldCheck, 
  Award,
  Link,
  MessageSquare,
  Sparkles,
  QrCode
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface InstructorConsoleProps {
  currentApprentice: ApprenticeProgress;
  cohortStudents: CohortStudent[];
  instructorProfile?: {
    name: string;
    documentId: string;
  };
  onSwitchToApprenticeView: () => void;
  onUpdateApprenticeProgress: (updated: Partial<ApprenticeProgress>) => void;
}

export const InstructorConsole: React.FC<InstructorConsoleProps> = ({
  currentApprentice,
  cohortStudents,
  instructorProfile,
  onSwitchToApprenticeView,
  onUpdateApprenticeProgress
}) => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<
    'cohort' | 'sheets' | 'share' | 'settings'
  >('cohort');
  const [selectedShareFicha, setSelectedShareFicha] = useState('2714520');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [passingScore, setPassingScore] = useState(70);
  const [instructorTitle, setInstructorTitle] = useState('Instructor(a) Líder de Ficha');

  // Compute base URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const apprenticeShareUrl = `${baseUrl}?rol=aprendiz&ficha=${selectedShareFicha}`;

  const whatsappMessageTemplate = `Estimados Aprendices SENA:\n\nLes comparto el enlace oficial para realizar el proceso de Inducción Digital de acuerdo con el Reglamento del Aprendiz vigente (Acuerdo 009 de 2024).\n\n📌 Ficha: ${selectedShareFicha}\n🔗 Enlace de acceso: ${apprenticeShareUrl}\n\nPor favor completen los 5 módulos interactivos y las evaluaciones gamificadas para descargar su Certificado Oficial de Inducción.`;

  const handleCopyLink = () => {
    sounds.playCorrect();
    navigator.clipboard.writeText(apprenticeShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMessage = () => {
    sounds.playCorrect();
    navigator.clipboard.writeText(whatsappMessageTemplate);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Top Instructor Console Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#00324D] to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#39A900]" />
              <span>Consola de Gestión · {instructorProfile?.name ? `Instructor: ${instructorProfile.name} (CC ${instructorProfile.documentId})` : 'Perfil Instructor'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Panel del Instructor SENA
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Administra el proceso de inducción, vincula la hoja de Google Sheets en Drive, genera enlaces personalizados para tus fichas y realiza seguimiento en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-[#39A900] hover:bg-[#277500] text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace para Aprendices'}</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onSwitchToApprenticeView();
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors border border-white/20"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Ver como Aprendiz</span>
            </button>
          </div>
        </div>

        {/* Console Tab Selector */}
        <div className="mt-8 flex flex-wrap gap-2 pt-4 border-t border-white/10 text-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveConsoleTab('cohort');
            }}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeConsoleTab === 'cohort'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#39A900]" />
            <span>Monitoreo de Cohortes en Vivo</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveConsoleTab('sheets');
            }}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeConsoleTab === 'sheets'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gestión de Google Sheets & Drive</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveConsoleTab('share');
            }}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeConsoleTab === 'share'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Compartir y Distribuir Inducción</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveConsoleTab('settings');
            }}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeConsoleTab === 'settings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Ajustes y Parámetros</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Live Cohort Tracking */}
      {activeConsoleTab === 'cohort' && (
        <div className="space-y-6 animate-fadeIn">
          <AdminTrackingDashboard />
        </div>
      )}

      {/* Tab 2: Google Sheets & Drive Administration */}
      {activeConsoleTab === 'sheets' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Full-Privilege Sync Banner */}
          <GoogleSheetsSyncBanner
            currentApprentice={currentApprentice}
            cohortStudents={cohortStudents}
          />

          {/* Technical Structure Guide */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#39A900]" />
              <span>Estructura de las Pestañas en tu Google Drive</span>
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              La hoja de cálculo creada se administra de manera centralizada. Los aprendices registran sus respuestas y el sistema actualiza automáticamente sus calificaciones sin darles acceso a las configuraciones de la hoja.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 text-[#00324D]">
                  1. Aprendices_Registro
                </div>
                <p className="text-slate-500 text-[11px] mb-3">
                  Una fila consolidada por cada aprendiz registrado.
                </p>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>• Documento Identidad</li>
                  <li>• Nombre Completo</li>
                  <li>• Programa de Formación</li>
                  <li>• Ficha de Caracterización</li>
                  <li>• Progreso % y Estado</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 text-[#00324D]">
                  2. Resultados_Evaluaciones
                </div>
                <p className="text-slate-500 text-[11px] mb-3">
                  Detalle cronológico de cuestionarios aprobados.
                </p>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>• Módulo 1 al 5 evaluado</li>
                  <li>• Normativa (Acuerdo 009 de 2024)</li>
                  <li>• Puntaje (%) y Puntos XP</li>
                  <li>• Insignias otorgadas</li>
                  <li>• Fecha y hora exacta</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 text-[#00324D]">
                  3. Cohorte_Consolidado
                </div>
                <p className="text-slate-500 text-[11px] mb-3">
                  Indicadores agrupados por cada ficha activa.
                </p>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>• Total de matriculados</li>
                  <li>• Tasa de certificación (%)</li>
                  <li>• Promedio general Saber SENA</li>
                  <li>• Aprendices en riesgo</li>
                  <li>• Marca de última sincronización</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Share and Distribute */}
      {activeConsoleTab === 'share' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs animate-fadeIn">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00324D]">
              Distribución de la Plataforma
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Generador de Enlaces para Aprendices
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Los aprendices que ingresen a través de este enlace entrarán directamente al **Portal del Aprendiz**, sin botones de configuración ni acceso a hojas de cálculo o datos de otros alumnos.
            </p>
          </div>

          {/* Ficha Selector */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Selecciona o Escribe la Ficha para la que deseas generar el enlace:
            </label>
            <div className="flex flex-wrap gap-2">
              {['2714520', '2841029', '2690182'].map(f => (
                <button
                  key={f}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedShareFicha(f);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedShareFicha === f
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Ficha {f}
                </button>
              ))}
              <input
                type="text"
                value={selectedShareFicha}
                onChange={e => setSelectedShareFicha(e.target.value)}
                placeholder="Otra Ficha..."
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900] w-32"
              />
            </div>
          </div>

          {/* Link Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Enlace Directo del Aprendiz (Sin funciones de administrador):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apprenticeShareUrl}
                className="flex-1 p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-800 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-[#39A900] hover:bg-[#277500] text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copiado' : 'Copiar Enlace'}</span>
              </button>
            </div>
          </div>

          {/* Ready-to-send Message for WhatsApp / Teams */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Plantilla de Mensaje para Grupos de WhatsApp / Teams / Correo:</span>
              </label>
              <button
                onClick={handleCopyMessage}
                className="text-xs font-semibold text-[#39A900] hover:underline flex items-center gap-1"
              >
                {copiedMessage ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMessage ? 'Mensaje Copiado' : 'Copiar Texto Completo'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={6}
              value={whatsappMessageTemplate}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-mono leading-relaxed select-all focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Settings */}
      {activeConsoleTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs animate-fadeIn">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Parámetros de Evaluación y Certificación
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personaliza los criterios formativos para los aprendices bajo tu tutela.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">
                Puntaje Mínimo de Aprobación por Módulo
              </label>
              <select
                value={passingScore}
                onChange={e => setPassingScore(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-semibold"
              >
                <option value={70}>70% de aciertos (Estándar SENA)</option>
                <option value={80}>80% de aciertos (Exigencia Alta)</option>
                <option value={85}>85% de aciertos (Excelencia)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Criterio pedagógico para desbloquear insignias y emitir la constancia.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-700">
                Firma y Cargo en Certificado Digital
              </label>
              <input
                type="text"
                value={instructorTitle}
                onChange={e => setInstructorTitle(e.target.value)}
                placeholder="Ej. Instructor(a) Líder de Ficha"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
              />
              <p className="text-[11px] text-slate-500">
                Aparecerá en el certificado emitido a los aprendices aprobados.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
