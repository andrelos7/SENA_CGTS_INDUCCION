/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SenaLogo } from './components/SenaLogo';
import { ModuleViewer } from './components/ModuleViewer';
import { GamifiedQuiz } from './components/GamifiedQuiz';
import { CaseSimulator } from './components/CaseSimulator';
import { RegulationSearchDrawer } from './components/RegulationSearchDrawer';
import { CertificateModal } from './components/CertificateModal';
import { InstructorConsole } from './components/InstructorConsole';
import { InstructorAccessModal } from './components/InstructorAccessModal';
import { ApprenticeOnboardingModal } from './components/ApprenticeOnboardingModal';
import { RoleLandingPage } from './components/RoleLandingPage';
import { ApprenticeRoadmap } from './components/ApprenticeRoadmap';
import { INDUCTION_MODULES, SENA_BADGES } from './data/inductionData';
import { INITIAL_COHORT_STUDENTS } from './data/mockCohort';
import { ApprenticeProgress, CohortStudent } from './types/induction';
import { queueAutoSync } from './services/googleSheetsService';
import { sounds } from './utils/soundEffects';
import { 
  Award, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Scale, 
  ExternalLink,
  RotateCcw,
  Sparkles,
  UserCheck,
  Edit3,
  Compass
} from 'lucide-react';

const CAMPUS_IMG = '/src/assets/images/sena_campus_modern_1792593157865.jpg';
const APPRENTICES_IMG = '/src/assets/images/sena_apprentices_learning_1792593171388.jpg';
const BADGE_IMG = '/src/assets/images/sena_achievement_badge_1792593171865.jpg';

