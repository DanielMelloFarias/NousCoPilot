/**
 * NOUS Intelligence — Landing Page
 * UI/UX Pro Max: Cormorant Garamond + Montserrat
 * Dark Gradient + Glassmorphism + Scroll-Reveal Animations
 * Form → Google Sheets via Apps Script webhook
 */

import {
  ArrowRight, BarChart3, Brain, CheckCircle, ChevronDown,
  Clock, FileText, Lock, Menu, MessageSquare, Scale,
  Search, Shield, Sparkles, Star, TrendingUp, X, Zap,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

/* ─── Google Sheets Webhook ─────────────────────── */
// 1. Open script.google.com → New project → paste /scripts/NousSheets.gs
// 2. Deploy as Web App (Execute as: Me, Who has access: Anyone)
// 3. Add the URL to .env as VITE_SHEETS_URL
const SHEETS_URL = import.meta.env.VITE_SHEETS_URL ?? '';

/* ─── Scroll-reveal component ───────────────────── */
function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const delayClass = delay ? `reveal-delay-${delay}` : '';
  return React.createElement(Tag, { ref, className: `reveal ${delayClass} ${className}`.trim() }, children);
}

/* ─── Counter hook ───────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, on };
}

function useCounter(target: number, ms = 2000, run = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let t0: number;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / ms, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, ms, run]);
  return v;
}

/* ─── FAQ ───────────────────────────────────────── */
function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="border-b border-white/[0.07] py-6 cursor-pointer group select-none">
      <div className="flex justify-between items-start gap-4">
        <p className="font-medium text-sm md:text-[15px] text-[#E8F0F7] group-hover:text-[#C9A55C] transition-colors duration-200 leading-snug">{q}</p>
        <ChevronDown size={18} className={`text-[#C9A55C]/40 flex-shrink-0 mt-0.5 group-hover:text-[#C9A55C] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </div>
      <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="text-[#7A9AB5] text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Data ──────────────────────────────────────── */
const PAIN = [
  { Icon: Clock,         title: 'Horas perdidas em petições padrão',     body: 'Modelos que a IA resolveria em segundos consomem horas do seu dia e drenam a energia que deveria ir para a estratégia.' },
  { Icon: Search,        title: 'Pesquisa jurisprudencial manual',         body: 'Vasculhar bases de dados atrás de um único precedente: lento, repetitivo e com risco de perder o mais importante.' },
  { Icon: FileText,      title: 'Revisão de contratos linha a linha',       body: 'Trabalho mecânico que esgota sua atenção antes das questões estratégicas chegarem à mesa.' },
  { Icon: MessageSquare, title: 'Atendimento que drena expertise',          body: 'Responder as mesmas dúvidas básicas ao invés de dedicar sua mente a casos que realmente exigem o seu nível.' },
];

const FEATURES = [
  { Icon: Sparkles, tag: 'REDAÇÃO',    title: 'Geração de Peças',               body: 'Petições, contratos e recursos com fundamentação sólida, adaptados ao seu estilo. Você revisa e assina. Em minutos.', accent: true },
  { Icon: Scale,    tag: 'PESQUISA',   title: 'Análise de Jurisprudência',       body: 'Milhares de decisões de tribunais analisadas em segundos. Encontre o precedente certo com busca semântica avançada.' },
  { Icon: Brain,    tag: 'ESTRATÉGIA', title: 'Teses com IA',                    body: 'Elabore argumentação estratégica fundamentada em dados reais. Saia à frente com teses mais sólidas.' },
  { Icon: Shield,   tag: 'CONTRATOS',  title: 'Análise de Contratos',            body: 'Extração de cláusulas, riscos ocultos e resumo executivo de contratos complexos. Rápido e preciso.' },
  { Icon: BarChart3,tag: 'GESTÃO',     title: 'Dashboard de Processos',          body: 'Portfólio completo. Prazos fatais, status e alertas automáticos. Visibilidade total, zero surpresas.' },
  { Icon: Zap,      tag: 'AUTOMAÇÃO',  title: 'Fluxos Customizados',            body: 'Configure automações para o seu escritório. O NOUS aprende com seu estilo e evolui com você.' },
];

const STEPS = [
  { n: '01', title: 'Descreva o caso',    body: 'Em linguagem natural, conte ao NOUS sobre o cliente, o contexto e o que você precisa. Sem formulários complexos.' },
  { n: '02', title: 'IA processa e gera', body: 'O NOUS analisa jurisprudência atualizada, aplica a legislação vigente e estrutura a peça com o seu padrão.' },
  { n: '03', title: 'Revise e entregue',  body: 'Rascunho completo para revisão. Ajuste, assine e entregue. Simples assim.' },
];

const TESTIMONIALS = [
  { name: 'Dra. Camila Fonseca', role: 'Trabalhista · Recife/PE',    quote: '"Reduzi em 70% o tempo em petições. O NOUS amplifica minha inteligência jurídica de forma surreal."',                   img: '/images/Adv_fem_em_pe.jpg',        init: 'CF' },
  { name: 'Dr. Rafael Mendes',   role: 'Cível · São Paulo/SP',        quote: '"Pesquisa jurisprudencial que levava 2h agora leva 10 min. Como ter um assistente sênior disponível 24h."',               img: '/images/Adv_Male_sentado.jpg',     init: 'RM' },
  { name: 'Dra. Juliana Castro', role: 'Sócia · Castro & Lima',       quote: '"Atendemos 40% mais clientes sem contratar ninguém. O ROI foi imediato e transformou nosso escritório."',                  img: '/images/Adv_Fem_Terno_Braco.jpg', init: 'JC' },
];

const FAQS = [
  { q: 'O NOUS substitui o advogado?',                  a: 'Não. O NOUS é um copiloto — executa o trabalho operacional para que você foque na estratégia, no cliente e na tese. A responsabilidade técnica e ética sempre é do advogado.' },
  { q: 'As peças geradas são juridicamente seguras?',   a: 'O NOUS foi treinado com legislação brasileira, jurisprudência de tribunais superiores e doutrinas atualizadas. Toda peça é ponto de partida para revisão profissional.' },
  { q: 'Meus dados de clientes estão protegidos?',      a: 'Sim. Criptografia de ponta a ponta, servidores no Brasil (100% LGPD) e nunca usamos dados de clientes para treinar modelos.' },
  { q: 'Funciona para todas as áreas do Direito?',      a: 'Cobre Trabalhista, Civil, Criminal, Tributário, Empresarial e Previdenciário — com expansão contínua de especialização.' },
  { q: 'Qual o custo do acesso?',                       a: 'Estamos em beta privado. Membros fundadores recebem condições especiais e acesso prioritário no lançamento. Inscreva-se para garantir.' },
];

const TICKER_ITEMS = ['Petições com IA','Jurisprudência','Análise de Contratos','Teses Estratégicas','Dashboard Jurídico','LGPD Compliant','Beta Privado','Membros Fundadores','Dados Protegidos'];
const NAV_LINKS    = [['#problema','Problema'],['#funcionalidades','Funcionalidades'],['#como-funciona','Como Funciona'],['#depoimentos','Depoimentos'],['#faq','FAQ']] as const;
const AREAS        = ['Trabalhista','Civil','Criminal','Tributário','Empresarial','Previdenciário','Outra'];
const SIZES        = ['Solo (apenas eu)','2 a 5 advogados','6 a 20 advogados','Mais de 20'];
const INTERESTS    = ['Petições e Peças','Pesquisa Jurisprudencial','Análise de Contratos','Gestão de Processos','Atendimento a Clientes','Teses Estratégicas'];

/* ─── App ───────────────────────────────────────── */
export default function App() {
  const [menu,      setMenu]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);

  const [formData, setFormData] = useState({
    nome: '', email: '', area: '', escritorio: '',
    interesses: [] as string[],
  });

  const { ref: sRef, on: sOn } = useInView(0.3);
  const n1 = useCounter(1847, 2200, sOn);
  const n2 = useCounter(83,   1700, sOn);
  const n3 = useCounter(1500, 2600, sOn);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const toggleInterest = useCallback((item: string) => {
    setFormData(prev => ({
      ...prev,
      interesses: prev.interesses.includes(item)
        ? prev.interesses.filter(i => i !== item)
        : [...prev.interesses, item],
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      if (SHEETS_URL) {
        // text/plain é "simple request" → no-cors aceita sem preflight
        // GAS ainda recebe o JSON via e.postData.contents (sem precisar reimplantar)
        await fetch(SHEETS_URL, {
          method:  'POST',
          mode:    'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body:    JSON.stringify({
            nome:       formData.nome,
            email:      formData.email,
            area:       formData.area,
            escritorio: formData.escritorio,
            interesses: formData.interesses.join(', '),
            data:       new Date().toLocaleString('pt-BR'),
            origem:     'Landing Page NOUS',
          }),
        });
      }
    } catch { /* resposta opaque em no-cors — dado enviado normalmente */ }
    finally { setSending(false); setSubmitted(true); }
  };

  /* Avatar fallback */
  const avatarFallback = (init: string) =>
    `<div style="width:100%;height:100%;background:rgba(201,165,92,.12);display:flex;align-items:center;justify-content:center;color:#C9A55C;font-weight:700;font-size:.7rem">${init}</div>`;

  return (
    <div className="text-[#E8F0F7] font-body antialiased overflow-x-hidden">

      {/* ═══ FLOATING NAV ═══ */}
      <div className="fixed top-3 md:top-4 left-3 right-3 md:left-0 md:right-0 z-50 md:flex md:justify-center md:px-4">
        <nav className={`w-full md:max-w-5xl transition-all duration-500 ${
          scrolled
            ? 'bg-[#070F1C]/96 backdrop-blur-2xl shadow-[0_8px_48px_rgba(0,0,0,0.7)] border border-white/10'
            : 'bg-[#070F1C]/70 backdrop-blur-xl border border-white/[0.07]'
        } rounded-xl md:rounded-2xl px-4 md:px-5 py-3 flex items-center justify-between gap-4`}>

          <a href="#" className="flex items-center gap-2.5 cursor-pointer flex-shrink-0">
            <img src="/iconeNousLegal.png" alt="NOUS" className="h-7 md:h-8 w-auto object-contain" />
            <span className="font-display font-semibold text-base md:text-[17px] tracking-wide text-[#E8F0F7]">NOUS</span>
          </a>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map(([href, label]) => (
              <a key={label} href={href} className="text-[13px] font-medium text-[#7A9AB5] hover:text-[#E8F0F7] transition-colors duration-200 cursor-pointer whitespace-nowrap">
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <a href="#acesso" className="hidden sm:inline-flex btn-gold px-4 md:px-5 py-2.5 text-[11px] md:text-[12px] cursor-pointer min-h-[40px] items-center">
              Garantir Acesso
            </a>
            <button
              className="lg:hidden size-10 flex items-center justify-center text-[#7A9AB5] hover:text-[#E8F0F7] hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              onClick={() => setMenu(!menu)}
              aria-label="Menu"
            >
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div className={`fixed top-16 md:top-20 left-3 right-3 z-40 transition-all duration-300 origin-top ${menu ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}>
        <div className="bg-[#070F1C]/98 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-1 mb-4">
            {NAV_LINKS.map(([href, label]) => (
              <a key={label} href={href}
                className="py-3 px-4 text-[#7A9AB5] hover:text-[#E8F0F7] hover:bg-white/5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer min-h-[44px] flex items-center"
                onClick={() => setMenu(false)}
              >{label}</a>
            ))}
          </div>
          <a href="#acesso" className="btn-gold w-full text-center text-[12px] py-3.5 cursor-pointer min-h-[44px] flex items-center justify-center" onClick={() => setMenu(false)}>
            Garantir Acesso Antecipado
          </a>
        </div>
      </div>

      <main>

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-hero" />
          <div className="absolute inset-0 grid-pattern" />
          <div className="blob w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-[#C9A55C]/7 top-0 -left-64 blur-[160px] md:blur-[200px]" />
          <div className="blob w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#0D3041]/60 bottom-0 -right-48 blur-[140px] md:blur-[180px]" style={{ animationDelay: '3s' }} />
          <div className="blob w-[250px] h-[250px] bg-[#C9A55C]/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px]" style={{ animationDelay: '1.5s' }} />

          <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-in-1 inline-flex items-center gap-3 mb-8 md:mb-10 px-4 py-2 rounded-full border border-[#C9A55C]/25 bg-[#C9A55C]/7 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A55C]/70 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#C9A55C]" />
              </span>
              <span className="text-[#C9A55C] text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.28em]">Beta Privado · Vagas Limitadas</span>
            </div>

            {/* Headline */}
            <h1 className="animate-in-2 font-display text-[clamp(2.6rem,10vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.01em] mb-5 md:mb-6 text-[#E8F0F7]">
              Pare de ser{' '}
              <em className="not-italic text-gold-gradient">operador.</em>
              <br />Seja estrategista.
            </h1>

            <p className="animate-in-3 text-[#7A9AB5] text-base md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed mb-3 font-light px-2">
              O NOUS é o copiloto jurídico com IA que elimina o trabalho burocrático e amplifica sua capacidade estratégica.
            </p>
            <p className="animate-in-3 text-[#7A9AB5]/55 text-sm md:text-base max-w-xl mx-auto mb-10 md:mb-12 leading-relaxed">
              Petições, pesquisa, análise de contratos — em fração do tempo.
            </p>

            {/* CTAs */}
            <div className="animate-in-4 flex flex-col sm:flex-row gap-3 justify-center items-center mb-10 md:mb-14 px-2">
              <a href="#acesso" className="btn-gold w-full sm:w-auto px-8 md:px-10 py-4 text-[12px] md:text-[13px] inline-flex items-center justify-center gap-2 cursor-pointer min-h-[52px]">
                Quero meu Acesso Antecipado <ArrowRight size={14} />
              </a>
              <a href="#como-funciona" className="btn-outline w-full sm:w-auto px-8 md:px-10 py-4 text-[12px] md:text-[13px] cursor-pointer min-h-[52px]">
                Ver como funciona
              </a>
            </div>

            {/* Stats */}
            <div ref={sRef} className="animate-in-5 grid grid-cols-3 border border-white/[0.07] rounded-xl md:rounded-2xl bg-white/[0.04] backdrop-blur-md max-w-sm sm:max-w-md md:max-w-2xl mx-auto overflow-hidden divide-x divide-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {[
                { v: sOn ? `${n1.toLocaleString('pt-BR')}+` : '—', label: 'Na lista de espera' },
                { v: sOn ? `${n2}%`                             : '—', label: 'Menos tempo op.' },
                { v: sOn ? `R$${n3.toLocaleString('pt-BR')}`   : '—', label: 'Valor/mês' },
              ].map(({ v, label }) => (
                <div key={label} className="py-4 md:py-5 px-3 md:px-6 text-center">
                  <div className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-[#C9A55C] tracking-tight tabular-nums leading-none">{v}</div>
                  <p className="text-[#7A9AB5]/55 text-[9px] md:text-[10px] uppercase tracking-widest mt-1.5 md:mt-2 font-medium leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            <div className="mt-14 md:mt-16 flex flex-col items-center gap-2 opacity-25 pointer-events-none">
              <div className="w-px h-8 bg-gradient-to-b from-[#C9A55C]/60 to-transparent animate-pulse" />
              <span className="text-[8px] uppercase tracking-[0.3em] text-[#7A9AB5]">scroll</span>
            </div>
          </div>
        </section>

        {/* ═══ TICKER ═══ */}
        <div className="border-y border-white/[0.06] bg-white/[0.02] overflow-hidden py-3.5 relative">
          <div className="ticker-outer">
            <div className="ticker-strip">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
                <span key={i} className="ticker-item">
                  <span className="size-1.5 rounded-full bg-[#C9A55C]/35 flex-shrink-0" />{t}
                </span>
              ))}
            </div>
          </div>
          <div className="grad-l" /><div className="grad-r" />
        </div>

        {/* ═══ THE PROBLEM ═══ */}
        <section id="problema" className="py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">

            <Reveal className="lg:sticky lg:top-28">
              <span className="section-tag">O Problema</span>
              <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.08] mt-4 md:mt-5 mb-5 md:mb-6 text-[#E8F0F7]">
                Você foi treinado<br />para pensar.
                <br /><span className="text-[#7A9AB5]/40">Por que passa horas</span>
                <br /><span className="text-[#7A9AB5]/40">redigindo?</span>
              </h2>
              <p className="text-[#7A9AB5] text-sm md:text-[15px] leading-relaxed mb-6 md:mb-8 max-w-sm">
                A formação jurídica exige raciocínio estratégico e domínio profundo das normas. Mas o dia a dia é dominado por tarefas operacionais que a IA executa com perfeição.
              </p>
              <blockquote className="border-l-2 border-[#C9A55C]/50 pl-4 md:pl-5 py-3 bg-[#C9A55C]/[0.05] rounded-r-xl pr-4">
                <p className="text-[#E8F0F7]/70 italic text-sm md:text-[15px] leading-relaxed">
                  "O trabalho de um advogado deveria ser resolver o que não tem solução óbvia — não datilografar o óbvio."
                </p>
                <cite className="not-italic text-[#C9A55C] text-[10px] font-bold uppercase tracking-widest mt-3 block">— NOUS Intelligence</cite>
              </blockquote>
            </Reveal>

            <div className="grid gap-3">
              {PAIN.map(({ Icon, title, body }, i) => (
                <Reveal key={i} delay={i + 1} className="group card flex gap-4 md:gap-5 p-5 md:p-6 cursor-default">
                  <div className="size-11 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-[#C9A55C]/30 group-hover:bg-[#C9A55C]/8 transition-all duration-300">
                    <Icon size={18} className="text-[#7A9AB5]/60 group-hover:text-[#C9A55C] transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#E8F0F7] text-sm md:text-[15px] mb-1.5 group-hover:text-[#C9A55C] transition-colors duration-200">{title}</h3>
                    <p className="text-[#7A9AB5] text-[12px] md:text-[13px] leading-relaxed">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section id="funcionalidades" className="py-20 md:py-28 px-4 sm:px-6 bg-section-alt">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-12 md:mb-16">
              <span className="section-tag">Funcionalidades</span>
              <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.08] mt-4 md:mt-5 mb-4 md:mb-5 text-[#E8F0F7]">
                Um escritório completo.
                <br /><span className="text-gold-gradient">Operado por inteligência.</span>
              </h2>
              <p className="text-[#7A9AB5] text-sm md:text-[15px] max-w-xl mx-auto leading-relaxed px-2">
                Do rascunho da petição à análise preditiva. O NOUS cobre todo o fluxo jurídico.
              </p>
            </Reveal>

            {/* Mobile: horizontal scroll */}
            <div className="md:hidden -mx-4 px-4">
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
                {FEATURES.map(({ Icon, tag, title, body, accent }, i) => (
                  <div key={i} className={`flex-none w-[78vw] snap-start card relative p-6 ${accent ? 'border-[#C9A55C]/22 bg-[#C9A55C]/[0.05]' : ''}`}>
                    <div className="flex justify-between items-start mb-5">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${accent ? 'bg-[#C9A55C]/15 border border-[#C9A55C]/30' : 'bg-white/[0.05] border border-white/[0.08]'}`}>
                        <Icon size={17} className="text-[#C9A55C]" />
                      </div>
                      <span className="text-[9px] font-bold text-[#C9A55C]/50 border border-[#C9A55C]/18 px-2 py-1 rounded-full tracking-[0.18em]">{tag}</span>
                    </div>
                    <h3 className="font-semibold text-[#E8F0F7] text-[14px] mb-2 leading-snug">{title}</h3>
                    <p className="text-[#7A9AB5] text-[12px] leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-1.5 mt-3">
                {FEATURES.map((_, i) => <span key={i} className={`inline-block h-1 rounded-full bg-[#C9A55C]/30 transition-all ${i === 0 ? 'w-4 bg-[#C9A55C]/70' : 'w-1.5'}`} />)}
              </div>
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map(({ Icon, tag, title, body, accent }, i) => (
                <Reveal key={i} delay={(i % 3) + 1} className={`group card relative p-7 cursor-default hover:-translate-y-2 ${accent ? 'border-[#C9A55C]/22 bg-[#C9A55C]/[0.05]' : ''}`}>
                  {accent && <div className="absolute inset-x-0 top-0 h-px shimmer-border rounded-t-xl" />}
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#C9A55C]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex justify-between items-start mb-6">
                    <div className={`size-10 rounded-xl flex items-center justify-center transition-all duration-300 ${accent ? 'bg-[#C9A55C]/15 border border-[#C9A55C]/30 group-hover:bg-[#C9A55C]/25' : 'bg-white/[0.05] border border-white/[0.08] group-hover:border-[#C9A55C]/30 group-hover:bg-[#C9A55C]/8'}`}>
                      <Icon size={17} className="text-[#C9A55C]" />
                    </div>
                    <span className="text-[9px] font-bold text-[#C9A55C]/50 border border-[#C9A55C]/18 px-2.5 py-1 rounded-full tracking-[0.2em]">{tag}</span>
                  </div>
                  <h3 className="font-semibold text-[#E8F0F7] text-[15px] mb-2.5 group-hover:text-[#C9A55C] transition-colors duration-200 leading-snug">{title}</h3>
                  <p className="text-[#7A9AB5] text-[13px] leading-relaxed">{body}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-[#C9A55C]/35 group-hover:text-[#C9A55C] text-[11px] font-semibold uppercase tracking-wider transition-all duration-300">
                    Saiba mais <ArrowRight size={10} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="como-funciona" className="py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-12 md:mb-16">
              <span className="section-tag">Processo</span>
              <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.08] mt-4 md:mt-5 text-[#E8F0F7]">
                Como funciona?<br /><span className="text-gold-gradient">Simples assim.</span>
              </h2>
            </Reveal>

            {/* Mobile: vertical */}
            <div className="md:hidden flex flex-col gap-0">
              {STEPS.map(({ n, title, body }, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="size-14 rounded-xl card flex items-center justify-center flex-shrink-0">
                      <span className="font-display text-2xl font-bold text-[#C9A55C]/60 tabular-nums">{n}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className="w-px h-full min-h-[2rem] bg-gradient-to-b from-[#C9A55C]/25 to-transparent mt-1" />}
                  </div>
                  <div className="pb-8 pt-1">
                    <h3 className="font-semibold text-[#E8F0F7] text-[15px] mb-2">{title}</h3>
                    <p className="text-[#7A9AB5] text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: horizontal */}
            <div className="hidden md:grid grid-cols-3 gap-10 relative">
              <div className="absolute top-[52px] left-[calc(33%+1.5rem)] right-[calc(33%+1.5rem)] h-px bg-gradient-to-r from-[#C9A55C]/15 via-[#C9A55C]/45 to-[#C9A55C]/15" />
              {STEPS.map(({ n, title, body }, i) => (
                <Reveal key={i} delay={i + 1} className="group text-center cursor-default">
                  <div className="size-[104px] mx-auto mb-6 rounded-2xl card flex items-center justify-center group-hover:border-[#C9A55C]/35 group-hover:bg-[#C9A55C]/5 transition-all duration-500">
                    <span className="font-display text-[2.5rem] font-bold text-white/[0.07] group-hover:text-[#C9A55C]/60 transition-colors duration-500 tabular-nums">{n}</span>
                  </div>
                  <h3 className="font-semibold text-[#E8F0F7] text-[15px] mb-2.5 group-hover:text-[#C9A55C] transition-colors duration-200">{title}</h3>
                  <p className="text-[#7A9AB5] text-[13px] leading-relaxed max-w-[220px] mx-auto">{body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PLATFORM PREVIEW ═══ */}
        <section className="py-16 md:py-20 px-4 sm:px-6 bg-section-alt overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-8 md:mb-10">
              <p className="text-[#C9A55C]/55 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] mb-2 md:mb-3">Interface NOUS</p>
              <h2 className="font-display text-[clamp(1.7rem,5vw,2.8rem)] font-bold leading-[1.1] text-[#E8F0F7]">
                A plataforma que redefine<br />o trabalho jurídico
              </h2>
            </Reveal>

            <Reveal delay={1} className="rounded-xl md:rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)] bg-[#070F1C]">
              {/* Browser chrome */}
              <div className="bg-[#0D1626] px-4 md:px-5 py-2.5 md:py-3 flex items-center gap-2 border-b border-white/[0.05]">
                <div className="flex gap-1.5">
                  <span className="size-3 rounded-full bg-red-400/60" />
                  <span className="size-3 rounded-full bg-yellow-400/60" />
                  <span className="size-3 rounded-full bg-green-400/60" />
                </div>
                <div className="flex-1 mx-3 md:mx-4 bg-white/[0.05] rounded-md px-2.5 py-1 flex items-center gap-1.5 min-w-0">
                  <Lock size={9} className="text-[#7A9AB5]/35 flex-shrink-0" />
                  <span className="text-[9px] md:text-[10px] text-[#7A9AB5]/35 font-mono truncate">app.nouslegal.com.br/nova-peca</span>
                </div>
              </div>

              <div className="flex h-[340px] sm:h-[380px] md:h-[460px]">
                <div className="hidden sm:flex w-44 md:w-52 border-r border-white/[0.05] bg-white/[0.02] flex-col p-3 md:p-4 gap-1">
                  <div className="flex items-center gap-2 mb-4 md:mb-5 px-1 md:px-2">
                    <img src="/iconeNousLegal.png" alt="NOUS" className="h-5 w-auto object-contain" />
                    <span className="font-display font-semibold text-sm text-[#E8F0F7]">NOUS</span>
                  </div>
                  {([['Dashboard',false],['Nova Peça',true],['Processos',false],['Jurisprudência',false],['Contratos',false]] as [string,boolean][]).map(([l,a]) => (
                    <div key={l} className={`px-3 py-2 rounded-lg text-[11px] font-medium cursor-default ${a ? 'bg-[#C9A55C]/10 text-[#C9A55C] border border-[#C9A55C]/20' : 'text-[#7A9AB5]/50 hover:text-[#7A9AB5]/80 hover:bg-white/[0.04]'}`}>{l}</div>
                  ))}
                </div>

                <div className="flex-1 p-4 md:p-6 overflow-hidden min-w-0">
                  <div className="flex justify-between items-start mb-4 md:mb-6 gap-3">
                    <div>
                      <h3 className="font-semibold text-[#E8F0F7] text-[13px] md:text-sm">Gerar Nova Peça</h3>
                      <p className="text-[#7A9AB5]/40 text-[10px] md:text-[11px] mt-0.5">Configure os parâmetros — a IA cuida do resto</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#C9A55C]/8 border border-[#C9A55C]/18 rounded-lg text-[#C9A55C] text-[9px] md:text-[10px] font-bold uppercase tracking-wide flex-shrink-0">
                      <span className="size-1.5 rounded-full bg-[#C9A55C] animate-pulse" />IA Ativa
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:gap-3 mb-2 md:mb-3">
                    {([['Tipo','Petição Inicial Trabalhista'],['Área','Direito Trabalhista']] as [string,string][]).map(([l,v]) => (
                      <div key={l} className="mock-field">
                        <div className="text-[7px] md:text-[8px] text-[#7A9AB5]/35 uppercase tracking-widest mb-1 font-bold">{l}</div>
                        <div className="text-[#7A9AB5]/65 text-[10px] md:text-[11px] truncate">{v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mock-field h-[70px] md:h-[80px] mb-3 md:mb-4">
                    <div className="text-[7px] md:text-[8px] text-[#7A9AB5]/35 uppercase tracking-widest mb-1.5 font-bold">Descrição do Caso</div>
                    <div className="text-[#7A9AB5]/50 text-[10px] md:text-[11px] leading-relaxed line-clamp-3">Reclamante trabalhou 3 anos sem registro em CTPS, recebendo R$&nbsp;2.800/mês. Demitido sem justa causa em novembro de 2024, sem pagamento das verbas rescisórias devidas...</div>
                  </div>

                  <div className="bg-[#C9A55C]/6 border border-[#C9A55C]/14 rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4">
                    <div className="size-8 md:size-9 rounded-xl bg-[#C9A55C]/12 border border-[#C9A55C]/22 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={13} className="text-[#C9A55C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5 md:mb-2">
                        <span className="text-[#E8F0F7] text-[10px] md:text-[11px] font-semibold truncate">NOUS está gerando sua peça...</span>
                        <span className="text-[#C9A55C] text-[10px] font-bold flex-shrink-0 ml-2">78%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#C9A55C]/50 to-[#C9A55C] gen-progress" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section id="depoimentos" className="py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-12 md:mb-16">
              <span className="section-tag">Depoimentos</span>
              <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.08] mt-4 md:mt-5 mb-4 text-[#E8F0F7]">
                Advogados que já operam<br /><span className="text-gold-gradient">com inteligência.</span>
              </h2>
              <p className="text-[#7A9AB5] text-sm md:text-[15px] max-w-md mx-auto">Resultados reais de profissionais do nosso beta privado.</p>
            </Reveal>

            {/* Mobile */}
            <div className="md:hidden -mx-4 px-4">
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
                {TESTIMONIALS.map(({ name, role, quote, img, init }, i) => (
                  <div key={i} className="flex-none w-[82vw] snap-start card flex flex-col p-6">
                    <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={12} className="text-[#C9A55C] fill-[#C9A55C]" />)}</div>
                    <p className="text-[#7A9AB5] text-[12px] leading-relaxed flex-1 mb-5 italic">{quote}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                      <div className="size-10 rounded-full overflow-hidden border-2 border-[#C9A55C]/18 flex-shrink-0">
                        <img src={img} alt={name} className="w-full h-full object-cover object-top"
                          onError={e => { e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerHTML=avatarFallback(init); }} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#E8F0F7] text-[12px]">{name}</p>
                        <p className="text-[#7A9AB5]/55 text-[10px] mt-0.5">{role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:grid grid-cols-3 gap-5">
              {TESTIMONIALS.map(({ name, role, quote, img, init }, i) => (
                <Reveal key={i} delay={i + 1} className="group card flex flex-col p-7 cursor-default hover:-translate-y-2">
                  <div className="flex gap-1 mb-5">{[...Array(5)].map((_, j) => <Star key={j} size={13} className="text-[#C9A55C] fill-[#C9A55C]" />)}</div>
                  <p className="text-[#7A9AB5] text-[13px] leading-relaxed flex-1 mb-6 italic">{quote}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <div className="size-11 rounded-full overflow-hidden border-2 border-[#C9A55C]/18 group-hover:border-[#C9A55C]/40 transition-colors duration-300 flex-shrink-0">
                      <img src={img} alt={name} className="w-full h-full object-cover object-top"
                        onError={e => { e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerHTML=avatarFallback(init); }} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#E8F0F7] text-[13px]">{name}</p>
                      <p className="text-[#7A9AB5]/55 text-[11px] mt-0.5">{role}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Trust strip */}
            <div className="mt-12 md:mt-14 flex flex-wrap justify-center gap-6 md:gap-10 border-t border-white/[0.06] pt-10">
              {([[Shield,'LGPD Compliant'],[TrendingUp,'83% mais produtividade'],[Lock,'Dados 100% protegidos']] as [React.ElementType, string][]).map(([Icon, label]) => (
                <div key={label} className="flex items-center gap-2 text-[#7A9AB5]/50">
                  <Icon size={13} className="text-[#C9A55C]/50" />
                  <span className="text-[11px] md:text-[12px] font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section id="faq" className="py-20 md:py-28 px-4 sm:px-6 bg-section-alt">
          <Reveal className="max-w-2xl mx-auto">
            <div className="text-center mb-12 md:mb-14">
              <span className="section-tag">FAQ</span>
              <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] font-bold mt-4 md:mt-5 text-[#E8F0F7]">Ficou com dúvidas?</h2>
            </div>
            {FAQS.map((f, i) => <Faq key={i} q={f.q} a={f.a} />)}
          </Reveal>
        </section>

        {/* ═══ LEAD FORM ═══ */}
        <section id="acesso" className="py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero" />
          <div className="blob w-[600px] h-[600px] bg-[#C9A55C]/6 -top-48 left-1/2 -translate-x-1/2 blur-[180px]" />
          <div className="blob w-[300px] h-[300px] bg-[#0D3041]/50 bottom-0 right-0 blur-[120px]" style={{ animationDelay: '2s' }} />

          <Reveal className="relative z-10 max-w-lg mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-[#C9A55C]/25 bg-[#C9A55C]/7">
                <span className="size-1.5 rounded-full bg-[#C9A55C] animate-pulse" />
                <span className="text-[#C9A55C] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.28em]">Acesso Antecipado</span>
              </div>
              <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.08] mb-4 text-[#E8F0F7]">
                Junte-se à elite<br /><span className="text-gold-gradient">jurídica do futuro.</span>
              </h2>
              <p className="text-[#7A9AB5] text-sm md:text-[15px] leading-relaxed max-w-sm mx-auto">
                Vagas limitadas. Membros fundadores recebem condições especiais e acesso prioritário.
              </p>
            </div>

            {submitted ? (
              <div className="card p-8 md:p-10 text-center">
                <div className="size-16 rounded-2xl bg-[#C9A55C]/12 border border-[#C9A55C]/28 flex items-center justify-center mx-auto mb-6 glow-gold">
                  <CheckCircle size={28} className="text-[#C9A55C]" />
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-[#E8F0F7] mb-3">Você está na lista!</h3>
                <p className="text-[#7A9AB5] text-sm leading-relaxed">Recebemos sua solicitação. Em breve entraremos em contato com as instruções de acesso ao beta privado do NOUS.</p>
                <p className="text-[#C9A55C] text-[11px] font-bold mt-5 uppercase tracking-widest">Bem-vindo à elite jurídica do futuro.</p>
              </div>
            ) : (
              <div className="card p-6 md:p-10">
                <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    <div>
                      <label className="field-label" htmlFor="nome">Nome completo</label>
                      <input id="nome" type="text" required className="field-input" placeholder="Dr. / Dra. Seu Nome"
                        value={formData.nome} onChange={e => setFormData(p => ({ ...p, nome: e.target.value }))} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="email">E-mail profissional</label>
                      <input id="email" type="email" required className="field-input" placeholder="voce@escritorio.com.br"
                        value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    <div>
                      <label className="field-label">Área de Atuação</label>
                      <select className="field-input" required value={formData.area} onChange={e => setFormData(p => ({ ...p, area: e.target.value }))}>
                        <option value="">Selecione...</option>
                        {AREAS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Tamanho do Escritório</label>
                      <select className="field-input" required value={formData.escritorio} onChange={e => setFormData(p => ({ ...p, escritorio: e.target.value }))}>
                        <option value="">Selecione...</option>
                        {SIZES.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="field-label mb-3 block">Onde o NOUS pode te ajudar mais?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-2.5">
                      {INTERESTS.map(item => (
                        <label key={item} className="group flex items-center gap-3 p-3 md:p-3.5 rounded-xl border border-white/[0.06] cursor-pointer hover:border-[#C9A55C]/25 hover:bg-[#C9A55C]/[0.04] transition-all duration-200 min-h-[44px]">
                          <input type="checkbox" className="size-4 rounded border-white/15 bg-white/5 cursor-pointer accent-[#C9A55C] flex-shrink-0"
                            checked={formData.interesses.includes(item)} onChange={() => toggleInterest(item)} />
                          <span className="text-[12px] md:text-[13px] text-[#7A9AB5]/75 group-hover:text-[#E8F0F7] transition-colors font-medium">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={sending}
                    className="btn-gold w-full py-4 text-[12px] md:text-[13px] mt-2 inline-flex items-center justify-center gap-2 cursor-pointer min-h-[52px] disabled:opacity-60">
                    {sending ? 'Enviando...' : <><span>Solicitar Acesso Antecipado</span><ArrowRight size={14} /></>}
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-[#7A9AB5]/35 text-[10px] md:text-[11px]">
                    {['LGPD Compliant','Sem spam','Cancele quando quiser'].map(t => (
                      <span key={t} className="flex items-center gap-1.5">
                        <CheckCircle size={11} className="text-[#C9A55C]/40" />{t}
                      </span>
                    ))}
                  </div>
                </form>
              </div>
            )}
          </Reveal>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="py-24 md:py-32 px-4 sm:px-6 text-center bg-cta relative overflow-hidden">
          <div className="blob w-[500px] h-[300px] bg-[#C9A55C]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[130px]" />
          <Reveal className="relative z-10 max-w-3xl mx-auto">
            <p className="text-[#C9A55C]/50 text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-bold mb-6 md:mb-7">O Futuro é Agora</p>
            <h2 className="font-display text-[clamp(2rem,7vw,4.5rem)] font-bold leading-[1.05] mb-7 md:mb-8 text-[#E8F0F7]">
              Seus concorrentes já<br />estão na lista.
              <br /><span className="text-[#E8F0F7]/12">Você vai ficar de fora?</span>
            </h2>
            <a href="#acesso" className="btn-gold inline-flex items-center gap-2 px-10 md:px-12 py-4 text-[12px] md:text-[13px] cursor-pointer min-h-[52px]">
              Quero meu Acesso ao NOUS <ArrowRight size={14} />
            </a>
          </Reveal>
        </section>

      </main>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#060E1A]/96 backdrop-blur-2xl border-t border-white/[0.07] z-50">
        <a href="#acesso" className="btn-gold w-full py-4 text-[12px] inline-flex items-center justify-center gap-2 cursor-pointer min-h-[52px]">
          Garantir Acesso Antecipado <ArrowRight size={13} />
        </a>
      </div>

      {/* Footer */}
      <footer className="py-8 md:py-10 px-4 sm:px-6 bg-[#060E1A] border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-2.5">
            <img src="/iconeNousLegal.png" alt="NOUS" className="h-6 w-auto object-contain" />
            <span className="font-display font-semibold text-base md:text-[17px] text-[#E8F0F7]">NOUS</span>
            <span className="text-[#7A9AB5]/30 text-sm">Intelligence</span>
          </div>
          <div className="flex gap-6 md:gap-8 text-[11px] uppercase tracking-widest font-medium text-[#7A9AB5]/35">
            {['Privacidade','Termos','Contato'].map(item => (
              <a key={item} href="#" className="hover:text-[#C9A55C] transition-colors duration-200 cursor-pointer min-h-[44px] inline-flex items-center">{item}</a>
            ))}
          </div>
          <p className="text-[11px] text-[#7A9AB5]/25">© 2025 NOUS Intelligence. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
