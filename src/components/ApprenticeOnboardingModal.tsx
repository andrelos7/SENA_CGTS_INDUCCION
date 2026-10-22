import React, { useState } from 'react';
import { ApprenticeProgress } from '../types/induction';
import { User, IdCard, GraduationCap, MapPin, Check, X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ApprenticeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: ApprenticeProgress;
  onSave: (updated: Partial<ApprenticeProgress>) => void;
}

export const ApprenticeOnboardingModal: React.FC<ApprenticeOnboardingModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onSave
}) => {
  const [formData, setFormData] = useState({
    apprenticeName: currentData.apprenticeName,
    documentId: currentData.documentId,
    programName: currentData.programName,
    fichaNumber: currentData.fichaNumber,
    regional: currentData.regional
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCorrect();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 overflow-hidden shadow-2xl animate-fadeIn">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Datos del Aprendiz
            </span>
            <h3 className="text-base font-bold text-white">
              Personalizar mi Ficha de Inducción
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-white/60 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nombre Completo del Aprendiz
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={formData.apprenticeName}
                onChange={e => setFormData({ ...formData, apprenticeName: e.target.value })}
                placeholder="Nombres y Apellidos"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Documento de Identidad (CC / TI)
              </label>
              <div className="relative">
                <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.documentId}
                  onChange={e => setFormData({ ...formData, documentId: e.target.value })}
                  placeholder="Número de documento"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Número de Ficha
              </label>
              <input
                type="text"
                required
                value={formData.fichaNumber}
                onChange={e => setFormData({ ...formData, fichaNumber: e.target.value })}
                placeholder="Ej. 2714520"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Programa de Formación
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={formData.programName}
                onChange={e => setFormData({ ...formData, programName: e.target.value })}
                placeholder="Ej. Análisis y Desarrollo de Software (ADSO)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Regional y Centro de Formación
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={formData.regional}
                onChange={e => setFormData({ ...formData, regional: e.target.value })}
                placeholder="Ej. Regional Antioquia — Centro de Servicios"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#39A900] hover:bg-[#277500] text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar Datos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
