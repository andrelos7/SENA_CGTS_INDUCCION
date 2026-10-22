import React, { useState } from 'react';
import { ApprenticeProgress, InductionModule } from '../types/induction';
import { INDUCTION_MODULES, SENA_BADGES } from '../data/inductionData';
import { SenaLogo } from './SenaLogo';
import {
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  BookOpen,
  FileCheck2,
  FileText,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Clock,
  Printer,
  Compass,
  Scale,
  Shield,
  Briefcase,
  Users,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ApprenticeRoadmapProps {
  progress: ApprenticeProgress;
  onSelectModule: (moduleId: string) => void;
  onStartQuiz: (moduleNumber?: number) => void;
  onStartFinalOlympiad: () => void;
  onOpenCertificate: () => void;
  onOpenCases: () => void;
  onOpenRegulations: () => void;
  onEditApprenticeData?: () => void;
}

export const ApprenticeRoadmap: React.FC<ApprenticeRoadmapProps> = ({
  progress,
  onSelectModule,
  onStartQuiz,
  onStartFinalOlympiad,
  onOpenCertificate,
  onOpenCases,
  onOpenRegulations,
  onEditApprenticeData
}) => {
  const [activeStageDetail, setActiveStageDetail] = useState<number | null>(null);

  const completedModulesCount = progress.completedModules.length;
  const totalModules = INDUCTION_MODULES.length;
  const allModulesDone = completedModulesCount === totalModules;
  const isFinalQuizPassed = progress.finalQuizPassed;
  const isCertified = allModulesDone && isFinalQuizPassed;

  // Calculate current stage index (1-based, 1 to 5)
  let currentStageIndex = 1;
  if (!allModulesDone) {
    currentStageIndex = 2; // In modules
  } else if (!isFinalQuizPassed) {
    currentStageIndex = 4; // Ready for final exam
  } else {
    currentStageIndex = 5; // Certified
  }

  // Percentage of completion across 5 stages
  const stageWeights = [
    15, // Stage 1: Registration (already 100%)
    45, // Stage 2: 5 Modules (9% each)
    10, // Stage 3: XP & Badges
    15, // Stage 4: Final Exam
    15  // Stage 5: Certificate Claim
  ];

  const stage1Score = 15;
  const stage2Score = (completedModulesCount / totalModules) * 45;
  const stage3Score = Math.min(10, (progress.badges.length / SENA_BADGES.length) * 10);
  const stage4Score = isFinalQuizPassed ? 15 : 0;
  const stage5Score = isCertified ? 15 : 0;
  const overallRoadmapPercent = Math.min(100, Math.round(stage1Score + stage2Score + stage3Score + stage4Score + stage5Score));

  const stages = [
    {
      id: 1,
      number: '01',
      title: 'Caracterización y Registro',
      subtitle: 'Matrícula Oficial SENA',
      requirement: 'Identificación confirmada en SOFIA Plus / Ficha de Aprendizaje.',
      status: 'completed' as const,
      badgeText: 'Completado ✓',
      icon: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      illustrationGradient: 'from-emerald-600 to-[#39A900]',
      description: 'Tu perfil institucional está registrado activamente en el Sistema Nacional de Aprendizaje para tu programa de formación técnica/tecnológica.',
      actionLabel: 'Ver mis datos',
      actionType: 'profile'
    },
    {
      id: 2,
      number: '02',
      title: '5 Módulos Formativos',
      subtitle: 'Acuerdo 009 de 2024 & Vida SENA',
      requirement: `Aprobar los 5 módulos oficiales (${completedModulesCount}/${totalModules} listos).`,
      status: allModulesDone ? ('completed' as const) : ('in_progress' as const),
      badgeText: allModulesDone ? '5 de 5 Aprobados ✓' : `${completedModulesCount} de ${totalModules} Módulos`,
      icon: <BookOpen className="w-6 h-6 text-white" />,
      illustrationGradient: allModulesDone ? 'from-[#39A900] to-emerald-700' : 'from-[#00324D] to-[#0A5478]',
      description: 'Aprende los pilares institucionales: Identidad y Símbolos, Derechos y Deberes según el nuevo Acuerdo 009 de 2024, Bienestar, Etapa Productiva y Comité de Evaluación.',
      actionLabel: allModulesDone ? 'Repasar Módulos' : 'Continuar Módulos',
      actionType: 'modules'
    },
    {
      id: 3,
      number: '03',
      title: 'Retos Gamificados & XP',
      subtitle: 'Evaluaciones y Simulador de Casos',
      requirement: 'Superar quizes con puntaje ≥ 70% y ganar insignias de formación.',
      status: (progress.badges.length >= 3 || allModulesDone) ? ('completed' as const) : ('in_progress' as const),
      badgeText: `${progress.badges.length}/${SENA_BADGES.length} Insignias · ${progress.totalXP} XP`,
      icon: <Zap className="w-6 h-6 text-white" />,
      illustrationGradient: 'from-amber-600 to-amber-500',
      description: 'Pon a prueba tus conocimientos sobre situaciones cotidianas en el Centro de Formación con dilemas éticos y casos de debido proceso.',
      actionLabel: 'Explorar Retos & Casos',
      actionType: 'cases'
    },
    {
      id: 4,
      number: '04',
      title: 'Gran Evaluación Saber SENA',
      subtitle: 'Prueba Integral de Inducción',
      requirement: 'Aprobar la evaluación general con calificación mínima del 70%.',
      status: isFinalQuizPassed ? ('completed' as const) : allModulesDone ? ('active' as const) : ('locked' as const),
      badgeText: isFinalQuizPassed ? `Aprobado (${progress.finalQuizScore ?? 100}%) ✓` : allModulesDone ? '¡Listo para presentar!' : 'Bloqueado',
      icon: <FileCheck2 className="w-6 h-6 text-white" />,
      illustrationGradient: isFinalQuizPassed ? 'from-emerald-700 to-[#39A900]' : allModulesDone ? 'from-[#00324D] to-indigo-700' : 'from-slate-400 to-slate-500',
      description: 'Examen integral que consolida las 5 temáticas fundamentales. Al aprobarlo cumples el requisito legal de inducción para la etapa lectiva.',
      actionLabel: isFinalQuizPassed ? 'Repetir Desafío' : 'Iniciar Desafío Final',
      actionType: 'quiz'
    },
    {
      id: 5,
      number: '05',
      title: 'Certificación Oficial SENA',
      subtitle: 'Constancia Digital de 40 Horas',
      requirement: 'Expedición institucional con folio digital y código de validación QR.',
      status: isCertified ? ('completed' as const) : ('locked' as const),
      badgeText: isCertified ? '¡Certificado Disponible! 🎓' : 'Pendiente requisitos',
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      illustrationGradient: isCertified ? 'from-amber-500 to-yellow-600' : 'from-slate-400 to-slate-500',
      description: 'Diploma oficial descargable e imprimible con validez institucional, avalado por la Subdirección de Centro y Coordinación Académica.',
      actionLabel: isCertified ? 'Descargar Certificado Oficial' : 'Bloqueado (Faltan hitos)',
      actionType: 'certificate'
    }
  ];

  const handleStageAction = (actionType: string) => {
    sounds.playClick();
    switch (actionType) {
      case 'profile':
        if (onEditApprenticeData) {
          onEditApprenticeData();
        }
        break;
      case 'modules':
        const pending = INDUCTION_MODULES.find(m => !progress.completedModules.includes(m.id)) || INDUCTION_MODULES[0];
        onSelectModule(pending.id);
        break;
      case 'cases':
        onOpenCases();
        break;
      case 'quiz':
        onStartFinalOlympiad();
        break;
      case 'certificate':
        onOpenCertificate();
        break;
      default:
        break;
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* 1. INSTITUTIONAL HERO BANNER FOR THE ROADMAP */}
      <div className="relative overflow-hidden bg-radial from-[#00324D] via-[#00273D] to-[#001D2E] text-white p-6 sm:p-8 md:p-10">
        {/* Subtle background decorative shapes */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#39A900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission & Identity */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#68D938] text-xs font-semibold tracking-wide border border-white/10">
              <Compass className="w-3.5 h-3.5 text-[#68D938]" />
              <span>Ruta Oficial de Formación Profesional Integral 2026</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ruta Gráfica del Aprendiz hacia la{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#68D938] via-emerald-300 to-teal-200">
                Certificación Oficial
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Bienvenido(a), <strong className="text-white font-semibold">{progress.apprenticeName}</strong>.
              Sigue el itinerario oficial de 5 etapas formativas para completar tu inducción, interiorizar el
              Reglamento del Aprendiz (Acuerdo 009 de 2024) y obtener tu Constancia Oficial de 40 Horas.
            </p>

            {/* Quick Apprentice Metadata Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                Programa: <strong className="text-white">{progress.programName}</strong>
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                Ficha: <strong className="text-white font-mono">{progress.fichaNumber}</strong>
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                Regional: <strong className="text-white">{progress.regional.split('—')[0]}</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Gauge Card */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SenaLogo className="w-7 h-7" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Progreso Global de Ruta
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#39A900] text-white">
                {isCertified ? '¡100% Certificado!' : `Etapa 0${currentStageIndex} de 05`}
              </span>
            </div>

            {/* Big Percent Gauge & Thermometer */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-4xl sm:text-5xl font-black text-white tabular-nums tracking-tight">
                  {overallRoadmapPercent}%
                </span>
                <span className="text-xs text-slate-300 font-medium text-right">
                  {isCertified ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-4 h-4" /> Certificación Desbloqueada
                    </span>
                  ) : (
                    <span>Meta: Certificado Digital Oficial</span>
                  )}
                </span>
              </div>

              {/* Progress bar track */}
              <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-[#39A900] to-teal-400 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${overallRoadmapPercent}%` }}
                />
              </div>

              {/* Micro milestones */}
              <div className="grid grid-cols-5 text-center text-[10px] text-slate-400 pt-1 font-mono">
                <span className={stage1Score ? 'text-[#68D938] font-bold' : ''}>01 Datos</span>
                <span className={completedModulesCount > 0 ? 'text-[#68D938] font-bold' : ''}>02 Módulos</span>
                <span className={progress.totalXP > 0 ? 'text-[#68D938] font-bold' : ''}>03 Retos</span>
                <span className={isFinalQuizPassed ? 'text-[#68D938] font-bold' : ''}>04 Saber</span>
                <span className={isCertified ? 'text-amber-400 font-bold' : ''}>05 Diploma</span>
              </div>
            </div>

            {/* Next Step Call to Action */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                {isCertified ? (
                  <span className="text-emerald-300 font-semibold">¡Has alcanzado la meta formativa!</span>
                ) : (
                  <span>
                    Próximo hito:{' '}
                    <strong className="text-white">
                      {stages[currentStageIndex - 1]?.title}
                    </strong>
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  if (isCertified) {
                    onOpenCertificate();
                  } else if (stages[currentStageIndex - 1]) {
                    handleStageAction(stages[currentStageIndex - 1].actionType);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                  isCertified
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold'
                    : 'bg-[#39A900] hover:bg-[#277500] text-white'
                }`}
              >
                <span>{isCertified ? 'Ver Certificado' : 'Avanzar Ahora'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ILLUSTRATED INTERACTIVE ROADMAP (DESKTOP & MOBILE VIEWS) */}
      <div className="p-6 sm:p-8 md:p-10 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#00324D] uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-[#39A900]" />
                <span>Itinerario Cronológico de Inducción</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Las 5 Estaciones Formativas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Haz clic en cada estación para conocer los detalles, requisitos y activar directamente la actividad formativa.
              </p>
            </div>

            {/* Quick Filter / Legend */}
            <div className="flex items-center gap-3 text-xs bg-white px-3 py-2 rounded-xl border border-slate-200 shrink-0">
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#39A900]" />
                Aprobado
              </span>
              <span className="flex items-center gap-1 text-[#00324D] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 animate-pulse" />
                En Curso
              </span>
              <span className="flex items-center gap-1 text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                Bloqueado
              </span>
            </div>
          </div>

          {/* DESKTOP ILLUSTRATED PIPELINE (Visible on md and up) */}
          <div className="hidden md:block relative">
            {/* Visual connecting track line */}
            <div className="absolute top-20 left-12 right-12 h-1.5 bg-slate-200 rounded-full -z-0">
              <div
                className="h-full bg-gradient-to-r from-[#39A900] via-emerald-500 to-amber-500 rounded-full transition-all duration-700"
                style={{
                  width: `${
                    currentStageIndex === 1
                      ? '10%'
                      : currentStageIndex === 2
                      ? '35%'
                      : currentStageIndex === 3
                      ? '55%'
                      : currentStageIndex === 4
                      ? '78%'
                      : '100%'
                  }`
                }}
              />
            </div>

            {/* 5 Milestone Nodes in a row */}
            <div className="grid grid-cols-5 gap-4 relative z-10">
              {stages.map((stage, idx) => {
                const isCompleted = stage.status === 'completed';
                const isActive = stage.status === 'active' || stage.status === 'in_progress';
                const isLocked = stage.status === 'locked';

                return (
                  <div
                    key={stage.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveStageDetail(activeStageDetail === stage.id ? null : stage.id);
                    }}
                    className={`cursor-pointer group flex flex-col items-center text-center transition-all ${
                      activeStageDetail === stage.id ? 'scale-102' : ''
                    }`}
                  >
                    {/* Node Circle & Visual Badge */}
                    <div className="relative mb-4">
                      {/* Pulse ring for active step */}
                      {isActive && (
                        <div className="absolute -inset-2 bg-emerald-500/25 rounded-full animate-ping" />
                      )}

                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-108 bg-gradient-to-br ${
                          stage.illustrationGradient
                        } ${
                          isCompleted
                            ? 'ring-4 ring-emerald-100 shadow-emerald-500/20'
                            : isActive
                            ? 'ring-4 ring-cyan-100 shadow-cyan-500/25 ring-offset-2'
                            : 'opacity-70 shadow-none ring-2 ring-slate-200'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-8 h-8 text-white" />
                        ) : isLocked ? (
                          <Lock className="w-7 h-7 text-white/90" />
                        ) : (
                          stage.icon
                        )}
                      </div>

                      {/* Small Step Indicator Tag */}
                      <span
                        className={`absolute -bottom-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs ${
                          isCompleted
                            ? 'bg-[#39A900] text-white'
                            : isActive
                            ? 'bg-[#00324D] text-white ring-1 ring-white'
                            : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        Paso {stage.number}
                      </span>
                    </div>

                    {/* Step Content Card */}
                    <div
                      className={`w-full p-4 rounded-xl border transition-all text-left flex flex-col justify-between min-h-[190px] ${
                        activeStageDetail === stage.id
                          ? 'bg-white border-[#39A900] shadow-md ring-2 ring-[#39A900]/20'
                          : isCompleted
                          ? 'bg-white border-emerald-200 hover:border-emerald-300'
                          : isActive
                          ? 'bg-white border-cyan-300 hover:border-cyan-400 shadow-xs'
                          : 'bg-white/70 border-slate-200 opacity-80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wide ${
                              isCompleted
                                ? 'text-[#39A900]'
                                : isActive
                                ? 'text-cyan-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {stage.badgeText}
                          </span>
                        </div>

                        <h4 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-2">
                          {stage.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-3">
                          {stage.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleStageAction(stage.actionType);
                          }}
                          disabled={isLocked}
                          className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                              : isActive
                              ? 'bg-[#39A900] text-white hover:bg-[#277500] shadow-xs'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <span>{stage.actionLabel}</span>
                          {!isLocked && <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE ILLUSTRATED VERTICAL TIMELINE (Visible on mobile screens) */}
          <div className="block md:hidden space-y-4">
            {stages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isActive = stage.status === 'active' || stage.status === 'in_progress';
              const isLocked = stage.status === 'locked';

              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-2xl border transition-all relative ${
                    isCompleted
                      ? 'bg-white border-emerald-200 shadow-xs'
                      : isActive
                      ? 'bg-white border-cyan-300 ring-2 ring-cyan-100 shadow-sm'
                      : 'bg-white/80 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Visual Node */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br ${
                        stage.illustrationGradient
                      } ${
                        isCompleted
                          ? 'ring-2 ring-emerald-200'
                          : isActive
                          ? 'ring-2 ring-cyan-200'
                          : 'opacity-70'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-white/90" />
                      ) : (
                        stage.icon
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Paso {stage.number}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-[#39A900]'
                              : isActive
                              ? 'bg-cyan-100 text-[#00324D]'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {stage.badgeText}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{stage.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {stage.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400 italic truncate">
                          {stage.requirement}
                        </span>

                        <button
                          onClick={() => handleStageAction(stage.actionType)}
                          disabled={isLocked}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-800'
                              : isActive
                              ? 'bg-[#39A900] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <span>{stage.actionLabel}</span>
                          {!isLocked && <ArrowRight className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. STEP 2 DEEP-DIVE: THE 5 SENA MODULES INTERACTIVE TRACKER */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-[#39A900] flex items-center justify-center font-bold text-xs">
                    02
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    Desglose de los 5 Módulos Formativos Oficiales
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Cada módulo aborda aspectos vitales del <strong>Acuerdo 009 de 2024 (Reglamento del Aprendiz)</strong> y la vida institucional.
                </p>
              </div>

              <div className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                {completedModulesCount} de {totalModules} Módulos Aprobados
              </div>
            </div>

            {/* Grid of the 5 modules with progress badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {INDUCTION_MODULES.map((module, i) => {
                const isCompleted = progress.completedModules.includes(module.id);
                const score = progress.moduleScores[module.id];

                return (
                  <div
                    key={module.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectModule(module.id);
                    }}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between text-left group ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-[#39A900] hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          MÓDULO 0{module.number}
                        </span>
                        {isCompleted ? (
                          <span className="text-[10px] font-bold text-[#39A900] bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {score ? `${score}%` : 'Aprobado'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.estimatedMinutes}m
                          </span>
                        )}
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#39A900] transition-colors line-clamp-2">
                        {module.title}
                      </h5>

                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {module.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">
                        {module.sections.length} Lecciones
                      </span>
                      <span
                        className={`font-bold flex items-center gap-0.5 ${
                          isCompleted ? 'text-[#39A900]' : 'text-slate-700'
                        }`}
                      >
                        <span>{isCompleted ? 'Repasar' : 'Estudiar'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. DIPLOMA PREVIEW & OFFICIAL CERTIFICATION CARD */}
          <div
            className={`rounded-2xl border p-6 md:p-8 transition-all ${
              isCertified
                ? 'bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-emerald-500/10 border-amber-300 shadow-md'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                      Hito Culminante
                    </span>
                    <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Constancia Oficial de Inducción Digital (40 Horas)
                    </h4>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {isCertified ? (
                    <span>
                      ¡Enhorabuena, <strong className="text-slate-900">{progress.apprenticeName}</strong>!
                      Has culminado exitosamente los 5 módulos formativos y la evaluación del Reglamento del Aprendiz.
                      Tu certificado oficial con firma de Subdirección de Centro y código digital de autenticidad ya está generado.
                    </span>
                  ) : (
                    <span>
                      Para recibir tu constancia institucional de 40 horas lectivas debes completar los 5 módulos
                      formativos y aprobar la Gran Evaluación Saber SENA con una calificación igual o superior al 70%.
                    </span>
                  )}
                </p>

                {/* Requirements Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        allModulesDone
                          ? 'bg-[#39A900] text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      ✓
                    </span>
                    <span>
                      5 Módulos temáticos aprobados ({completedModulesCount}/5)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        isFinalQuizPassed
                          ? 'bg-[#39A900] text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      ✓
                    </span>
                    <span>
                      Gran Reto Saber SENA aprobado (≥ 70%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Column */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200/80 text-center shadow-xs">
                <SenaLogo className="w-12 h-12 mb-3" />
                <span className="text-xs font-bold text-slate-800">
                  Diploma Oficial SENA
                </span>
                <span className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Ficha: {progress.fichaNumber}
                </span>

                <div className="w-full mt-4">
                  {isCertified ? (
                    <button
                      onClick={() => {
                        sounds.playCorrect();
                        onOpenCertificate();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#39A900] hover:bg-[#277500] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Descargar / Imprimir Certificado</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        if (allModulesDone) {
                          onStartFinalOlympiad();
                        } else {
                          const nextMod = INDUCTION_MODULES.find(m => !progress.completedModules.includes(m.id)) || INDUCTION_MODULES[0];
                          onSelectModule(nextMod.id);
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <span>
                        {allModulesDone ? 'Presentar Evaluación Final' : 'Continuar Ruta Formativa'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
