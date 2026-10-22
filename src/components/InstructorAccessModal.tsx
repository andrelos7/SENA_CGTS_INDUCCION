import React, { useState, useEffect } from 'react';
import { SenaLogo } from './SenaLogo';
import { ShieldCheck, X, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface InstructorAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data?: { name: string; documentId: string }) => void;
  initialName?: string;
  initialDoc?: string;
}

export const InstructorAccessModal: React.FC<InstructorAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialName = 'Andrés Téllez',
  initialDoc = '1032456789'
}) => {
  const [name, setName] = useState(initialName);
  const [doc, setDoc] = useState(initialDoc);
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string>('');
  const [isKeyRequested, setIsKeyRequested] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDoc(initialDoc);
      setPin('');
      setError('');
      setEmail('');
      setIsKeyRequested(false);
    }
  }, [isOpen, initialName, initialDoc]);

  if (!isOpen) return null;

  const handleRequestKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !doc.trim() || !email.trim()) {
      setError('Por favor registra tu nombre, documento y correo electrónico.');
      return;
    }
    
    // Call backend
    const response = await fetch('/api/request-instructor-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, documentId: doc, email })
    });
    
    if (response.ok) {
      setIsKeyRequested(true);
      setError('');
    } else {
      setError('Error al solicitar la clave.');
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();

    if (!pin.trim()) {
      sounds.playWrong();
      setError('Por favor ingresa la clave recibida en tu correo.');
      return;
    }

    const response = await fetch('/api/verify-instructor-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pin })
    });
    
    if (response.ok) {
      sounds.playCorrect();
      setError('');
      try {
        localStorage.setItem(
          'sena_instructor_profile',
          JSON.stringify({ name: name.trim(), documentId: doc.trim() })
        );
      } catch (e) {}
      onSuccess({ name: name.trim(), documentId: doc.trim() });
    } else {
      sounds.playWrong();
      setError('Clave no válida. Revisa tu correo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 overflow-hidden shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-[#00324D] text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <SenaLogo className="w-8 h-8" color="#39A900" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Seguridad Institucional SENA
              </span>
              <h3 className="text-base font-bold text-white">
                Validación de Acceso
              </h3>
            </div>
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

        {/* Body Form */}
        <form onSubmit={isKeyRequested ? handleVerifyPin : handleRequestKey} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre del Instructor *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00324D]" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Documento de Identidad *</label>
              <input type="text" required value={doc} onChange={e => setDoc(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00324D] font-mono" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00324D]" />
          </div>

          {!isKeyRequested && (
            <button
              type="submit"
              className="w-full px-5 py-2 bg-[#00324D] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Solicitar Clave al Correo</span>
            </button>
          )}

          {isKeyRequested && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Clave Alfanumérica de 4 Dígitos *</label>
              <input
                type="text"
                maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value.toUpperCase())}
                placeholder="Ej. AN89"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00324D] tracking-widest font-mono font-bold text-sm uppercase"
              />
              <p className="text-emerald-600 mt-2">La clave ha sido enviada a tu correo.</p>
            </div>
          )}

          {error && (
            <p className="text-xs text-rose-600 flex items-start gap-1 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </p>
          )}

          {isKeyRequested && (
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#00324D] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
                <span>Ingresar como Instructor</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
