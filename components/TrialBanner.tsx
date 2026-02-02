
import React, { useMemo } from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TrialBannerProps {
  createdAt: string | undefined;
  isSubscribed: boolean;
  planType: string;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ createdAt, isSubscribed, planType }) => {
  const navigate = useNavigate();

  const trialInfo = useMemo(() => {
    if (!createdAt || isSubscribed || planType === 'START') return null;

    const start = new Date(createdAt).getTime();
    const now = new Date().getTime();
    
    // Diferença em milissegundos
    const diffMs = now - start;
    
    // Diferença em dias (float)
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    // Dias restantes (Total 7 - dias passados)
    const daysLeft = Math.ceil(7 - diffDays);

    // Regra de negócio: Mostrar apenas se estiver entre o 5º e 7º dia (faltando 2, 1 ou 0 dias)
    // E garantir que não mostre se já expirou (daysLeft < 0)
    const shouldShow = diffDays >= 4.5 && daysLeft >= 0;

    return { shouldShow, daysLeft: Math.max(0, daysLeft) };
  }, [createdAt, isSubscribed, planType]);

  if (!trialInfo || !trialInfo.shouldShow) return null;

  const handleNavigate = () => {
    navigate('/dashboard/configuracoes?tab=assinatura');
  };

  return (
    <div className="sticky top-0 z-[100] bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-3 shadow-lg animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full animate-pulse">
            <AlertTriangle size={20} className="text-white" fill="currentColor" />
          </div>
          <p className="text-xs md:text-sm font-bold uppercase tracking-wide leading-tight">
            ⚠️ Faltam <span className="text-2xl font-black mx-1">{trialInfo.daysLeft}</span> dias para o fim do seu teste.
            <span className="hidden md:inline ml-1">Mantenha seu negócio organizado, assine agora!</span>
          </p>
        </div>
        
        <button 
          onClick={handleNavigate}
          className="group bg-white text-orange-600 px-5 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-lg flex items-center gap-2 active:scale-95"
        >
          Assinar Agora <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
