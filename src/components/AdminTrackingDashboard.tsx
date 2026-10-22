import React, { useState, useEffect } from 'react';
import { CohortStudent, LiveActivityFeedItem } from '../types/induction';
import { INITIAL_COHORT_STUDENTS, INITIAL_LIVE_ACTIVITIES } from '../data/mockCohort';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  Activity, 
  Mail, 
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const AdminTrackingDashboard: React.FC = () => {
  const [students, setStudents] = useState<CohortStudent[]>(INITIAL_COHORT_STUDENTS);
  const [activities, setActivities] = useState<LiveActivityFeedItem[]>(INITIAL_LIVE_ACTIVITIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFicha, setSelectedFicha] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedStudent, setSelectedStudent] = useState<CohortStudent | null>(null);
  const [isLiveSyncing, setIsLiveSyncing] = useState(true);

  // Periodic simulated live stream event
  useEffect(() => {
    if (!isLiveSyncing) return;

    const interval = setInterval(() => {
      const sampleNames = ['Carlos Alberto Medina', 'Natalia Gómez Cruz', 'Esteban Silva', 'María Paula Vargas'];
      const sampleActions = [
        { action: 'Aprobó Módulo 2', type: 'module_completed' as const, detail: 'Deberes y Prohibiciones (95%)' },
        { action: 'Insignia Obtenida', type: 'badge_earned' as const, detail: 'Voz y Bienestar (Derechos Art. 5)' },
        { action: 'Evaluación Completada', type: 'quiz_passed' as const, detail: 'Racha de 3 aciertos (+150 XP)' }
      ];

      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomAction = sampleActions[Math.floor(Math.random() * sampleActions.length)];

      const newEvent: LiveActivityFeedItem = {
        id: `act-${Date.now()}`,
        timestamp: 'Hace unos segundos',
        apprenticeName: randomName,
        action: randomAction.action,
        type: randomAction.type,
        detail: randomAction.detail
      };

      setActivities(prev => [newEvent, ...prev.slice(0, 7)]);
    }, 18000);

    return () => clearInterval(interval);
  }, [isLiveSyncing]);

  // Filtering
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.documentId.includes(searchTerm) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFicha = selectedFicha === 'todas' || student.ficha === selectedFicha;
    const matchesStatus = selectedStatus === 'todos' || student.status === selectedStatus;

    return matchesSearch && matchesFicha && matchesStatus;
  });

  // Calculate cohort KPIs
  const totalStudents = students.length;
  const completedCount = students.filter(s => s.status === 'completado').length;
  const completionRate = Math.round((completedCount / totalStudents) * 100);
  const averageScore = Math.round(
    students.reduce((acc, s) => acc + s.scoreAvg, 0) / (students.filter(s => s.scoreAvg > 0).length || 1)
  );
  const atRiskCount = students.filter(s => s.status === 'en_riesgo').length;

  const handleExportCSV = () => {
    sounds.playClick();
    const headers = 'Nombre,Documento,Programa,Ficha,Progreso,Promedio,Estado,UltimaActividad\n';
    const rows = students
      .map(
        s =>
          `"${s.name}","${s.documentId}","${s.program}","${s.ficha}",${s.progressPercent}%,${s.scoreAvg}%,"${s.status}","${s.lastActive}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SENA_Seguimiento_Induccion_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner and KPI Strip */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#00324D] uppercase tracking-wider">
              <Activity className="w-4 h-4 text-[#39A900]" />
              <span>COORDINACIÓN ACADÉMICA · SEGUIMIENTO EN TIEMPO REAL</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Panel del Instructor — Estado de Cohortes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitorea el avance de los aprendices en los 5 módulos de inducción y el Reglamento (Acuerdo 009 de 2024).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setIsLiveSyncing(!isLiveSyncing);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                isLiveSyncing
                  ? 'border-emerald-200 text-emerald-800 bg-emerald-50'
                  : 'border-slate-300 text-slate-600 bg-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLiveSyncing ? 'animate-spin text-[#39A900]' : ''}`} />
              <span>{isLiveSyncing ? 'Sincronización Activa' : 'Sincronización en Pausa'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-[#00324D] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar Reporte (CSV)</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500">
              Total Aprendices
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              {totalStudents}
            </div>
            <span className="text-[11px] text-slate-400">
              En 3 fichas activas
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500">
              Tasa de Certificación
            </span>
            <div className="text-2xl font-bold text-[#39A900] mt-1 tabular-nums">
              {completionRate}%
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              {completedCount} de {totalStudents} culminaron
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500">
              Promedio Saber SENA
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              {averageScore}%
            </div>
            <span className="text-[11px] text-slate-400">
              Evaluaciones gamificadas
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500">
              Alerta de Acompañamiento
            </span>
            <div className="text-2xl font-bold text-rose-600 mt-1 tabular-nums">
              {atRiskCount}
            </div>
            <span className="text-[11px] text-rose-600 font-medium">
              Requieren plan de refuerzo
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Cohort Table + Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Students Cohort Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Table Controls Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar aprendiz por nombre o documento..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>

            {/* Ficha Filter */}
            <select
              value={selectedFicha}
              onChange={e => setSelectedFicha(e.target.value)}
              className="py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            >
              <option value="todas">Todas las Fichas</option>
              <option value="2714520">Ficha 2714520 (ADSO)</option>
              <option value="2841029">Ficha 2841029 (Gestión Empresarial)</option>
              <option value="2690182">Ficha 2690182 (Mecatrónica)</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            >
              <option value="todos">Todos los Estados</option>
              <option value="completado">Completado</option>
              <option value="en_progreso">En Progreso</option>
              <option value="en_riesgo">En Riesgo</option>
              <option value="iniciado">Sin Iniciar</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Aprendiz</th>
                  <th className="py-3 px-4">Programa / Ficha</th>
                  <th className="py-3 px-4 text-center">Avance</th>
                  <th className="py-3 px-4 text-center">Promedio</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No se encontraron aprendices con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr
                      key={student.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedStudent(student);
                      }}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          CC {student.documentId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 truncate max-w-[180px]">
                          {student.program}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Ficha {student.ficha}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="font-bold tabular-nums text-slate-800">
                          {student.progressPercent}%
                        </div>
                        <div className="w-16 bg-slate-200 h-1 rounded-full mx-auto mt-1">
                          <div
                            className="bg-[#39A900] h-1 rounded-full"
                            style={{ width: `${student.progressPercent}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold tabular-nums">
                        {student.scoreAvg > 0 ? (
                          <span
                            className={
                              student.scoreAvg >= 80
                                ? 'text-[#39A900]'
                                : student.scoreAvg >= 70
                                ? 'text-amber-600'
                                : 'text-rose-600'
                            }
                          >
                            {student.scoreAvg}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                            student.status === 'completado'
                              ? 'text-[#39A900]'
                              : student.status === 'en_progreso'
                              ? 'text-sky-700'
                              : student.status === 'en_riesgo'
                              ? 'text-rose-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {student.status === 'completado' && '● Completado'}
                          {student.status === 'en_progreso' && '● En Progreso'}
                          {student.status === 'en_riesgo' && '▲ En Riesgo'}
                          {student.status === 'iniciado' && '○ No Iniciado'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-slate-400 hover:text-slate-800 p-1">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Live Activity Stream (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#39A900]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Actividad en Tiempo Real
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">En vivo</span>
            </div>

            <div className="space-y-3.5">
              {activities.map(act => (
                <div key={act.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-700">{act.apprenticeName}</span>
                    <span className="font-mono">{act.timestamp}</span>
                  </div>
                  <div className="font-bold text-[#00324D]">{act.action}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{act.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Student Detail Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Ficha de Seguimiento Individual
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h3>
                <div className="text-xs text-slate-500 font-mono">
                  CC {selectedStudent.documentId} · Ficha {selectedStudent.ficha}
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Programa:</span>
                <span className="font-semibold text-slate-800 text-right">{selectedStudent.program}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Regional:</span>
                <span className="font-semibold text-slate-800 text-right">{selectedStudent.regional}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Módulos Aprobados:</span>
                <span className="font-semibold text-slate-800">
                  {selectedStudent.completedModulesCount} de 5 módulos
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Puntaje Promedio:</span>
                <span className="font-bold text-[#39A900]">{selectedStudent.scoreAvg}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Última Actividad:</span>
                <span className="font-medium text-slate-700">{selectedStudent.lastActive}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sounds.playClick();
                  alert(`Notificación pedagógica de refuerzo enviada al correo ${selectedStudent.email}`);
                  setSelectedStudent(null);
                }}
                className="flex-1 py-2 px-3 bg-[#39A900] hover:bg-[#277500] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Enviar Plan de Refuerzo</span>
              </button>

              <button
                onClick={() => setSelectedStudent(null)}
                className="py-2 px-4 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
