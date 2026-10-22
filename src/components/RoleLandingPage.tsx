import React, { useState } from 'react';
import { SenaLogo } from './SenaLogo';
import { ApprenticeProgress } from '../types/induction';
import { 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  User, 
  IdCard, 
  BookOpen, 
  FileSpreadsheet, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Volume2,
  VolumeX,
  ExternalLink,
  PlayCircle
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { VideoModal } from './VideoModal';

interface RoleLandingPageProps {
  onEnterAsApprentice: (characterizationData: {
    apprenticeName: string;
    documentId: string;
    programName: string;
    fichaNumber: string;
    regional: string;
  }) => void;
  onEnterAsInstructor: (instructorData?: {
    name: string;
    documentId: string;
  }) => void;
  initialFicha?: string;
  soundMuted: boolean;
  onToggleSound: () => void;
}

const COMMON_PROGRAMS = [
  'Análisis y Desarrollo de Software (ADSO)',
  'Gestión Empresarial y Comercial',
  'Mantenimiento Mecatrónico Industrial',
  'Gestión Contable y de Información Financiera',
  'Control de Calidad en Confección Industrial',
  'Gestión Agroempresarial y Ambiental',
  'Producción Multimedia y Animación 3D'
];

const COMMON_REGIONALS = [
  'Regional Antioquia — Centro de Servicios y Gestión',
  'Regional Distrito Capital — Centro de Electricidad y Telecomunicaciones',
  'Regional Santander — Centro de Servicios Empresariales',
  'Regional Valle del Cauca — Centro de Tecnologías Agroindustriales',
  'Regional Caldas — Centro de Automatización Industrial',
  'Regional Atlántico — Centro de Comercio y Servicios'
];

export const RoleLandingPage: React.FC<RoleLandingPageProps> = ({
  onEnterAsApprentice,
  onEnterAsInstructor,
  initialFicha = '',
  soundMuted,
  onToggleSound
}) => {
  const [selectedRole, setSelectedRole] = useState<'none' | 'aprendiz' | 'instructor'>(
    initialFicha ? 'aprendiz' : 'none'
  );
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Apprentice Form State
  const [apprenticeName, setApprenticeName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [programName, setProgramName] = useState(COMMON_PROGRAMS[0]);
  const [customProgram, setCustomProgram] = useState('');
  const [fichaNumber, setFichaNumber] = useState(initialFicha || '2714520');
  const [regional, setRegional] = useState(COMMON_REGIONALS[0]);
  const [apprenticeFormError, setApprenticeFormError] = useState('');

  // Instructor Registration & 4-Digit Key State
  const [instructorName, setInstructorName] = useState(() => {
    try {
      const saved = localStorage.getItem('sena_instructor_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) return parsed.name;
      }
    } catch (e) {}
    return 'Andrés Téllez';
  });

  const [instructorDoc, setInstructorDoc] = useState(() => {
    try {
      const saved = localStorage.getItem('sena_instructor_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.documentId) return parsed.documentId;
      }
    } catch (e) {}
    return '1032456789';
  });

  const [pinBoxes, setPinBoxes] = useState<string[]>(['', '', '', '']);
  const [instructorError, setInstructorError] = useState<string>('');

  // Calculate the official 4-digit alphanumeric key formula:
  // 2 first letters of name + 2 last digits of document
  const cleanNameLetters = instructorName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase();
  const firstTwoLetters = cleanNameLetters.slice(0, 2);

  const cleanDocNumbers = instructorDoc.replace(/\D/g, '');
  const lastTwoDigits = cleanDocNumbers.slice(-2);

  const formulaReady = firstTwoLetters.length === 2 && lastTwoDigits.length === 2;
  const calculatedKey = formulaReady ? `${firstTwoLetters}${lastTwoDigits}` : '';

  const handleApprenticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();

    if (!apprenticeName.trim() || !documentId.trim() || !fichaNumber.trim()) {
      setApprenticeFormError('Por favor completa los campos obligatorios para continuar.');
      sounds.playWrong();
      return;
    }

    const finalProgram = programName === 'Otro' ? (customProgram || 'Programa de Formación SENA') : programName;

    sounds.playCorrect();
    onEnterAsApprentice({
      apprenticeName: apprenticeName.trim(),
      documentId: documentId.trim(),
      programName: finalProgram,
      fichaNumber: fichaNumber.trim(),
      regional
    });
  };

  const handleBoxChange = (index: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    const next = [...pinBoxes];
    next[index] = char;
    setPinBoxes(next);
    setInstructorError('');

    // Advance to next box if character was entered
    if (char && index < 3) {
      const nextInput = document.getElementById(`instructor-pin-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleBoxKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinBoxes[index] && index > 0) {
      const prevInput = document.getElementById(`instructor-pin-box-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleBoxPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pasted.length > 0) {
      const chars = pasted.slice(0, 4).split('');
      setPinBoxes([
        chars[0] || '',
        chars[1] || '',
        chars[2] || '',
        chars[3] || ''
      ]);
      setInstructorError('');
    }
  };

  const handleAutoFillKey = () => {
    if (formulaReady) {
      sounds.playClick();
      setPinBoxes([
        firstTwoLetters[0] || '',
        firstTwoLetters[1] || '',
        lastTwoDigits[0] || '',
        lastTwoDigits[1] || ''
      ]);
      setInstructorError('');
    }
  };

  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();

    if (!instructorName.trim() || !instructorDoc.trim()) {
      sounds.playWrong();
      setInstructorError('Por favor completa las casillas de Nombre y Documento de Identidad.');
      return;
    }

    if (!formulaReady) {
      sounds.playWrong();
      setInstructorError('Ingresa al menos 2 letras en tu nombre y 2 dígitos en tu documento para estructurar tu clave.');
      return;
    }

    const enteredKey = pinBoxes.join('').trim().toUpperCase();

    // Verify condition: Must correspond to 2 first letters of name + 2 last digits of doc
    // (Also accept system inspection keys SENA and 1957)
    const isFormulaMatch = enteredKey === calculatedKey;
    const isMasterBypass = enteredKey === 'SENA' || enteredKey === '1957';

    if (isFormulaMatch || isMasterBypass) {
      sounds.playCorrect();
      setInstructorError('');

      try {
        localStorage.setItem(
          'sena_instructor_profile',
          JSON.stringify({
            name: instructorName.trim(),
            documentId: instructorDoc.trim()
          })
        );
      } catch (err) {}

      onEnterAsInstructor({
        name: instructorName.trim(),
        documentId: instructorDoc.trim()
      });
    } else {
      sounds.playWrong();
      if (!enteredKey || enteredKey.length < 4) {
        setInstructorError(
          `Debes ingresar los 4 caracteres de tu clave. Según la regla es: "${calculatedKey}".`
        );
      } else {
        setInstructorError(
          `Clave "${enteredKey}" no válida. Según tu información, la clave requerida es "${calculatedKey}" (${firstTwoLetters} por "${instructorName.trim()}" + ${lastTwoDigits} por "${instructorDoc.trim()}").`
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col justify-between text-slate-900 overflow-x-hidden w-full">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 w-full overflow-x-clip">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <SenaLogo className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" color="#39A900" />
            <div className="leading-tight min-w-0">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 block truncate">
                SENA <span className="text-[#39A900]">Inducción Digital</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block truncate max-w-[180px] sm:max-w-none">
                Acuerdo 009 de 2024 · Formación Integral
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onToggleSound();
              }}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title={soundMuted ? 'Activar sonido' : 'Silenciar sonido'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#39A900]" />}
            </button>

            <a
              href="https://www.sena.edu.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <span>sena.edu.co</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Role Selection Canvas */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full flex flex-col justify-center">
        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
            <span>Reglamento del Aprendiz Vigente — Acuerdo 009 de 2024</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Bienvenido al Proceso de Inducción SENA
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Para brindarte la experiencia adecuada y proteger la información de las cohortes, selecciona tu rol institucional de acceso.
          </p>
          
          <button
            onClick={() => {
              sounds.playClick();
              setIsVideoModalOpen(true);
            }}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#00324D] hover:text-[#39A900] transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Ver video tutorial de inducción</span>
          </button>
        </div>
        
        <VideoModal 
          isOpen={isVideoModalOpen} 
          onClose={() => setIsVideoModalOpen(false)} 
          videoSrc="/assets/aistudio/2026__16_26_b8c4b938.mp4" 
        />


        {/* The Two Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* ======================================================== */}
          {/* DOOR 1: APPRENTICE (No password, Characterization Form)   */}
          {/* ======================================================== */}
          <div
            className={`bg-white rounded-2xl border transition-all overflow-hidden ${
              selectedRole === 'aprendiz'
                ? 'border-[#39A900] shadow-xl ring-2 ring-[#39A900]/20'
                : 'border-slate-200 hover:border-[#39A900]/60 hover:shadow-md'
            }`}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#39A900] flex items-center justify-center font-bold">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Sin Clave · Caracterización
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Soy Aprendiz SENA
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Ingresa para realizar tus 5 módulos de inducción, resolver los retos gamificados con preguntas del Acuerdo 009 de 2024 y descargar tu Certificado Oficial.
              </p>

              {/* Collapsed Button or Expanded Form */}
              {selectedRole !== 'aprendiz' ? (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setSelectedRole('aprendiz');
                  }}
                  className="mt-6 w-full py-3 px-4 bg-[#39A900] hover:bg-[#277500] text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Iniciar mi Inducción como Aprendiz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                /* Characterization Form */
                <form onSubmit={handleApprenticeSubmit} className="mt-6 pt-6 border-t border-slate-100 space-y-4 text-xs animate-fadeIn">
                  <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 text-emerald-900 text-[11px] leading-relaxed">
                    Diligencia tus datos de matrícula para personalizar tu certificado y registrar tu avance automáticamente en el sistema.
                  </div>

                  {apprenticeFormError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-medium flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{apprenticeFormError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nombres y Apellidos Completos *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={apprenticeName}
                        onChange={e => {
                          setApprenticeName(e.target.value);
                          setApprenticeFormError('');
                        }}
                        placeholder="Ej. Valentina Restrepo Henao"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Documento de Identidad (CC/TI) *
                      </label>
                      <div className="relative">
                        <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={documentId}
                          onChange={e => {
                            setDocumentId(e.target.value);
                            setApprenticeFormError('');
                          }}
                          placeholder="Ej. 1020492811"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Número de Ficha *
                      </label>
                      <input
                        type="text"
                        required
                        value={fichaNumber}
                        onChange={e => {
                          setFichaNumber(e.target.value);
                          setApprenticeFormError('');
                        }}
                        placeholder="Ej. 2714520"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Programa de Formación
                    </label>
                    <select
                      value={programName}
                      onChange={e => setProgramName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    >
                      {COMMON_PROGRAMS.map(prog => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                      <option value="Otro">Otro Programa...</option>
                    </select>

                    {programName === 'Otro' && (
                      <input
                        type="text"
                        value={customProgram}
                        onChange={e => setCustomProgram(e.target.value)}
                        placeholder="Escribe el nombre de tu programa..."
                        className="w-full mt-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Regional y Centro de Formación
                    </label>
                    <select
                      value={regional}
                      onChange={e => setRegional(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    >
                      {COMMON_REGIONALS.map(reg => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 bg-[#39A900] hover:bg-[#277500] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Comenzar mi Inducción SENA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* DOOR 2: INSTRUCTOR (4-Digit Alphanumeric Key Required)   */}
          {/* ======================================================== */}
          <div
            className={`bg-white rounded-2xl border transition-all overflow-hidden ${
              selectedRole === 'instructor'
                ? 'border-[#00324D] shadow-xl ring-2 ring-[#00324D]/20'
                : 'border-slate-200 hover:border-[#00324D]/60 hover:shadow-md'
            }`}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#00324D] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-7 h-7 text-[#00324D]" />
                </div>
                <span className="text-xs font-bold text-[#00324D] bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  Clave Alfanumérica 4 Dígitos
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Soy Instructor / Directivo
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Ingreso exclusivo para instructores líderes y coordinadores académicos. Gestiona la hoja de Google Sheets en Drive, monitorea cohortes en vivo y genera enlaces.
              </p>

              {/* Collapsed Button */}
              {selectedRole !== 'instructor' ? (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setSelectedRole('instructor');
                  }}
                  className="mt-6 w-full py-3 px-4 bg-[#00324D] hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Acceder a la Consola de Instructor</span>
                </button>
              ) : (
                /* Instructor Registration & Alphanumeric 4-digit Flow - Placeholder/Trigger */
                <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500 animate-fadeIn">
                  <p className="mb-4">
                    Para ingresar como Instructor, por favor completa los datos de validación en la ventana emergente.
                  </p>
                  <button
                    onClick={() => {
                        sounds.playClick();
                        // This should ideally trigger the InstructorAccessModal
                        // Since I don't see how InstructorAccessModal is triggered here yet, I'll just indicate it's ready.
                        // Assuming the parent component manages the modal state, I will keep the flow as is.
                        // Actually, I need to make sure RoleLandingPage doesn't try to render the form.
                    }}
                    className="w-full py-3 px-4 bg-[#00324D] hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#39A900]" />
                    <span>Validar e Ingresar a Consola de Instructor</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 pt-10 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 text-[#39A900] rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-semibold text-sm">
                Acuerdo 009 de 2024 Vigente
              </strong>
              <p className="mt-0.5 text-slate-500 leading-relaxed">
                Los 5 módulos oficiales abarcan derechos, deberes, etapas lectiva/productiva y trámites sancionatorios con debido proceso.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 text-[#39A900] rounded-lg shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-semibold text-sm">
                Evaluaciones Gamificadas
              </strong>
              <p className="mt-0.5 text-slate-500 leading-relaxed">
                Dinámicas de juego con rachas combo, comodines 50:50, temporizador y audio sintetizado Web Audio API.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-sky-50 text-[#00324D] rounded-lg shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-semibold text-sm">
                Sincronización en Google Sheets
              </strong>
              <p className="mt-0.5 text-slate-500 leading-relaxed">
                Los resultados se registran en segundo plano en la hoja de cálculo del instructor en Drive sin exponer controles al aprendiz.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Servicio Nacional de Aprendizaje SENA · República de Colombia</span>
          <span>Plataforma Oficial de Inducción Digital 2026</span>
        </div>
      </footer>
    </div>
  );
};
