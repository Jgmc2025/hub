import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, FileText, Video, Link as LinkIcon, 
  Trash2, ChevronLeft, ChevronRight, ExternalLink, 
  Zap, FileStack,
  Filter,
  Edit3
} from 'lucide-react';
import Home from './Home';

const Appointment = () => {
  const [filterType, setFilterType] = useState('Todos');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState('list'); 
  const resourcesPerPage = 5;
  useEffect(() => {
    fetchResources();
  }, []);
  const fetchResources = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/resources');
      setResources(response.data);
    } catch (error) {
      console.error("Erro ao buscar recursos:", error);
    } finally {
      setLoading(false);
    }
  };
  const deleteResource = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este recurso?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/resources/${id}`);
        fetchResources(); 
      } catch (error) {
        alert("Erro ao excluir recurso.");
      }
    }
  };
  const filteredResources = resources.filter(res => {
    const matchesTitle = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Todos' || res.resource_type === filterType;
    return matchesTitle && matchesType;
  });
  const indexOfLastItem = currentPage * resourcesPerPage;
  const indexOfFirstItem = indexOfLastItem - resourcesPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Vídeo': return <Video size={16} className="text-red-500" />;
      case 'PDF': return <FileText size={16} className="text-blue-500" />;
      default: return <LinkIcon size={16} className="text-emerald-500" />;
    }
  };
  if (view === 'home') {
    return <Home onStart={() => setView('list')} />;
  }
  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] bg-[radial-gradient(at_top_left,_#e0e7ff_0%,_transparent_50%),_radial-gradient(at_bottom_right,_#f1f5f9_0%,_transparent_50%)]"></div>
      <nav className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto border-b border-indigo-50 mb-8 bg-white/30 backdrop-blur-md rounded-b-2xl shadow-sm">
        <button 
          onClick={() => setView('home')}
          className="flex items-center gap-2 font-black text-2xl tracking-tighter text-indigo-600 hover:scale-105 transition-transform active:scale-95"
          title="Voltar para a Home"
        >
          <Zap fill="currentColor" size={24} />
          HUB EDU
        </button>
      </nav>
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white">
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FileStack className="text-indigo-600" size={24} />
                  Repositório de Recursos
                </h1>
                <p className="text-slate-500 text-sm mt-1 font-medium italic">Gerencie seus materiais didáticos.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Filtrar por título..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative min-w-[160px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-600 appearance-none cursor-pointer"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="Todos">Todos os Tipos</option>
                  <option value="Vídeo">Vídeos</option>
                  <option value="PDF">PDFs</option>
                  <option value="Link">Links</option>
                </select>
              </div>
            </div>
          </div>
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="w-24 px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Editar</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">Recurso</th>
                  <th className="w-24 px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Excluir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="3" className="p-10 text-center text-slate-400 font-medium italic animate-pulse">Carregando dados...</td></tr>
                ) : currentItems.length === 0 ? (
                  <tr><td colSpan="3" className="p-10 text-center text-slate-400 font-medium italic">Nenhum recurso encontrado no banco.</td></tr>
                ) : currentItems.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-6 text-center">
                      <button 
                        className="inline-flex items-center justify-center p-2.5 text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90 shadow-sm"
                        title="Editar recurso"
                      >
                        <Edit3 size={20} strokeWidth={2} />
                      </button>
                    </td>
                    <td className="px-6 py-6 text-left">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-bold text-slate-800 tracking-tight text-lg truncate">
                            {res.title}
                          </h4>
                          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md shrink-0">
                            {getTypeIcon(res.resource_type)}
                            <span className="text-xs font-bold text-slate-600 tracking-tighter">
                              {res.resource_type}
                            </span>
                          </div>
                          <a 
                            href={res.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center justify-center p-1.5 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors shadow-sm shrink-0" 
                            title="Acessar URL"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 max-w-2xl leading-relaxed mb-3">
                          {res.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {res.tags && res.tags.split(',').map((tag, i) => (
                            <span key={i} className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded font-bold tracking-wider border border-indigo-100/50">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <button 
                        onClick={() => deleteResource(res.id)}
                        className="inline-flex items-center justify-center p-2.5 text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90 shadow-sm"
                        title="Excluir recurso"
                      >
                        <Trash2 size={20} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-tight">
              <span>{filteredResources.length} {filteredResources.length === 1 ? 'Material' : 'Materiais'}</span>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  disabled={indexOfLastItem >= filteredResources.length}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Appointment;