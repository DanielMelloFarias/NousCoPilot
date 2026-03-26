import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

// Using the same SHEETS_URL as App.tsx
const SHEETS_URL = (import.meta as any).env?.VITE_SHEETS_URL ?? '';

// Define the questions and options
const QUESTIONS = [
  {
    id: 'tempoDocumentos',
    title: 'Quanto tempo sua equipe gasta hoje apenas coletando, organizando e renomeando documentos de clientes?',
    options: [
      { label: 'Menos de 1h/dia', score: 3 },
      { label: 'Entre 1h e 3h/dia', score: 2 },
      { label: 'Mais de 3h/dia', score: 1 },
    ]
  },
  {
    id: 'analiseInicial',
    title: 'Como é feita a primeira análise do caso e a elaboração da minuta inicial após a chegada dos documentos?',
    options: [
      { label: 'IA integrada gera rascunho', score: 3 },
      { label: 'Modelos prontos editados a mão', score: 2 },
      { label: 'Começamos do zero toda vez', score: 1 },
    ]
  },
  {
    id: 'atendimentoTriagem',
    title: 'Onde ocorre o atendimento e a triagem dos seus novos clientes?',
    options: [
      { label: 'Plataforma com CRM Whatsapp integrado', score: 3 },
      { label: 'WhatsApp Business Pessoal', score: 2 },
      { label: 'Telefone e email', score: 1 },
    ]
  },
  {
    id: 'gestaoFinanceira',
    title: 'Qual o nível de dificuldade para gerar boletos, cobrar honorários e gerir o financeiro do escritório?',
    options: [
      { label: 'Totalmente automatizado', score: 3 },
      { label: 'Manual, via Excel ou banco', score: 2 },
      { label: 'Não temos um controle rigoroso', score: 1 },
    ]
  },
  {
    id: 'preocupacaoTecnologia',
    title: 'Qual a sua maior preocupação ao adotar novas tecnologias hoje?',
    options: [
      { label: 'Custo de aquisição', score: 0 },
      { label: 'Curva de aprendizado da equipe', score: 0 },
      { label: 'Segurança de dados/LGPD', score: 0 },
    ]
  }
];

