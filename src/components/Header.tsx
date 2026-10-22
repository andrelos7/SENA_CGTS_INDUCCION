import React from 'react';
import { SenaLogo } from './SenaLogo';
import { Volume2, VolumeX, Shield, Award, Users, BookOpen, Key, Eye, ExternalLink, LogOut, Compass } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  activeTab: 'modules' | 'quiz' | 'cases' | 'tracking' | 'certificate' | 'regulations' | 'roadmap';
  setActiveTab: (tab: 'modules' | 'quiz' | 'cases' | 'tracking' | 'certificate' | 'regulations' | 'roadmap') => void;
  progressPercent: number;
  totalXP: number;
  userRole: 'aprendiz' | 'instructor';
  onRequestInstructorAccess: () => void;
  onSwitchToApprenticeView: () => void;
  onExitToLanding: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  progressPercent,
  totalXP,
  userRole,
  onRequestInstructorAccess,
  onSwitchToApprenticeView,
  onExitToLanding,
  soundMuted,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 h-16 min-w-0">
          {/* Zone 1: Brand & Logo */}
          <button
            onClick={() => {
              sounds.playClick();
              if (userRole === 'instructor') {
                setActiveTab('tracking');
              } else {
                setActiveTab('modules');
              }
            }}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group shrink-0 min-w-0"
            title="Ir a la página principal"
          >
            <SenaLogo className="w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105 shrink-0" />
            <div className="leading-tight min-w-0">
              <div className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                <span>SENA</span>
                <span className="text-[#39A900]">Inducción</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate max-w-[120px] sm:max-w-[200px]">
                {userRole === 'instructor' ? (
                  <strong className="text-[#00324D] font-bold">Consola Instructor</strong>
                ) : (
                  'Portal del Aprendiz'
                )}
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links (adaptive text labels to prevent overflow between 768px and 1280px) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 xl:gap-5 text-xs lg:text-sm font-medium text-slate-600 min-w-0">
            {userRole === 'instructor' ? (
              <>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('tracking');
                  }}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1.5 px-2 border-b-2 ${
                    activeTab === 'tracking'
                      ? 'text-[#39A900] border-[#39A900] font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <span className="hidden xl:inline">Panel de Control & Cohortes</span>
                  <span className="inline xl:hidden">Cohortes & Panel</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('modules');
                  }}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1.5 px-2 border-b-2 ${
                    activeTab === 'modules'
                      ? 'text-[#39A900] border-[#39A900] font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <span className="hidden xl:inline">Contenido de Módulos</span>
                  <span className="inline xl:hidden">Módulos</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('regulations');
                  }}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1.5 px-2 border-b-2 ${
                    activeTab === 'regulations'
                      ? 'text-[#39A900] border-[#39A900] font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <span className="hidden xl:inline">Reglamento (Acuerdo 009)</span>
                  <span className="inline xl:hidden">Reglamento</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('roadmap');
                  }}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1.5 px-2 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'roadmap'
                      ? 'text-[#39A900] border-[#39A900] font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span className="hidden xl:inline">Mi Ruta Ilustrada</span>
                  <span className="inline xl:hidden">Mi Ruta</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('modules');
                  }}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1.5 px-2 border-b-2 ${
                    activeTab === 'modules'
                      ? 'text-[#39A900] border-[#39A900] font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <span className="hidden xl:inline">Módulos de Inducción</span>
                  <span className="inline xl:hidden">Módulos</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('quiz');
                  }}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1.5 px-2 border-b-2 ${
                    activeTab === 'quiz'
                      ? 'text-[#39A900] border-[#39A900] font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <span className="hidden xl:inline">Desafío Gamificado</span>
                  <span className="inline xl:hidden">Desafío</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('cases');
                  }}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1.5 px-2 border-b-2 ${
                    activeTab === 'cases'
                      ? 'text-[#39A900] border-[#39A900] font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <span className="hidden xl:inline">Simulador de Casos</span>
                  <span className="inline xl:hidden">Casos</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('regulations');
                  }}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1.5 px-2 border-b-2 ${
                    activeTab === 'regulations'
                      ? 'text-[#39A900] border-[#39A900] font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <span className="hidden xl:inline">Reglamento Oficial</span>
                  <span className="inline xl:hidden">Reglamento</span>
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Utility and Actions group */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
            {/* Audio Feedback toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                onToggleSound();
              }}
              title={soundMuted ? 'Activar sonido del juego' : 'Silenciar efectos'}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#39A900]" />}
            </button>

            {userRole === 'instructor' ? (
              /* Instructor Actions */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onSwitchToApprenticeView();
                  }}
                  className="px-2.5 sm:px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                  title="Cambiar a vista previa de aprendiz"
                >
                  <Eye className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                  <span className="hidden sm:inline">Modo Aprendiz</span>
                  <span className="sm:hidden">Aprendiz</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onExitToLanding();
                  }}
                  title="Salir a la pantalla de selección de rol"
                  className="px-2 sm:px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              /* Apprentice Actions */
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Certificate Quick Access */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('certificate');
                  }}
                  title={progressPercent >= 100 ? '¡Felicitaciones! Descargar Certificado Oficial' : `Certificado (${progressPercent}% completado)`}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    progressPercent >= 100
                      ? 'bg-[#39A900] text-white hover:bg-[#277500] shadow-xs animate-bounce'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">
                    {progressPercent >= 100 ? 'Descargar Certificado' : 'Certificado'}
                  </span>
                  <span className="sm:hidden">
                    {progressPercent >= 100 ? 'Certificado' : `${progressPercent}%`}
                  </span>
                </button>

                {/* Restricted Access Switcher for Instructor */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    onRequestInstructorAccess();
                  }}
                  title="Acceso para instructores con clave de 4 dígitos"
                  className="px-2 sm:px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                >
                  <Key className="w-3.5 h-3.5 text-[#00324D] shrink-0" />
                  <span className="hidden sm:inline">Instructor</span>
                </button>

                {/* Exit to Landing Page */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    onExitToLanding();
                  }}
                  title="Cambiar de rol o salir a la pantalla principal"
                  className="px-2 sm:px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar - Compact, smoothly scrollable, overflow-proof */}
        <div className="flex md:hidden overflow-x-auto py-2 px-0.5 gap-1.5 text-xs border-t border-slate-100 no-scrollbar items-center">
          {userRole === 'instructor' ? (
            <>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('tracking');
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all font-medium ${
                  activeTab === 'tracking'
                    ? 'bg-[#39A900] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Panel Instructor
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('modules');
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all font-medium ${
                  activeTab === 'modules'
                    ? 'bg-[#39A900] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Módulos
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('regulations');
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all font-medium ${
                  activeTab === 'regulations'
                    ? 'bg-[#39A900] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Reglamento
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onExitToLanding();
                }}
                className="px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('roadmap');
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 flex items-center gap-1 transition-all font-medium ${
                  activeTab === 'roadmap'
                    ? 'bg-[#39A900] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Mi Ruta</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('modules');
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all font-medium ${
                  activeTab === 'modules'
                    ? 'bg-[#39A900] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Módulos
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('quiz');
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all font-medium ${
                  activeTab === 'quiz'
                    ? 'bg-[#39A900] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Desafío
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('cases');
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all font-medium ${
                  activeTab === 'cases'
                    ? 'bg-[#39A900] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Casos
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('regulations');
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all font-medium ${
                  activeTab === 'regulations'
                    ? 'bg-[#39A900] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Reglamento
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onExitToLanding();
                }}
                className="px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium transition-colors"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
