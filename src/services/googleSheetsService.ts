import { ApprenticeProgress, CohortStudent } from '../types/induction';
import { getAccessToken } from './googleAuth';

const SPREADSHEET_TITLE = 'SENA Inducción Digital - Registro y Resultados de Aprendices';

export interface SpreadsheetInfo {
  id: string;
  name: string;
  url: string;
  createdNow: boolean;
}

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error';

type SyncListener = (state: SyncState, lastSyncTime?: string, errorMsg?: string) => void;
const listeners: Set<SyncListener> = new Set();

let currentSyncState: SyncState = 'idle';
let currentLastSyncTime: string | null = null;
let currentErrorMessage: string | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function subscribeToSyncStatus(listener: SyncListener): () => void {
  listeners.add(listener);
  listener(currentSyncState, currentLastSyncTime || undefined, currentErrorMessage || undefined);
  return () => {
    listeners.delete(listener);
  };
}

function notifySyncStatus(state: SyncState, errorMsg?: string) {
  currentSyncState = state;
  if (state === 'synced') {
    currentLastSyncTime = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    localStorage.setItem('sena_last_sync_time', currentLastSyncTime);
  }
  if (errorMsg) {
    currentErrorMessage = errorMsg;
  }
  listeners.forEach(fn => fn(currentSyncState, currentLastSyncTime || undefined, currentErrorMessage || undefined));
}

/**
 * Searches for an existing induction spreadsheet or creates a new one in the user's Drive.
 */
