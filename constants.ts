
import { PlanType } from './types';

export const PLAN_FEATURES = {
  [PlanType.START]: {
    label: 'Carbon Start',
    description: 'Essencial para novos hangares.',
    price: 'GRÁTIS',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Até 5 Serviços no catálogo',
      'Agenda de Boxes Digital',
      'Link de Agendamento Público',
      'CRM de Clientes Básico',
      'Sem Gestão Financeira',
      'Sem Notificações WhatsApp'
    ],
    maxClients: 999999,
    maxServices: 5,
    hasIntelligence: false,
    hasFinance: false,
    hasWhatsapp: false,
    highlight: false,
    stripeLinkMonthly: null,
    stripeLinkAnnual: null
  },
  [PlanType.PRO]: {
    label: 'Carbon Pro',
    description: 'Gestão profissional e escala.',
    price: '97',
    monthlyPrice: 97,
    annualPrice: 83.20, // 998.40 / 12
    features: [
      'Serviços Ilimitados',
      'Gestão Financeira (DRE)',
      'Notificações WhatsApp Reais',
      'Galeria de Portfólio',
      'Programa de Fidelidade XP',
      'Suporte via Ticket'
    ],
    maxClients: 999999,
    maxServices: 9999,
    hasIntelligence: false,
    hasFinance: true,
    hasWhatsapp: true,
    highlight: true,
    // ATENÇÃO: Estes links aparecem tanto nas Configurações quanto na Tela de Bloqueio (Trial Expirado)
    stripeLinkMonthly: 'https://buy.stripe.com/cNi6oz7aJdLB8po1dhgnK00', 
    stripeLinkAnnual: 'https://buy.stripe.com/3cIbIT2UtfTJ7lk5txgnK04'
  },
  [PlanType.ELITE]: {
    label: 'Carbon Elite',
    description: 'Potência máxima e exclusividade.',
    price: '147',
    monthlyPrice: 147,
    annualPrice: 124.95, // 1499.40 / 12
    features: [
      'Tudo do Plano PRO',
      'DRE Gerencial Avançado',
      'Consultoria de Fluxo',
      'Exportação para Contabilidade',
      'Suporte VIP Prioritário',
      'Selo de Hangar Certificado'
    ],
    maxClients: 999999,
    maxServices: 9999,
    hasIntelligence: false,
    hasFinance: true,
    hasWhatsapp: true,
    highlight: false,
    // ATENÇÃO: Estes links aparecem tanto nas Configurações quanto na Tela de Bloqueio (Trial Expirado)
    stripeLinkMonthly: 'https://buy.stripe.com/14A00bcv3dLBdJIaNRgnK02',
    stripeLinkAnnual: 'https://buy.stripe.com/cNieV57aJcHxaxwg8bgnK03'
  }
};
