import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types/induction';
import { 
  Award, 
  Flame, 
  HelpCircle, 
  Heart, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface GamifiedQuizProps {
  title: string;
  moduleNumber?: number;
  questions: QuizQuestion[];
  onComplete: (scorePercentage: number, xpEarned: number) => void;
  onExit: () => void;
}

export const GamifiedQuiz: React.FC<GamifiedQuizProps> = ({
  title,
  moduleNumber,
  questions,
  onComplete,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [lives, setLives] = useState(3);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [usedLifelines, setUsedLifelines] = useState<{
    fiftyFifty: boolean;
    hint: boolean;
    timeBonus: boolean;
  }>({
    fiftyFifty: false,
    hint: false,
    timeBonus: false
  });
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex];

  // Countdown timer
  useEffect(() => {
    if (!isTimerActive || isAnswered || quizFinished) return;

    if (timeLeft <= 0) {
      handleTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive, isAnswered, quizFinished]);

  const handleTimeExpired = () => {
    sounds.playWrong();
    setIsAnswered(true);
    setLives(prev => Math.max(0, prev - 1));
    setStreak(0);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    sounds.playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswer;
    if (isCorrect) {
      sounds.playCorrect();
      const currentStreak = streak + 1;
      setStreak(currentStreak);
      if (currentStreak > maxStreak) setMaxStreak(currentStreak);

      if (currentStreak % 2 === 0) {
        sounds.playStreak();
      }

      // XP calculation with streak multiplier
      const multiplier = currentStreak >= 3 ? 1.5 : 1.0;
      const earnedXP = Math.round(currentQ.xpReward * multiplier);
      setTotalXP(prev => prev + earnedXP);
      setScoreCount(prev => prev + 1);
    } else {
      sounds.playWrong();
      setLives(prev => Math.max(0, prev - 1));
      setStreak(0);
    }
  };

  const handleUseFiftyFifty = () => {
    if (usedLifelines.fiftyFifty || isAnswered) return;
    sounds.playClick();
    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter(i => i !== currentQ.correctAnswer);
    
    // Pick two random wrong indices
    const shuffled = [...wrongIndices].sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffled.slice(0, 2));
    setUsedLifelines(prev => ({ ...prev, fiftyFifty: true }));
  };

  const handleUseHint = () => {
    if (usedLifelines.hint || isAnswered) return;
    sounds.playClick();
    setShowHint(true);
    setUsedLifelines(prev => ({ ...prev, hint: true }));
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex < questions.length - 1 && lives > 0) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setEliminatedOptions([]);
      setShowHint(false);
      setTimeLeft(30);
    } else {
      // Quiz ended
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const finalScore = Math.round((scoreCount / questions.length) * 100);
    setQuizFinished(true);

    if (finalScore >= 80) {
      sounds.playFanfare();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    onComplete(finalScore, totalXP);
  };

  const restartQuiz = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScoreCount(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalXP(0);
    setLives(3);
    setEliminatedOptions([]);
    setShowHint(false);
    setTimeLeft(30);
    setUsedLifelines({ fiftyFifty: false, hint: false, timeBonus: false });
    setQuizFinished(false);
  };

  // Final Results Screen
  if (quizFinished) {
    const finalScore = Math.round((scoreCount / questions.length) * 100);
    const passed = finalScore >= 70;

    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-6 md:p-10 max-w-2xl mx-auto text-center shadow-xs">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-emerald-50 text-[#39A900]">
          <Award className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Evaluación Finalizada
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1 mb-2">
          {passed ? '¡Excelente Desempeño, Aprendiz!' : 'Buen Intento, Sigue Preparándote'}
        </h2>
        <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto">
          {passed
            ? 'Has demostrado dominio del Reglamento del Aprendiz (Acuerdo 009 de 2024) y los lineamientos del SENA.'
            : 'Necesitas al menos 70% de aciertos para aprobar este módulo. Puedes repasarlo y volver a intentarlo.'}
        </p>

        {/* Results Matrix */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-8">
          <div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {finalScore}%
            </div>
            <div className="text-[11px] text-slate-500 font-medium uppercase mt-0.5">
              Puntaje
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#39A900] tabular-nums">
              +{totalXP}
            </div>
            <div className="text-[11px] text-slate-500 font-medium uppercase mt-0.5">
              Puntos XP
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600 tabular-nums">
              {maxStreak}x
            </div>
            <div className="text-[11px] text-slate-500 font-medium uppercase mt-0.5">
              Mayor Racha
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={restartQuiz}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reintentar Cuestionario</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onExit();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#39A900] hover:bg-[#277500] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Volver a los Módulos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs max-w-3xl mx-auto">
      {/* Game Status Top Deck */}
      <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
            {moduleNumber ? `Módulo ${moduleNumber}` : 'Desafío Saber SENA'}
          </div>
          <h3 className="text-base font-bold text-white truncate">{title}</h3>
        </div>

        {/* Lives, Streak & XP Stats */}
        <div className="flex items-center gap-4 text-xs font-bold">
          {/* Streak Indicator */}
          <div className="flex items-center gap-1 text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span className="tabular-nums">{streak} racha</span>
          </div>

          {/* XP Ticker */}
          <div className="flex items-center gap-1 text-emerald-300">
            <Zap className="w-4 h-4 text-[#39A900]" />
            <span className="tabular-nums">+{totalXP} XP</span>
          </div>

          {/* Lives Counter */}
          <div className="flex items-center gap-1 text-rose-400">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono tabular-nums ${
              timeLeft <= 8 ? 'bg-rose-500/20 text-rose-300 animate-pulse' : 'bg-white/10 text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-1.5">
        <div
          className="bg-[#39A900] h-1.5 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Lifelines Bar (Comodines) */}
      <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          Pregunta <strong className="text-slate-900">{currentIndex + 1}</strong> de {questions.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUseFiftyFifty}
            disabled={usedLifelines.fiftyFifty || isAnswered}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              usedLifelines.fiftyFifty
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Descarta dos opciones incorrectas"
          >
            <span>50:50</span>
          </button>

          <button
            onClick={handleUseHint}
            disabled={usedLifelines.hint || isAnswered}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              usedLifelines.hint
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Ver pista sobre el Acuerdo 009 de 2024"
          >
            <Info className="w-3 h-3 text-sky-600" />
            <span>Pista Jurídica</span>
          </button>
        </div>
      </div>

      {/* Hint Alert */}
      {showHint && (
        <div className="mx-6 mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-900 flex items-start gap-2 animate-fadeIn">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong>Pista del Reglamento:</strong> Consulta el {currentQ.articleCitation} para resolver esta pregunta.
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="p-6 md:p-8">
        <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-6 leading-snug">
          {currentQ.question}
        </h4>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);
            const isChosen = selectedOption === idx;
            const isCorrectOption = idx === currentQ.correctAnswer;

            let optionStyle = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/70';

            if (isEliminated) {
              optionStyle = 'opacity-30 bg-slate-100 border-slate-200 cursor-not-allowed line-through text-slate-400';
            } else if (isAnswered) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-50 border-[#39A900] text-emerald-950 font-semibold ring-1 ring-[#39A900]';
              } else if (isChosen) {
                optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-semibold ring-1 ring-rose-500';
              } else {
                optionStyle = 'opacity-40 bg-white border-slate-200 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered || isEliminated}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 ${optionStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                    isAnswered && isCorrectOption
                      ? 'bg-[#39A900] text-white'
                      : isAnswered && isChosen
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{option}</span>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-[#39A900] shrink-0" />
                )}
                {isAnswered && isChosen && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Rationale Box */}
        {isAnswered && (
          <div
            className={`mt-6 p-4 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
              selectedOption === currentQ.correctAnswer
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="font-bold mb-1 flex items-center gap-1.5">
              {selectedOption === currentQ.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
                  <span>¡Respuesta Correcta! (+{currentQ.xpReward} XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Respuesta Incorrecta</span>
                </>
              )}
            </div>
            <p className="mt-1">{currentQ.explanation}</p>
            <div className="mt-2 pt-2 border-t border-slate-200/50 text-[11px] font-medium text-slate-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
              <span>Base Jurídica: {currentQ.articleCitation}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Step Deck */}
      <div className="p-4 md:px-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onExit();
          }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Abandonar Cuestionario
        </button>

        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="px-5 py-2.5 rounded-lg bg-[#39A900] hover:bg-[#277500] text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>
              {currentIndex < questions.length - 1 && lives > 0
                ? 'Siguiente Pregunta'
                : 'Ver Resultados'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