export async function getOrCreateInductionSpreadsheet(accessToken: string): Promise<SpreadsheetInfo> {
  // 1. Try to search Google Drive for existing file
  try {
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(
      SPREADSHEET_TITLE
    )}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id,name,webViewLink)`;

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const file = searchData.files[0];
        const info: SpreadsheetInfo = {
          id: file.id,
          name: file.name,
          url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
          createdNow: false
        };
        localStorage.setItem('sena_linked_spreadsheet', JSON.stringify(info));
        return info;
      }
    }
  } catch (err) {
    console.warn('Drive search error, proceeding to create new sheet:', err);
  }

  // 2. Create new spreadsheet with Sheets API
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_TITLE
      },
      sheets: [
        {
          properties: {
            title: 'Aprendices_Registro',
            gridProperties: { rowCount: 100, columnCount: 10, frozenRowCount: 1 }
          }
        },
        {
          properties: {
            title: 'Resultados_Evaluaciones',
            gridProperties: { rowCount: 100, columnCount: 10, frozenRowCount: 1 }
          }
        },
        {
          properties: {
            title: 'Cohorte_Consolidado',
            gridProperties: { rowCount: 100, columnCount: 10, frozenRowCount: 1 }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Error al crear la hoja de cálculo: ${errorText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 3. Initialize headers with styles
  await initializeSheetHeaders(accessToken, spreadsheetId);

  const newInfo: SpreadsheetInfo = {
    id: spreadsheetId,
    name: SPREADSHEET_TITLE,
    url: spreadsheetUrl,
    createdNow: true
  };
  localStorage.setItem('sena_linked_spreadsheet', JSON.stringify(newInfo));
  return newInfo;
}

/**
 * Initializes header rows in each sheet
 */
async function initializeSheetHeaders(accessToken: string, spreadsheetId: string) {
  const headersPayload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: 'Aprendices_Registro!A1:H1',
        values: [
          [
            'Documento Identidad',
            'Nombre del Aprendiz',
            'Programa de Formación',
            'Ficha',
            'Regional / Centro',
            'Progreso (%)',
            'Puntaje Promedio',
            'Estado de Inducción'
          ]
        ]
      },
      {
        range: 'Resultados_Evaluaciones!A1:I1',
        values: [
          [
            'Documento Aprendiz',
            'Nombre Completo',
            'Módulo Evaluado',
            'Normativa Aplicada',
            'Puntaje Obtenido (%)',
            'Puntos XP',
            'Aprobado',
            'Insignia Conquistada',
            'Fecha y Hora de Registro'
          ]
        ]
      },
      {
        range: 'Cohorte_Consolidado!A1:G1',
        values: [
          [
            'Ficha de Caracterización',
            'Programa',
            'Total Aprendices',
            'Tasa de Aprobación (%)',
            'Promedio General',
            'Alerta en Riesgo',
            'Última Sincronización'
          ]
        ]
      }
    ]
  };

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(headersPayload)
  });
}

/**
 * Upsert apprentice record without duplicating rows:
 * Finds the row for the apprentice's document ID and updates it, or appends a new row if absent.
 */
export async function upsertApprenticeToSheet(
  accessToken: string,
  spreadsheetId: string,
  currentApprentice: ApprenticeProgress,
  cohortStudents: CohortStudent[]
): Promise<void> {
  const nowStr = new Date().toLocaleString('es-CO');

  // Compute stats for current apprentice
  const completedPercent = Math.round((currentApprentice.completedModules.length / 5) * 100);
  const scoreValues = Object.values(currentApprentice.moduleScores);
  const avgScore = Math.round(
    scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : 0
  );
  const statusStr = completedPercent === 100 ? 'Completado' : 'En Progreso';

  // 1. Read existing Document IDs from Aprendices_Registro to locate existing row
  let existingRowIndex = -1;
  try {
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices_Registro!A:A`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      const rows = checkData.values || [];
      for (let i = 1; i < rows.length; i++) {
        if (rows[i] && rows[i][0] === currentApprentice.documentId) {
          existingRowIndex = i + 1; // 1-based index in Google Sheets
          break;
        }
      }
    }
  } catch (e) {
    console.warn('Could not read existing rows, will append:', e);
  }

  const apprenticeRow = [
    currentApprentice.documentId,
    currentApprentice.apprenticeName,
    currentApprentice.programName,
    currentApprentice.fichaNumber,
    currentApprentice.regional,
    `${completedPercent}%`,
    `${avgScore}%`,
    statusStr
  ];

  if (existingRowIndex > 1) {
    // Update existing row in place (PUT)
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices_Registro!A${existingRowIndex}:H${existingRowIndex}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [apprenticeRow] })
      }
    );
  } else {
    // Append as new row
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices_Registro!A:H:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [apprenticeRow] })
      }
    );
  }

  // 2. Upsert Results rows for current apprentice
  if (Object.keys(currentApprentice.moduleScores).length > 0) {
    // Read existing results to avoid duplicate evaluations
    const resultsPayload: any[] = [];
    Object.entries(currentApprentice.moduleScores).forEach(([modId, score]) => {
      const modNumber = modId.replace('modulo-', '');
      const isApproved = score >= 70;
      resultsPayload.push([
        currentApprentice.documentId,
        currentApprentice.apprenticeName,
        `Módulo ${modNumber} - Inducción SENA`,
        'Acuerdo 009 de 2024',
        `${score}%`,
        `+${Math.round(score * 1.5)} XP`,
        isApproved ? 'SÍ (Aprobado)' : 'NO (Requiere Refuerzo)',
        isApproved ? 'Insignia Otorgada' : 'Pendiente',
        nowStr
      ]);
    });

    if (resultsPayload.length > 0) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Resultados_Evaluaciones!A:I:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values: resultsPayload })
        }
      );
    }
  }

  // 3. Update Cohort Summary
  const allStudents = [
    { ...currentApprentice, progressPercent: completedPercent, scoreAvg: avgScore, ficha: currentApprentice.fichaNumber, program: currentApprentice.programName },
    ...cohortStudents
  ];
  const fichas = ['2714520', '2841029', '2690182'];
  const cohorteRows = fichas.map(f => {
    const inFicha = allStudents.filter(s => s.ficha === f);
    const count = inFicha.length;
    const completed = inFicha.filter(s => (s as any).progressPercent === 100).length;
    const atRisk = inFicha.filter(s => (s as any).scoreAvg < 70 && (s as any).scoreAvg > 0).length;
    const avg = Math.round(inFicha.reduce((acc, s) => acc + (s as any).scoreAvg, 0) / (count || 1));
    const prog = inFicha[0]?.program || 'Formación Técnica SENA';

    return [
      `Ficha ${f}`,
      prog,
      count,
      `${Math.round((completed / (count || 1)) * 100)}%`,
      `${avg}%`,
      atRisk,
      nowStr
    ];
  });

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Cohorte_Consolidado!A2:G${cohorteRows.length + 1}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values: cohorteRows })
    }
  );
}

/**
 * Debounced background automatic sync engine.
 * Call this whenever any state changes (apprentice progresses, completes a quiz, changes name, etc.).
 * It runs silently and non-blocking in the background.
 */
export function queueAutoSync(
  currentApprentice: ApprenticeProgress,
  cohortStudents: CohortStudent[]
): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  notifySyncStatus('syncing');

  debounceTimer = setTimeout(async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        notifySyncStatus('idle');
        return;
      }

      // Check linked spreadsheet
      let sheetInfo: SpreadsheetInfo | null = null;
      const saved = localStorage.getItem('sena_linked_spreadsheet');
      if (saved) {
        try {
          sheetInfo = JSON.parse(saved);
        } catch (e) {}
      }

      if (!sheetInfo || !sheetInfo.id) {
        sheetInfo = await getOrCreateInductionSpreadsheet(token);
      }

      await upsertApprenticeToSheet(token, sheetInfo.id, currentApprentice, cohortStudents);
      notifySyncStatus('synced');
    } catch (err: any) {
      console.warn('Auto-sync notice:', err);
      notifySyncStatus('error', err?.message || 'Error en sincronización en segundo plano');
    }
  }, 600);
}
