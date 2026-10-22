import React, { useState } from 'react';
import { InductionModule, LessonSection } from '../types/induction';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  Music, 
  Calendar, 
  CheckSquare, 
  Scale, 
  ExternalLink,
  Award
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ModuleViewerProps {
  module: InductionModule;
  isCompleted: boolean;
  score?: number;
  onStartQuiz: () => void;
  onNextModule?: () => void;
  onPrevModule?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({
  module,
  isCompleted,
  score,
  onStartQuiz,
  onNextModule,
  onPrevModule,
  hasPrev,
  hasNext
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [hymnPlaying, setHymnPlaying] = useState(false);

  const currentSection = module.sections[activeSectionIndex] || module.sections[0];

  const handleMarkSectionRead = (sectionId: string) => {
    sounds.playClick();
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
    }
    if (activeSectionIndex < module.sections.length - 1) {
      setActiveSectionIndex(prev => prev + 1);
    }
  };

  const toggleHymnPlayback = () => {
    sounds.playClick();
    setHymnPlaying(!hymnPlaying);
    if (!hymnPlaying) {
      sounds.playFanfare();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Module Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-[#00324D] text-white">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium tracking-wide">
            <span>MÓDULO {module.number} DE 5</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {module.estimatedMinutes} min lectura estimada
            </span>
            <span aria-hidden="true">·</span>
            <span>{module.officialAgreement}</span>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#39A900] px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>Aprobado ({score ?? 100}%)</span>
            </div>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
          {module.title}
        </h2>
        <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
          {module.summary}
        </p>

        {/* Section Progress bar */}
        <div className="mt-6 flex items-center gap-2">
          {module.sections.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => {
                sounds.playClick();
                setActiveSectionIndex(idx);
              }}
              className={`h-2 flex-1 rounded-full transition-all ${
                activeSectionIndex === idx
                  ? 'bg-[#39A900] ring-2 ring-[#39A900]/30'
                  : completedSections.includes(sec.id)
                  ? 'bg-emerald-600'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              title={sec.title}
            />
          ))}
        </div>
      </div>

      {/* Main Two-Zone Reading View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Left Submenu of Sections */}
        <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/70 p-4 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Contenido Temático
            </h3>
            <div className="space-y-2">
              {module.sections.map((section, idx) => {
                const isCurrent = activeSectionIndex === idx;
                const isRead = completedSections.includes(section.id);
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveSectionIndex(idx);
                    }}
                    className={`w-full text-left p-3.5 rounded-lg transition-all text-xs flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                        : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                        isCurrent
                          ? 'bg-[#39A900] text-white'
                          : isRead
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{section.title}</div>
                      {section.subtitle && (
                        <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                          {section.subtitle}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Quiz Callout */}
          <div className="mt-8 p-4 bg-emerald-50/80 rounded-xl border border-emerald-100 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
              <Award className="w-4 h-4 text-[#39A900]" />
              <span>Evaluación del Módulo</span>
            </div>
            <p className="text-emerald-700 text-[11px] mb-3 leading-normal">
              Demuestra tu conocimiento del tema respondiendo las 3 preguntas gamificadas. Obtendrás hasta +180 XP e insignias oficiales.
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                onStartQuiz();
              }}
              className="w-full py-2.5 px-4 bg-[#39A900] hover:bg-[#277500] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs shadow-xs"
            >
              <span>{isCompleted ? 'Repetir Evaluación' : 'Iniciar Cuestionario'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Content Canvas */}
        <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Section Header */}
            <div className="border-b border-slate-100 pb-4 mb-6">
              <div className="text-xs text-slate-400 font-medium mb-1">
                Lección {activeSectionIndex + 1} de {module.sections.length}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {currentSection.title}
              </h3>
              {currentSection.subtitle && (
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  {currentSection.subtitle}
                </p>
              )}
              {currentSection.regulatoryReference && (
                <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#00324D] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                  <Scale className="w-3.5 h-3.5 text-[#00324D]" />
                  <span>{currentSection.regulatoryReference}</span>
                </div>
              )}
            </div>

            {/* Section Body */}
            <div className="prose prose-slate max-w-none text-sm md:text-base leading-relaxed text-slate-700 space-y-4">
              {currentSection.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>
                  {paragraph.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-900">{part}</strong> : part
                  )}
                </p>
              ))}
            </div>

            {/* Highlights List */}
            {currentSection.highlights && currentSection.highlights.length > 0 && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-[#39A900]" />
                  Puntos Clave a Recordar
                </h4>
                <ul className="space-y-1.5 text-xs md:text-sm text-slate-600">
                  {currentSection.highlights.map((item, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <span className="text-[#39A900] font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interactive Timeline */}
            {currentSection.interactiveElement?.type === 'timeline' && (
              <div className="mt-6 p-5 bg-white border border-slate-200 rounded-xl">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#39A900]" />
                  Línea de Tiempo Histórica
                </h4>
                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {currentSection.interactiveElement.data.map((item: any, tIdx: number) => (
                    <div key={tIdx} className="relative flex items-start gap-4 pl-8">
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#39A900] ring-4 ring-emerald-50" />
                      <div>
                        <span className="font-bold text-xs text-[#00324D]">{item.year}</span>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Hymn Player */}
            {currentSection.interactiveElement?.type === 'audio-hymn' && (
              <div className="mt-6 p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Himno del SENA (Letra Oficial)
                    </h4>
                  </div>
                  <button
                    onClick={toggleHymnPlayback}
                    className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors font-medium flex items-center gap-1.5"
                  >
                    <span>{hymnPlaying ? 'Pausar Fanfarria' : 'Entonar Fanfarria'}</span>
                  </button>
                </div>
                <blockquote className="italic text-sm text-emerald-100 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-emerald-500 my-2">
                  {currentSection.interactiveElement.data.lyrics}
                </blockquote>
                <div className="text-[11px] text-emerald-300/80 mt-2">
                  Letra: Jesús Briceño Sánchez · Música: Luis Alfredo Sarmiento
                </div>
              </div>
            )}
          </div>

          {/* Bottom Step Actions */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              onClick={() => {
                if (activeSectionIndex > 0) {
                  sounds.playClick();
                  setActiveSectionIndex(prev => prev - 1);
                } else if (onPrevModule && hasPrev) {
                  sounds.playClick();
                  onPrevModule();
                }
              }}
              disabled={activeSectionIndex === 0 && !hasPrev}
              className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
                activeSectionIndex === 0 && !hasPrev
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{activeSectionIndex > 0 ? 'Lección Anterior' : 'Módulo Anterior'}</span>
            </button>

            {activeSectionIndex < module.sections.length - 1 ? (
              <button
                onClick={() => handleMarkSectionRead(currentSection.id)}
                className="text-xs font-semibold px-5 py-2.5 rounded-lg bg-[#39A900] text-white hover:bg-[#277500] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Continuar a Lección {activeSectionIndex + 2}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  onStartQuiz();
                }}
                className="text-xs font-semibold px-5 py-2.5 rounded-lg bg-[#00324D] text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Presentar Evaluación Gamificada</span>
                <Award className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
