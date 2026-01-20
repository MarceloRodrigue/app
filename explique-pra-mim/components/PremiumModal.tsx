
import React from 'react';
import { Button } from './Button';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Ops! Limite Atingido</h2>
          <p className="text-slate-600 mb-8">
            Você já usou suas 3 explicações gratuitas hoje. Seja Premium para ter acesso ilimitado e simplificar qualquer texto agora mesmo!
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between text-left">
              <div>
                <span className="block text-sm font-medium text-indigo-600 uppercase tracking-wider">Plano Premium</span>
                <span className="block text-2xl font-bold text-slate-900">R$ 19,90<small className="text-sm font-normal text-slate-500">/mês</small></span>
              </div>
              <div className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full font-bold">MELHOR VALOR</div>
            </div>
            
            <Button className="w-full text-lg py-4" onClick={onUpgrade}>
              Quero Acesso Ilimitado
            </Button>
            
            <button 
              onClick={onClose}
              className="text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              Talvez mais tarde
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 flex flex-wrap justify-center gap-4 text-xs text-slate-400 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Ilimitado
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Sem anúncios
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Histórico completo
          </div>
        </div>
      </div>
    </div>
  );
};
