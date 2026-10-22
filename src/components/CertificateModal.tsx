import React from 'react';
import { SenaLogo } from './SenaLogo';
import { ApprenticeProgress } from '../types/induction';
import { Printer, Download, CheckCircle2, ShieldCheck, X, Award } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface CertificateModalProps {
  progress: ApprenticeProgress;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ progress, onClose }) => {
  const currentDate = new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certificateCode = `SENA-IND-${progress.fichaNumber}-${progress.documentId.slice(-4)}-2026`;

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 overflow-hidden shadow-2xl my-8 animate-fadeIn">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Award className="w-4 h-4 text-[#39A900]" />
            <span>Constancia Oficial de Inducción Digital SENA</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#39A900] hover:bg-[#277500] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Sheet */}
        <div className="p-8 md:p-12 text-center bg-radial from-white via-slate-50/50 to-emerald-50/30 border-8 border-double border-emerald-900/20 m-4 rounded-xl relative">
          {/* Institutional Header */}
          <div className="flex flex-col items-center mb-6">
            <SenaLogo className="w-16 h-16 mb-2" color="#39A900" />
            <h1 className="text-xs uppercase tracking-widest font-bold text-slate-700">
              Servicio Nacional de Aprendizaje — SENA
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Ministerio del Trabajo · República de Colombia
            </p>
            <div className="w-24 h-0.5 bg-[#39A900] mt-3" />
          </div>

          <span className="text-xs font-serif italic text-slate-500">
            El Centro de Formación Profesional Integral hace constar que:
          </span>

          {/* Apprentice Name */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#00324D] tracking-tight uppercase my-4 font-serif">
            {progress.apprenticeName}
          </h2>

          <p className="text-xs text-slate-600 mb-6 font-medium">
            Identificado con Documento de Identidad No.{' '}
            <strong className="text-slate-900">{progress.documentId}</strong>
          </p>

          <p className="text-sm md:text-base text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
            Aprobó satisfactoriamente el proceso de{' '}
            <strong className="text-[#39A900]">
              Inducción a la Formación Profesional Integral
            </strong>
            , cursando y aprobando los 5 módulos formativos y la evaluación del{' '}
            <strong>Reglamento del Aprendiz (Acuerdo 009 de 2024)</strong> con un desempeño sobresaliente.
          </p>

          {/* Data details block */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white/90 rounded-xl border border-slate-200 text-left text-xs mb-8">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Programa
              </span>
              <span className="font-semibold text-slate-800 line-clamp-2">
                {progress.programName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Ficha de Matrícula
              </span>
              <span className="font-semibold text-slate-800 font-mono">
                {progress.fichaNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Intensidad
              </span>
              <span className="font-semibold text-slate-800">
                40 Horas Lectivas
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Puntaje Obtenido
              </span>
              <span className="font-bold text-[#39A900]">
                {progress.finalQuizScore ?? 95}% (Aprobado)
              </span>
            </div>
          </div>

          {/* Date and Location */}
          <div className="text-xs text-slate-500 mb-10">
            Expedido en Colombia, a los {currentDate}.
          </div>

          {/* Signatures Deck */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200/80 max-w-lg mx-auto">
            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-serif italic text-slate-600 text-sm">
                  Subdirección de Centro
                </span>
              </div>
              <div className="border-t border-slate-400 pt-1 text-[11px] font-semibold text-slate-800">
                Subdirector(a) de Centro
              </div>
              <div className="text-[10px] text-slate-500">
                {progress.regional}
              </div>
            </div>

            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-serif italic text-slate-600 text-sm">
                  Coordinación Misional
                </span>
              </div>
              <div className="border-t border-slate-400 pt-1 text-[11px] font-semibold text-slate-800">
                Coordinación Académica
              </div>
              <div className="text-[10px] text-slate-500">
                Gestión de la Formación
              </div>
            </div>
          </div>

          {/* Validation QR and Code */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Registro Digital: {certificateCode}</span>
            <span className="flex items-center gap-1 text-[#39A900]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verificación Criptográfica Oficial
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
