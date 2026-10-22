import React, { useState } from 'react';
import { REGULATION_CASE_STUDIES } from '../data/inductionData';
import { CaseScenario } from '../types/induction';
import { 
  Users, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface CaseSimulatorProps {
  onCaseSolved?: (scenarioId: string, isCorrect: boolean) => void;
}

export const CaseSimulator: React.FC<CaseSimulatorProps> = ({ onCaseSolved }) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasDecided, setHasDecided] = useState(false);

  const currentCase: CaseScenario = REGULATION_CASE_STUDIES[selectedCaseIndex];
  const currentDecision = selectedOptionIndex !== null ? currentCase.options[selectedOptionIndex] : null;

  const handleChooseOption = (idx: number) => {
    sounds.playClick();
    setSelectedOptionIndex(idx);
    setHasDecided(true);

    const chosen = currentCase.options[idx];
    if (chosen.isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    if (onCaseSolved) {
      onCaseSolved(currentCase.id, chosen.isCorrect);
    }
  };

  const handleResetCase = () => {
    sounds.playClick();
    setSelectedOptionIndex(null);
    setHasDecided(false);
  };

  const handleNextCase = () => {
    sounds.playClick();
    if (selectedCaseIndex < REGULATION_CASE_STUDIES.length - 1) {
      setSelectedCaseIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setHasDecided(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00324D]">
            <Scale className="w-4 h-4 text-[#39A900]" />
            <span>TALLER PRÁCTICO DE CONVIVENCIA Y DEBIDO PROCESO</span>
          </div>
          <span className="text-xs text-slate-500">
            Caso {selectedCaseIndex + 1} de {REGULATION_CASE_STUDIES.length}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Simulador de Dilemas y Casos del Reglamento
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Enfréntate a situaciones cotidianas reales que viven los aprendices en los Centros de Formación. Toma la decisión que consideres correcta y descubre sus consecuencias formativas bajo el Acuerdo 009 de 2024.
        </p>

        {/* Case Selector Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          {REGULATION_CASE_STUDIES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCaseIndex(idx);
                setSelectedOptionIndex(null);
                setHasDecided(false);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCaseIndex === idx
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Caso {idx + 1}: {c.character}
            </button>
          ))}
        </div>
      </div>

      {/* Case Scenario Box */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 md:p-8 bg-slate-50/80 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#00324D] text-white flex items-center justify-center font-bold text-sm">
              {currentCase.character.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentCase.title}
              </h3>
              <div className="text-xs text-slate-500">
                Protagonista: <strong className="text-slate-800">{currentCase.character}</strong> · {currentCase.role}
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed italic">
            "{currentCase.situation}"
          </div>
        </div>

        {/* Decision Options */}
        <div className="p-6 md:p-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            ¿Qué decisión debe tomar {currentCase.character}?
          </h4>

          <div className="space-y-3">
            {currentCase.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;

              let style = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50';

              if (hasDecided) {
                if (isSelected) {
                  style = option.isCorrect
                    ? 'bg-emerald-50 border-[#39A900] text-emerald-950 font-semibold ring-1 ring-[#39A900]'
                    : 'bg-rose-50 border-rose-500 text-rose-950 font-semibold ring-1 ring-rose-500';
                } else if (option.isCorrect) {
                  style = 'bg-emerald-50/60 border-emerald-300 text-emerald-900';
                } else {
                  style = 'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasDecided}
                  onClick={() => handleChooseOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 ${style}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                      isSelected
                        ? option.isCorrect
                          ? 'bg-[#39A900] text-white'
                          : 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1 leading-relaxed">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Decision Feedback */}
          {hasDecided && currentDecision && (
            <div
              className={`mt-6 p-5 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
                currentDecision.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="font-bold text-sm mb-2 flex items-center gap-2">
                {currentDecision.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#39A900]" />
                    <span>¡Decisión Correcta y Ajustada al Reglamento!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>Decisión Inadecuada con Implicaciones Disciplinarias</span>
                  </>
                )}
              </div>

              <p className="text-xs mb-3">
                <strong>Análisis:</strong> {currentDecision.consequence}
              </p>

              <div className="pt-2 border-t border-slate-200/60 flex items-start gap-1.5 text-[11px] font-medium text-slate-700">
                <Scale className="w-4 h-4 text-[#00324D] shrink-0 mt-0.5" />
                <div>
                  <strong>Consecuencia Jurídica / Formativa:</strong> {currentDecision.regulatoryOutcome}
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          {hasDecided && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleResetCase}
                className="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Explorar Otra Opción</span>
              </button>

              {selectedCaseIndex < REGULATION_CASE_STUDIES.length - 1 ? (
                <button
                  onClick={handleNextCase}
                  className="text-xs font-semibold px-5 py-2.5 rounded-lg bg-[#39A900] text-white hover:bg-[#277500] flex items-center gap-1.5 shadow-xs"
                >
                  <span>Siguiente Caso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-xs font-medium text-slate-500">
                  Has completado todos los casos disponibles.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