export default function Diagnostico() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [areasAtuacao, setAreasAtuacao] = useState('');
  const [lead, setLead] = useState({ nome: '', email: '', telefone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; nivel: string } | null>(null);

  const totalSteps = QUESTIONS.length + 2; // Questions + Areas + Lead Form

  const handleSelectOption = (questionId: string, optionLabel: string, optionScore: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionLabel }));
    setScores(prev => ({ ...prev, [questionId]: optionScore }));
    setTimeout(() => handleNext(), 300); // Auto-advance after short delay
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const calculateMaturity = () => {
    const totalScore = Object.values(scores).reduce((acc: number, curr: number) => acc + curr, 0);
    // Max score is 12 (4 questions with max 3 points)
    if (totalScore >= 10) return { score: totalScore, nivel: 'Avançado' };
    if (totalScore >= 7) return { score: totalScore, nivel: 'Intermediário' };
    return { score: totalScore, nivel: 'Iniciante' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const maturityResult = calculateMaturity();
    
    try {
      if (SHEETS_URL) {
        await fetch(SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            nome: lead.nome,
            email: lead.email,
            whatsapp: lead.telefone,
            area: areasAtuacao,
            escritorio: 'Não informado (Diagnóstico)',
            interesses: 'Diagnóstico de Maturidade Web',
            data: new Date().toLocaleString('pt-BR'),
            origem: 'Diagnóstico de Maturidade Digital',
            // Envia score e nivel nas extra fields se o script gas capturar, 
            // no momento ele salva como infos. Vamos embutir no campo escritorio ou formatar
            diagnostico_nivel: maturityResult.nivel,
            diagnostico_score: maturityResult.score,
            diagnostico_respostas: JSON.stringify(answers)
          }),
        });
      }
    } catch {
      // opaque response in no-cors
    } finally {
      setResult(maturityResult);
      setIsSubmitting(false);
      setStep(totalSteps); // Move to result view
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-[#C9A55C] selection:text-[#070F1C] bg-[#070F1C] relative overflow-hidden font-body text-[#E8F0F7]">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-hero pointer-events-none" />
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="blob w-[500px] h-[500px] bg-[#C9A55C]/7 top-0 -left-64 blur-[160px] pointer-events-none" />
      <div className="blob w-[400px] h-[400px] bg-[#0D3041]/60 bottom-0 -right-48 blur-[140px] pointer-events-none" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 w-full max-w-2xl px-2 sm:px-0 mt-8 mb-8">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-10 space-y-4 text-center">
          <div className="w-16 h-16 bg-white/[0.05] border border-white/[0.08] rounded-3xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-3">
             <img src="/iconeNousLegal.png" alt="NOUS" className="w-full h-full object-contain opacity-90" />
          </div>
          <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-bold leading-[1.08] text-[#E8F0F7] uppercase">
            Diagnóstico de <br/>
            <span className="text-gold-gradient">
              Maturidade Digital
            </span>
          </h1>
        </div>

        {/* Card */}
        <div className="card p-6 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
          
          {/* Progress Bar */}
          {step < totalSteps && (
             <div className="mb-8 space-y-3">
               <div className="flex justify-between text-[10px] md:text-[11px] font-bold text-[#7A9AB5] uppercase tracking-widest">
                 <span>Passo {step + 1} de {totalSteps}</span>
               </div>
               <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-[#B8935A] to-[#C9A55C] transition-all duration-500 ease-out" 
                   style={{ width: `${((step + 1) / totalSteps) * 100}%` }} 
                 />
               </div>
             </div>
          )}

          <AnimatePresence mode="wait">
            {/* --- QUESTIONS (Steps 0 to 4) --- */}
            {step < QUESTIONS.length && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-lg sm:text-2xl font-semibold text-[#E8F0F7] leading-tight">
                  {QUESTIONS[step].title}
                </h2>
                <div className="space-y-3">
                  {QUESTIONS[step].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(QUESTIONS[step].id, opt.label, opt.score)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 font-medium text-[13px] md:text-[14px]
                        ${answers[QUESTIONS[step].id] === opt.label
                          ? "border-[#C9A55C] bg-[#C9A55C]/10 text-[#C9A55C] shadow-[0_0_15px_rgba(201,165,92,0.15)]"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-[#C9A55C]/40 hover:bg-white/[0.05] text-[#7A9AB5] hover:text-[#E8F0F7]"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- ÁREAS DE ATUAÇÃO (Step 5) --- */}
            {step === QUESTIONS.length && (
              <motion.div
                key="step-areas"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-lg sm:text-2xl font-semibold text-[#E8F0F7] leading-tight">
                  Quais as suas áreas de atuação?
                </h2>
                <div className="space-y-5">
                  <textarea
                    placeholder="Ex: Cível, Trabalhista, Previdenciário..."
                    value={areasAtuacao}
                    onChange={(e) => setAreasAtuacao(e.target.value)}
                    className="field-input min-h-[120px] resize-none text-[13px] md:text-sm p-4 w-full"
                  />
                  <button 
                    onClick={handleNext}
                    disabled={!areasAtuacao.trim()}
                    className="btn-gold w-full text-[12px] md:text-[13px] flex items-center justify-center gap-2 min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* --- LEAD CAPTURE (Step 6) --- */}
            {step === QUESTIONS.length + 1 && (
              <motion.div
                key="step-lead"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-3 text-center">
                  <h2 className="text-xl sm:text-3xl font-bold text-[#E8F0F7] leading-tight">
                    Estamos quase lá!
                  </h2>
                  <p className="text-[13px] md:text-sm text-[#7A9AB5]">
                    Preencha seus dados para ver o resultado do seu diagnóstico.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                  <div className="space-y-2">
                    <label htmlFor="nome" className="field-label block">Nome completo</label>
                    <input 
                      id="nome" 
                      required 
                      value={lead.nome}
                      onChange={e => setLead({...lead, nome: e.target.value})}
                      className="field-input" 
                      placeholder="Dr(a). Fulano de Tal" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="field-label block">E-mail profissional</label>
                    <input 
                      id="email" 
                      type="email" 
                      required 
                      value={lead.email}
                      onChange={e => setLead({...lead, email: e.target.value})}
                      className="field-input" 
                      placeholder="contato@escritorio.com.br" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="telefone" className="field-label block">WhatsApp</label>
                    <input 
                      id="telefone" 
                      type="tel" 
                      required 
                      value={lead.telefone}
                      onChange={e => setLead({...lead, telefone: e.target.value})}
                      className="field-input" 
                      placeholder="(00) 00000-0000" 
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn-gold w-full text-[12px] md:text-[13px] flex items-center justify-center gap-2 min-h-[52px] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processando..." : "Ver Meu Resultado"}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A9AB5]/50 mt-4">
                    <ShieldCheck className="w-4 h-4 text-[#C9A55C]/40" />
                    <span>Dados protegidos e 100% seguros (LGPD).</span>
                  </div>
                </form>
              </motion.div>
            )}

            {/* --- RESULTADO (Final) --- */}
            {step === totalSteps && result && (
              <motion.div
                key="step-result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 py-6"
              >
                <div className="w-20 h-20 bg-[#C9A55C]/10 border border-[#C9A55C]/20 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(201,165,92,0.15)] glow-gold">
                  <CheckCircle2 className="w-10 h-10 text-[#C9A55C]" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#7A9AB5]">
                    Seu nível de maturidade
                  </h2>
                  <h3 className="text-4xl sm:text-5xl font-display font-bold uppercase text-gold-gradient">
                    {result.nivel}
                  </h3>
                </div>

                <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/[0.08] text-left space-y-4 shadow-inner">
                  <p className="text-[13px] md:text-sm font-medium text-[#7A9AB5] leading-relaxed">
                    {result.nivel === 'Iniciante' && "Seu escritório ainda depende muito de processos manuais, o que rouba tempo valioso da sua equipe. A boa notícia é que com as ferramentas certas, você pode automatizar tarefas rotineiras e focar no que realmente importa: a estratégia jurídica e o atendimento."}
                    {result.nivel === 'Intermediário' && "Você já utiliza algumas tecnologias a favor do seu escritório, mas ainda existem gargalos operacionais que impedem a escala. O próximo passo é centralizar ferramentas e usar IA para peças e atendimento."}
                    {result.nivel === 'Avançado' && "Parabéns! Seu escritório tem uma base digital sólida. Você já entende o valor da automação. Com a plataforma completa da NOUS, você pode ir além com IAs completas treinadas especificamente para a rotina jurídica em todas as fases."}
                  </p>
                </div>

                <div className="space-y-5 pt-6">
                  <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#C9A55C]/60">
                    O próximo nível te espera
                  </p>
                  <button 
                    onClick={() => window.location.href = 'https://plataforma.nouslegal.com.br/'}
                    className="btn-gold w-full text-[12px] md:text-[13px] flex items-center justify-center gap-2 min-h-[52px]"
                  >
                    Conheça a NOUS IA 360 <Zap className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls (Back button) */}
          {step > 0 && step < totalSteps && !isSubmitting && (
            <div className="mt-8 pt-5 border-t border-white/[0.06] flex justify-start">
              <button 
                onClick={handleBack}
                className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-[#7A9AB5]/60 hover:text-[#C9A55C] font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