export default function App() {
  const [appScreen, setAppScreen] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<
    'modules' | 'quiz' | 'cases' | 'tracking' | 'certificate' | 'regulations' | 'roadmap'
  >('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('modulo-1');
  const [userRole, setUserRole] = useState<'aprendiz' | 'instructor'>('aprendiz');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState(INDUCTION_MODULES[0].quiz);
  const [quizTitle, setQuizTitle] = useState(INDUCTION_MODULES[0].title);
  const [quizModuleNumber, setQuizModuleNumber] = useState<number | undefined>(1);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showInstructorAccessModal, setShowInstructorAccessModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [cohortStudents, setCohortStudents] = useState<CohortStudent[]>(INITIAL_COHORT_STUDENTS);
  const [instructorProfile, setInstructorProfile] = useState<{ name: string; documentId: string }>(() => {
    const saved = localStorage.getItem('sena_instructor_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { name: 'Andrés Téllez', documentId: '1032456789' };
  });

  // Apprentice progress state
  const [progress, setProgress] = useState<ApprenticeProgress>(() => {
    const saved = localStorage.getItem('sena_induction_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      apprenticeName: 'Santiago Morales Pineda',
      documentId: '1037648920',
      programName: 'Análisis y Desarrollo de Software (ADSO)',
      fichaNumber: '2714520',
      regional: 'Regional Antioquia — Centro de Formación en Tecnologías',
      centerName: 'Centro de Tecnología de la Manufactura Avanzada',
      completedModules: ['modulo-1'],
      moduleScores: { 'modulo-1': 100 },
      totalXP: 160,
      streakDays: 3,
      badges: ['badge-identidad'],
      finalQuizPassed: false
    };
  });

  // Check URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('rol') || params.get('mode');
      const urlFicha = params.get('ficha');

      if (urlFicha) {
        setProgress(prev => ({
          ...prev,
          fichaNumber: urlFicha
        }));
      }

      if (urlRole === 'instructor') {
        setUserRole('instructor');
        setActiveTab('tracking');
        setAppScreen('app');
      } else if (urlRole === 'aprendiz') {
        setUserRole('aprendiz');
        setActiveTab('modules');
        setAppScreen('app');
      }
    }
  }, []);

  // Sync progress changes to localStorage and automated background Google Sheets
  useEffect(() => {
    localStorage.setItem('sena_induction_progress', JSON.stringify(progress));
    // Automatically sync in background to Google Sheets in Drive
    queueAutoSync(progress, cohortStudents);
  }, [progress, cohortStudents]);

  const activeModuleIndex = INDUCTION_MODULES.findIndex(m => m.id === selectedModuleId);
  const activeModule = INDUCTION_MODULES[activeModuleIndex] || INDUCTION_MODULES[0];

  const completedCount = progress.completedModules.length;
  const progressPercent = Math.round((completedCount / INDUCTION_MODULES.length) * 100);

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setSoundMuted(muted);
  };

  const handleStartModuleQuiz = (mod = activeModule) => {
    sounds.playClick();
    setQuizQuestions(mod.quiz);
    setQuizTitle(`Evaluación: ${mod.title}`);
    setQuizModuleNumber(mod.number);
    setIsQuizMode(true);
    setActiveTab('quiz');
  };

  const handleStartFullOlympiad = () => {
    sounds.playClick();
    const allQuestions = INDUCTION_MODULES.flatMap(m => m.quiz);
    setQuizQuestions(allQuestions);
    setQuizTitle('Gran Reto Saber SENA: Inducción Integral');
    setQuizModuleNumber(undefined);
    setIsQuizMode(true);
    setActiveTab('quiz');
  };

  const handleQuizCompleted = (scorePercentage: number, xpEarned: number) => {
    setProgress(prev => {
      const isApproved = scorePercentage >= 70;
      const updatedModules = isApproved && !prev.completedModules.includes(activeModule.id)
        ? [...prev.completedModules, activeModule.id]
        : prev.completedModules;

      const newScores = { ...prev.moduleScores };
      if (activeModule.id) {
        newScores[activeModule.id] = Math.max(newScores[activeModule.id] || 0, scorePercentage);
      }

      const newBadges = [...prev.badges];
      const correspondingBadge = SENA_BADGES.find(b => b.unlockedAtModule === activeModule.number);
      if (correspondingBadge && !newBadges.includes(correspondingBadge.id) && isApproved) {
        newBadges.push(correspondingBadge.id);
      }

      const allCompleted = updatedModules.length === INDUCTION_MODULES.length;
      if (allCompleted && !newBadges.includes('badge-maestro')) {
        newBadges.push('badge-maestro');
      }

      return {
        ...prev,
        completedModules: updatedModules,
        moduleScores: newScores,
        totalXP: prev.totalXP + xpEarned,
        badges: newBadges,
        finalQuizPassed: allCompleted,
        finalQuizScore: scorePercentage,
        inductionCompletedAt: allCompleted ? new Date().toISOString() : prev.inductionCompletedAt
      };
    });
  };

  const handleEnterAsApprentice = (data: {
    apprenticeName: string;
    documentId: string;
    programName: string;
    fichaNumber: string;
    regional: string;
  }) => {
    sounds.playCorrect();
    setProgress(prev => ({
      ...prev,
      apprenticeName: data.apprenticeName,
      documentId: data.documentId,
      programName: data.programName,
      fichaNumber: data.fichaNumber,
      regional: data.regional
    }));
    setUserRole('aprendiz');
    setActiveTab('modules');
    setAppScreen('app');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('rol', 'aprendiz');
      url.searchParams.set('ficha', data.fichaNumber);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleEnterAsInstructor = (data?: { name: string; documentId: string }) => {
    sounds.playCorrect();
    if (data) {
      setInstructorProfile(data);
    }
    setUserRole('instructor');
    setActiveTab('tracking');
    setAppScreen('app');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('rol', 'instructor');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleExitToLanding = () => {
    sounds.playClick();
    setAppScreen('landing');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('rol');
      url.searchParams.delete('mode');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSwitchToInstructor = (data?: { name: string; documentId: string }) => {
    if (data) {
      setInstructorProfile(data);
    }
    setUserRole('instructor');
    setActiveTab('tracking');
    setShowInstructorAccessModal(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('rol', 'instructor');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSwitchToApprentice = () => {
    sounds.playClick();
    setUserRole('aprendiz');
    setActiveTab('modules');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('rol', 'aprendiz');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleResetProgress = () => {
    sounds.playClick();
    if (window.confirm('¿Deseas reiniciar tu progreso de inducción para realizarla desde el inicio?')) {
      setProgress({
        apprenticeName: 'Santiago Morales Pineda',
        documentId: '1037648920',
        programName: 'Análisis y Desarrollo de Software (ADSO)',
        fichaNumber: '2714520',
        regional: 'Regional Antioquia — Centro de Formación en Tecnologías',
        centerName: 'Centro de Tecnología de la Manufactura Avanzada',
        completedModules: [],
        moduleScores: {},
        totalXP: 0,
        streakDays: 1,
        badges: [],
        finalQuizPassed: false
      });
      setSelectedModuleId('modulo-1');
      setIsQuizMode(false);
      setActiveTab('modules');
    }
  };

  if (appScreen === 'landing') {
    return (
      <RoleLandingPage
        onEnterAsApprentice={handleEnterAsApprentice}
        onEnterAsInstructor={handleEnterAsInstructor}
        initialFicha={progress.fichaNumber}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 overflow-x-hidden w-full">
      {/* Top Bar with Distinct Navigation per Role */}
      <Header
        activeTab={activeTab}
        setActiveTab={tab => {
          if (tab !== 'quiz') setIsQuizMode(false);
          if (tab === 'certificate') {
            setShowCertificateModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        progressPercent={progressPercent}
        totalXP={progress.totalXP}
        userRole={userRole}
        onRequestInstructorAccess={() => setShowInstructorAccessModal(true)}
        onSwitchToApprenticeView={handleSwitchToApprentice}
        onExitToLanding={handleExitToLanding}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 overflow-x-hidden w-full">
        {/* ========================================================================= */}
        {/* VIEW 1: INSTRUCTOR CONSOLE (When in instructor mode and on tracking tab) */}
        {/* ========================================================================= */}
        {userRole === 'instructor' && activeTab === 'tracking' ? (
          <InstructorConsole
            currentApprentice={progress}
            cohortStudents={cohortStudents}
            instructorProfile={instructorProfile}
            onSwitchToApprenticeView={handleSwitchToApprentice}
            onUpdateApprenticeProgress={updated => setProgress(prev => ({ ...prev, ...updated }))}
          />
        ) : (
          /* ======================================================================= */
          /* VIEW 2: APPRENTICE PORTAL (Or previewing content as instructor)         */
          /* ======================================================================= */
          <>
            {/* Apprentice Profile Identity Strip */}
            <div className="bg-white border-b border-slate-200 py-2.5 sm:py-3 px-3 sm:px-6 lg:px-8 w-full overflow-x-clip">
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Apprentice Info with Edit Button */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#00324D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {progress.apprenticeName.charAt(0)}
                  </div>
                  <div className="leading-tight min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 truncate max-w-[140px] sm:max-w-[220px]">
                        {progress.apprenticeName}
                      </span>
                      {userRole === 'aprendiz' && (
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setShowOnboardingModal(true);
                          }}
                          className="text-[11px] font-semibold text-[#39A900] hover:underline flex items-center gap-0.5 shrink-0"
                          title="Cambiar mi nombre, documento o ficha"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span className="hidden xs:inline">Editar mis datos</span>
                        </button>
                      )}
                    </div>
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block truncate">
                      CC <strong className="text-slate-700 font-mono">{progress.documentId}</strong> · Ficha <strong className="text-slate-700 font-mono">{progress.fichaNumber}</strong>
                    </span>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-3 sm:gap-5 flex-wrap shrink-0">
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium hidden sm:inline">Progreso Inducción:</span>
                    <div className="w-16 sm:w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#39A900] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {progressPercent}%
                    </span>
                  </div>

                  {/* XP points */}
                  <div className="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                    <Zap className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                    <span className="tabular-nums text-xs">{progress.totalXP} XP</span>
                  </div>

                  {/* Badges count */}
                  <div className="hidden md:flex items-center gap-1.5 font-medium text-slate-600">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{progress.badges.length} de {SENA_BADGES.length} Insignias</span>
                  </div>

                  {/* Reset action */}
                  <button
                    onClick={handleResetProgress}
                    title="Reiniciar progreso para demostración"
                    className="text-slate-400 hover:text-slate-700 text-[11px] underline ml-1"
                  >
                    Reiniciar
                  </button>
                </div>
              </div>
            </div>

            {/* Tab: Induction Modules View */}
            {activeTab === 'modules' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                {/* Hero Split Section */}
                <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#00324D] uppercase tracking-wider mb-3">
                        <ShieldCheck className="w-4 h-4 text-[#39A900]" />
                        <span>Portal Oficial de Inducción SENA 2026</span>
                      </div>

                      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Bienvenido a la Formación Profesional Integral
                      </h1>

                      <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                        Inicia tu proceso de inducción en la entidad más querida por los colombianos. Conoce tus derechos, asume tus deberes bajo el{' '}
                        <strong className="text-slate-900 font-semibold">
                          Acuerdo 009 de 2024
                        </strong>
                        , supera los desafíos gamificados y obtén tu certificación oficial.
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          const firstIncomplete =
                            INDUCTION_MODULES.find(m => !progress.completedModules.includes(m.id)) ||
                            INDUCTION_MODULES[0];
                          setSelectedModuleId(firstIncomplete.id);
                          const el = document.getElementById('modulo-canvas');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-3 rounded-xl bg-[#39A900] hover:bg-[#277500] text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs"
                      >
                        <span>
                          {progressPercent >= 100 ? 'Repasar Módulos' : 'Continuar con la Inducción'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleStartFullOlympiad}
                        className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2"
                      >
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>Gran Desafío Saber SENA</span>
                      </button>

                      <button
                        onClick={() => {
                          sounds.playClick();
                          setActiveTab('roadmap');
                        }}
                        className="px-5 py-3 rounded-xl bg-[#00324D] hover:bg-[#00273D] text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs"
                      >
                        <Compass className="w-4 h-4 text-[#68D938]" />
                        <span>Ver Ruta Ilustrada a la Certificación</span>
                      </button>
                    </div>
                  </div>

                  {/* Hero Image Container */}
                  <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-900">
                    <img
                      src={CAMPUS_IMG}
                      alt="Centro de Formación Tecnológica SENA"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
                    <div className="absolute bottom-4 left-4 right-4 text-white p-3 bg-black/40 backdrop-blur-md rounded-xl text-xs border border-white/10 hidden sm:block">
                      <span className="font-semibold block">Centro de Formación e Innovación</span>
                      <span className="text-[11px] text-slate-300">Formación Profesional Integral para el futuro de Colombia</span>
                    </div>
                  </div>
                </section>

                {/* GRAPHICAL ILLUSTRATED ROADMAP TO SENA CERTIFICATION */}
                <ApprenticeRoadmap
                  progress={progress}
                  onSelectModule={moduleId => {
                    sounds.playClick();
                    setSelectedModuleId(moduleId);
                    const el = document.getElementById('modulo-canvas');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onStartQuiz={modNum => {
                    if (modNum) {
                      const mod = INDUCTION_MODULES.find(m => m.number === modNum);
                      if (mod) handleStartModuleQuiz(mod);
                    } else {
                      handleStartFullOlympiad();
                    }
                  }}
                  onStartFinalOlympiad={handleStartFullOlympiad}
                  onOpenCertificate={() => {
                    sounds.playCorrect();
                    setShowCertificateModal(true);
                  }}
                  onOpenCases={() => {
                    sounds.playClick();
                    setActiveTab('cases');
                  }}
                  onOpenRegulations={() => {
                    sounds.playClick();
                    setActiveTab('regulations');
                  }}
                  onEditApprenticeData={() => {
                    sounds.playClick();
                    setShowOnboardingModal(true);
                  }}
                />

                {/* Modules Grid Tabs */}
                <div id="modulo-canvas" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Ruta de Aprendizaje (5 Módulos Oficiales)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Selecciona un módulo para estudiar sus lecciones y presentar su evaluación interactiva.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {completedCount} de {INDUCTION_MODULES.length} aprobados
                    </span>
                  </div>

                  {/* 5 Module Selectable Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {INDUCTION_MODULES.map(m => {
                      const isSelected = selectedModuleId === m.id;
                      const isCompleted = progress.completedModules.includes(m.id);
                      const score = progress.moduleScores[m.id];

                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedModuleId(m.id);
                          }}
                          className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-white border-[#39A900] shadow-sm ring-2 ring-[#39A900]/20'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Módulo 0{m.number}
                              </span>
                              {isCompleted ? (
                                <span className="text-[11px] font-bold text-[#39A900] flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {score ? `${score}%` : 'Listo'}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {m.estimatedMinutes}m
                                </span>
                              )}
                            </div>

                            <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                              {m.title}
                            </h3>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 truncate max-w-[120px]">
                              {m.sections.length} temas
                            </span>
                            <span
                              className={`font-semibold ${
                                isSelected ? 'text-[#39A900]' : 'text-slate-400'
                              }`}
                            >
                              {isSelected ? 'Abierto' : 'Ver'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Module Viewer */}
                <ModuleViewer
                  module={activeModule}
                  isCompleted={progress.completedModules.includes(activeModule.id)}
                  score={progress.moduleScores[activeModule.id]}
                  onStartQuiz={() => handleStartModuleQuiz(activeModule)}
                  onNextModule={() => {
                    if (activeModuleIndex < INDUCTION_MODULES.length - 1) {
                      setSelectedModuleId(INDUCTION_MODULES[activeModuleIndex + 1].id);
                    }
                  }}
                  onPrevModule={() => {
                    if (activeModuleIndex > 0) {
                      setSelectedModuleId(INDUCTION_MODULES[activeModuleIndex - 1].id);
                    }
                  }}
                  hasNext={activeModuleIndex < INDUCTION_MODULES.length - 1}
                  hasPrev={activeModuleIndex > 0}
                />

                {/* Badges Showcase Section */}
                <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        Insignias y Logros de Inducción
                      </h3>
                      <p className="text-xs text-slate-500">
                        Gana insignias oficiales aprobando las evaluaciones gamificadas de cada módulo.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-[#39A900]">
                      {progress.badges.length} / {SENA_BADGES.length} Desbloqueadas
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {SENA_BADGES.map(badge => {
                      const isUnlocked = progress.badges.includes(badge.id);
                      return (
                        <div
                          key={badge.id}
                          className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                            isUnlocked
                              ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                              : 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60'
                          }`}
                        >
                          <div className="text-3xl mb-2">{badge.icon}</div>
                          <div>
                            <div className="text-xs font-bold mb-1 line-clamp-1">
                              {badge.name}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                              {badge.description}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-200/60 w-full text-[10px] font-bold">
                            {isUnlocked ? (
                              <span className="text-[#39A900]">✓ Conquistada</span>
                            ) : (
                              <span className="text-slate-400">Bloqueada</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* Tab: Gamified Quiz Mode */}
            {activeTab === 'quiz' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <GamifiedQuiz
                  title={quizTitle}
                  moduleNumber={quizModuleNumber}
                  questions={quizQuestions}
                  onComplete={handleQuizCompleted}
                  onExit={() => {
                    setIsQuizMode(false);
                    setActiveTab('modules');
                  }}
                />
              </div>
            )}

            {/* Tab: Dilemma Cases Simulator */}
            {activeTab === 'cases' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <CaseSimulator
                  onCaseSolved={(id, isCorrect) => {
                    if (isCorrect) {
                      setProgress(prev => ({
                        ...prev,
                        totalXP: prev.totalXP + 80
                      }));
                    }
                  }}
                />
              </div>
            )}

            {/* Tab: Regulation Compendium Explorer */}
            {activeTab === 'regulations' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <RegulationSearchDrawer />
              </div>
            )}

            {/* Tab: Illustrated Roadmap View */}
            {activeTab === 'roadmap' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <ApprenticeRoadmap
                  progress={progress}
                  onSelectModule={moduleId => {
                    sounds.playClick();
                    setSelectedModuleId(moduleId);
                    setActiveTab('modules');
                    setTimeout(() => {
                      document.getElementById('modulo-canvas')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  onStartQuiz={modNum => {
                    if (modNum) {
                      const mod = INDUCTION_MODULES.find(m => m.number === modNum);
                      if (mod) handleStartModuleQuiz(mod);
                    } else {
                      handleStartFullOlympiad();
                    }
                  }}
                  onStartFinalOlympiad={handleStartFullOlympiad}
                  onOpenCertificate={() => {
                    sounds.playCorrect();
                    setShowCertificateModal(true);
                  }}
                  onOpenCases={() => {
                    sounds.playClick();
                    setActiveTab('cases');
                  }}
                  onOpenRegulations={() => {
                    sounds.playClick();
                    setActiveTab('regulations');
                  }}
                  onEditApprenticeData={() => {
                    sounds.playClick();
                    setShowOnboardingModal(true);
                  }}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          progress={progress}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* Instructor Protected Access Modal */}
      <InstructorAccessModal
        isOpen={showInstructorAccessModal}
        onClose={() => setShowInstructorAccessModal(false)}
        onSuccess={handleSwitchToInstructor}
        initialName={instructorProfile.name}
        initialDoc={instructorProfile.documentId}
      />

      {/* Apprentice Personalization Modal */}
      <ApprenticeOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        currentData={progress}
        onSave={updated => {
          setProgress(prev => ({ ...prev, ...updated }));
        }}
      />

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <SenaLogo className="w-8 h-8" color="#39A900" />
                <span className="text-white font-bold text-sm tracking-tight">
                  SENA Colombia
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Servicio Nacional de Aprendizaje. Entidad pública de formación técnica y tecnológica adscrita al Ministerio del Trabajo de Colombia.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Marco Normativo
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveTab('regulations');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Acuerdo 009 de 2024 (Reglamento del Aprendiz)
                  </button>
                </li>
                <li>
                  <span className="text-slate-500">Decreto Ley 118 de 1957 (Creación)</span>
                </li>
                <li>
                  <span className="text-slate-500">Ley 119 de 1994 (Reestructuración)</span>
                </li>
                <li>
                  <span className="text-slate-500">Ley 789 de 2002 (Contrato Aprendizaje)</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Plataformas del SENA
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.sena.edu.co"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Portal Oficial (sena.edu.co)</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <span className="text-slate-500">Zajuna LMS Oficial</span>
                </li>
                <li>
                  <span className="text-slate-500">SENA SOFIA Plus</span>
                </li>
                <li>
                  <span className="text-slate-500">Agencia Pública de Empleo (APE)</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Atención al Ciudadano
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Línea gratuita nacional: 01 8000 910 270<br />
                Bogotá: (601) 343 0111<br />
                Horario: Lunes a Viernes 7:00 a.m. a 7:00 p.m.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 Servicio Nacional de Aprendizaje SENA · Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-4">
              <span>República de Colombia</span>
              <span>·</span>
              <span>Reglamento Vigente: Acuerdo 009 de 2024</span>
              <span>·</span>
              <button
                onClick={() => {
                  if (userRole === 'aprendiz') {
                    setShowInstructorAccessModal(true);
                  } else {
                    handleSwitchToApprentice();
                  }
                }}
                className="text-slate-400 hover:text-white underline font-semibold"
              >
                {userRole === 'aprendiz' ? 'Acceso Instructor' : 'Cambiar a Portal Aprendiz'}
              </button>
              <span>·</span>
              <button
                onClick={handleExitToLanding}
                className="text-slate-400 hover:text-white underline font-semibold"
              >
                Salir a la Portada
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
