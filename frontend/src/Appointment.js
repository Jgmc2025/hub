import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, FileText, Video, Link as LinkIcon, 
  Edit3, Trash2, ArrowLeft, ChevronLeft, ChevronRight, ExternalLink 
} from 'lucide-react';

const Appointment = ({ onBack }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold"
          >
            <ArrowLeft size={20} />
            Voltar ao Cadastro
          </button>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Repositório de Recursos</h2>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 mb-6 shadow-sm border border-white flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por título..." 
            className="bg-transparent border-none outline-none w-full text-slate-700 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Título / Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="3" className="p-10 text-center text-slate-400">Carregando recursos...</td></tr>
              ) : currentItems.length === 0 ? (
                <tr><td colSpan="3" className="p-10 text-center text-slate-400">Nenhum recurso encontrado.</td></tr>
              ) : currentItems.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-2 bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm w-fit">
                      {getTypeIcon(res.resource_type)}
                      <span className="text-xs font-bold text-slate-600 uppercase">{res.resource_type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                      {res.title}
                      <a href={res.url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-500 transition-colors">
                        <ExternalLink size={14} />
                      </a>
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-2 max-w-md">{res.description}</p>
                    <div className="flex gap-2 mt-2">
                      {res.tags && res.tags.split(',').map((tag, i) => (
                        <span key={i} className="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded font-bold uppercase">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteResource(res.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
            <span>Mostrando {currentItems.length} de {filteredResources.length} resultados</span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                disabled={indexOfLastItem >= filteredResources.length}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Appointment;