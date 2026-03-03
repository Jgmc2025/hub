import { Sparkles, ArrowRight, Zap, Shield } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Toaster position="top-center"/>
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] bg-[radial-gradient(at_top_left,_#e0e7ff_0%,_transparent_50%),_radial-gradient(at_bottom_right,_#f1f5f9_0%,_transparent_50%)]"></div>
      <nav className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto border-b border-indigo-50 mb-8 bg-white/30 backdrop-blur-md rounded-b-2xl shadow-sm">
        <button 
          className="flex items-center gap-2 font-black text-2xl tracking-tighter text-indigo-600 hover:scale-105 transition-transform active:scale-95"
          title="Ir para menu"
        >
          <Zap fill="currentColor" size={24} />
          HUB EDU
        </button>
        <button onClick={() => navigate('/list')} className="text-sm font-bold text-indigo-600">Ver Repositório</button>
      </nav>
      <main className="px-8 pt-16 pb-24 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-600 text-xs font-bold mb-8 shadow-sm animate-fade-in">
          <Sparkles size={14} className="animate-pulse" />
          IA INTEGRADA: CRIE CONTEÚDOS MUITO MAIS RÁPIDO
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-[1.1]">
          Crie experiências de aprendizado que <span className="text-indigo-600">encantam.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Use inteligência artificial para organizar seus recursos, gerar descrições e entregar conteúdo de alta qualidade em segundos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <button 
            onClick={() => navigate('/create')}
            className="group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-5 px-10 rounded-xl shadow-2xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 text-lg"
          >
            Cadastrar Recurso
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white/40 backdrop-blur-md p-2 rounded-3xl border border-white shadow-2xl">
            <div className="bg-slate-900 rounded-2xl aspect-video flex items-center justify-center text-slate-500 overflow-hidden shadow-inner">
               <img 
                 src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200" 
                 alt="Interface Preview" 
                 className="opacity-50 object-cover w-full h-full"
               />
            </div>
          </div>
        </div>
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-200 pt-16 text-left">
  <div className="space-y-4">
    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
      <Sparkles size={24} />
    </div>
    <h3 className="font-bold text-xl tracking-tight text-slate-800">Smart Assist (IA)</h3>
    <p className="text-slate-500 leading-relaxed text-sm">
      Assistente Pedagógico integrado que utiliza LLM para sugerir descrições e 3 tags automáticas baseadas no título do material.
    </p>
  </div>
  <div className="space-y-4">
    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
      <Zap size={24} />
    </div>
    <h3 className="font-bold text-xl tracking-tight text-slate-800">Arquitetura Fullstack</h3>
    <p className="text-slate-500 leading-relaxed text-sm">
      SPA moderna em React integrada a uma API RESTful robusta, com persistência de dados em banco relacional e validação estrita.
    </p>
  </div>
  <div className="space-y-4">
    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
      <Shield size={24} />
    </div>
    <h3 className="font-bold text-xl tracking-tight text-slate-800">Pronto para Produção</h3>
    <p className="text-slate-500 leading-relaxed text-sm">
      Logs estruturados, monitoramento de latência da IA, Health Checks e Pipelines de CI para garantir a qualidade do código.
    </p>
  </div>
</div>
      </main>
      <footer className="text-center pb-12 text-slate-400 text-xs">
        © 2026 HUB EDU - Plataforma de Experiência de Aprendizagem.
      </footer>
    </div>
  );
};
export default Home;