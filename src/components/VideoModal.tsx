import React from 'react';
import { X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <video 
          controls 
          className="w-full aspect-video"
          autoPlay
        >
          <source src={videoSrc} type="video/mp4" />
          Tu navegador no soporta el formato de video.
        </video>
      </div>
    </div>
  );
};
