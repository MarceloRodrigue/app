
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './components/Button';
import { PremiumModal } from './components/PremiumModal';
import { simplifyText } from './services/geminiService';
import { ExplanationResult, UserProfile } from './types';

const INITIAL_PROFILE: UserProfile = {
  isPremium: false,
  usage: {
    count: 0,
    lastDate: new Date().toISOString().split('T')[0]
  }
};

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [error, setError] = useState<string | null>(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('expliquepramim_user');
    if (saved) {
      const parsed: UserProfile = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      
      // Reset daily count if it's a new day
      if (parsed.usage.lastDate !== today) {
        parsed.usage.count = 0;
        parsed.usage.lastDate = today;
      }
      setUserProfile(parsed);
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('expliquepramim_user', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleUpgrade = () => {
    setUserProfile(prev => ({ ...prev, isPremium: true }));
    setIsModalOpen(false);
    alert("Parabéns! Você agora é um usuário Premium 🎉");
  };

  const handleResetProfile = () => {
    setUserProfile(INITIAL_PROFILE);
    localStorage.removeItem('expliquepramim_user');
    setResult(null);
    setInputText('');
  };

  const handleExplain = async () => {
    if (!inputText.trim()) return;
    
    // Check usage limits
    if (!userProfile.isPremium && userProfile.usage.count >= 3) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const explanationResult = await simplifyText(inputText);
      setResult(explanationResult);
      
      // Update usage count
      setUserProfile(prev => ({
        ...prev,
        usage: {
          ...prev.usage,
          count: prev.usage.count + 1
        }
      }));
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">Explique pra mim</span>
        </div>
        
        <div className="flex items-center gap-4">
          {!userProfile.isPremium ? (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hoje</span>
              <div className="flex gap-1 mt-0.5">
                {[1, 2, 3].map(num => (
                  <div 
                    key={num} 
                    className={`h-1.5 w-6 rounded-full transition-colors ${num <= userProfile.usage.count ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">Premium</span>
          )}
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`p-2 rounded-lg transition-colors ${userProfile.isPremium ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
          >
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {!result && (
        <header className="px-6 py-16 sm:py-24 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Entenda qualquer texto como se tivesse <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">10 anos.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            Chega de sofrer com palavras complicadas. Cole aquele contrato, artigo médico ou prova difícil e deixe a IA simplificar tudo para você.
          </p>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 px-4 sm:px-8 pb-20 max-w-5xl mx-auto w-full transition-all duration-500 ${result ? 'pt-8' : ''}`}>
        
        {/* Input Area */}
        <section className={`transition-all duration-500 ${result ? 'scale-95 opacity-50 mb-8' : 'scale-100'}`}>
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 border border-slate-100">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Cole o texto difícil aqui</label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ex: 'Fica estipulado que o presente instrumento particular de contrato de prestação de serviços...'"
              className="w-full h-40 sm:h-56 p-6 text-lg text-slate-700 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none placeholder:text-slate-300"
            />
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-400">
                {inputText.length} caracteres
              </div>
              <Button 
                onClick={handleExplain} 
                isLoading={isLoading} 
                className="w-full sm:w-auto min-w-[200px]"
                disabled={!inputText.trim()}
              >
                Simplificar Agora
              </Button>
            </div>
          </div>
          {error && <p className="mt-4 text-center text-rose-500 font-medium">{error}</p>}
        </section>

        {/* Results Area */}
        {result && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            {/* Main Explanation */}
            <div className="bg-indigo-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-indigo-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                   <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest opacity-80">Explicação em termos simples</h2>
              </div>
              <p className="text-xl sm:text-2xl font-medium leading-relaxed">
                {result.explanation}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Summary Points */}
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                  Principais Pontos
                </h3>
                <ul className="space-y-4">
                  {result.summary.map((point, i) => (
                    <li key={i} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-1 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        {i + 1}
                      </div>
                      <span className="text-slate-600 leading-snug">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Terms Glossary */}
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                  Dicionário Simplificado
                </h3>
                <div className="space-y-6">
                  {result.simplifiedTerms.map((term, i) => (
                    <div key={i} className="border-b border-slate-50 pb-4 last:border-0">
                      <span className="block text-sm font-bold text-indigo-600 uppercase tracking-wider mb-1">{term.original}</span>
                      <p className="text-slate-600">
                        {term.simplified}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button variant="outline" onClick={() => { 
                setResult(null); 
                setInputText(''); 
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                Explicar outro texto
              </Button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-100 bg-white px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-slate-400">
          <div className="flex flex-col gap-2 text-center md:text-left">
             <span className="text-sm font-bold text-slate-600">Explique pra mim</span>
             <p className="text-xs max-w-xs">Ajudando pessoas a entenderem o mundo, uma palavra difícil por vez.</p>
          </div>
          
          <div className="flex items-center gap-8 text-xs font-medium">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Termos</a>
            <button onClick={handleResetProfile} className="hover:text-rose-500 transition-colors">Resetar App</button>
          </div>
          
          <div className="text-xs">
            © 2024 - Simplificação Inteligente
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <PremiumModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default App;
