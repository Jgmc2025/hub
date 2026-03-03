import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, Video, Link as LinkIcon, 
  Trash2, ChevronLeft, ChevronRight, ExternalLink, 
  Zap, FileStack,
  Filter,
  Edit3,
  Tag,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

const Appointment = ({ onEdit }) => {
  const navigate = useNavigate();
  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const [selectedResource, setSelectedResource] = useState(null);
  const closeDetails = () => setSelectedResource(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchTags, setSearchTags] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const deleteResource = (id) => {
    Swal.fire({
      title: 'Remover Recurso?',
      text: "Esta ação não poderá ser desfeita.",
      showCancelButton: true,
      confirmButtonColor: '#dc2626', 
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      reverseButtons: true,
      width: 'auto',
      customClass: {
        popup: 'rounded-2xl shadow-2xl border border-slate-100 bg-white p-4',
        title: 'text-xl font-bold text-slate-800', 
        htmlContainer: 'text-sm text-slate-700 mt-1', 
        confirmButton: 'bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-xl mx-2 shadow-md shadow-red-200 active:scale-95 transition-all',
        cancelButton: 'bg-slate-500 text-white text-sm font-bold px-6 py-2 rounded-xl mx-2 active:scale-95 transition-all'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/resources/${id}`);
          fetchResources(); 
          toast.success("Recurso excluído com sucesso!");
        } catch (error) {
          toast.error("Erro ao excluir recurso.");
        }
      }
    });
  };
  const deleteAllResources = () => {
    if (resources.length === 0) return;
    Swal.fire({
      title: 'Limpar Repositório?',
      text: "Você está prestes a apagar todos os recursos.",
      showCancelButton: true,
      confirmButtonColor: '#dc2626', 
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      reverseButtons: true,
      width: 'auto',
      customClass: {
        popup: 'rounded-2xl shadow-2xl border border-slate-100 bg-white p-4',
        title: 'text-xl font-bold text-slate-800', 
        htmlContainer: 'text-sm text-slate-700 mt-1', 
        confirmButton: 'bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-xl mx-2 shadow-md shadow-red-200 active:scale-95 transition-all', 
        cancelButton: 'bg-slate-500 text-white text-sm font-bold px-6 py-2 rounded-xl mx-2 active:scale-95 transition-all'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await axios.delete('http://127.0.0.1:8000/resources/all');
          setResources([]); 
          toast.success("Repositório limpo com sucesso!");
        } catch (error) {
          toast.error("Erro ao conectar com o servidor.");
        } finally {
          setLoading(false);
          fetchResources(); 
        }
      }
    });
  };
  const filteredResources = resources.filter(res => {
    const matchesType = filterType === 'Todos' || res.resource_type === filterType;
    const matchesTitle = res.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesTags = res.tags ? res.tags.toLowerCase().includes(searchTags.toLowerCase()) : true;
    return matchesType && matchesTitle && matchesTags;
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
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  const hasActiveFilters = searchTitle !== '' || searchTags !== '' || filterType !== 'Todos';
  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      <Toaster position="top-center"/>
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] bg-[radial-gradient(at_top_left,_#e0e7ff_0%,_transparent_50%),_radial-gradient(at_bottom_right,_#f1f5f9_0%,_transparent_50%)]"></div>
      <nav className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto border-b border-indigo-50 mb-8 bg-white/30 backdrop-blur-md rounded-b-2xl shadow-sm">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-black text-2xl tracking-tighter text-indigo-600 hover:scale-105 transition-transform active:scale-95"
          title="Ir para menu"
        >
          <Zap fill="currentColor" size={24} />
          HUB EDU
        </button>
        <button onClick={() => navigate('/create')} className="text-sm font-bold text-indigo-600">Cadastrar Recurso</button>
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
              <div className="flex flex-col sm:flex-row gap-3 relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-bold shadow-sm ${
                    isFilterOpen || filterType !== 'Todos' || searchTitle || searchTags
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Filter size={16} />
                  Filtros
                  {(filterType !== 'Todos' || searchTitle || searchTags) && (
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                  )}
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Título</label>
                        <input 
                          type="text"
                          placeholder="Ex: Aula de React..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                          value={searchTitle}
                          onChange={(e) => setSearchTitle(capitalizeFirst(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Tipo</label>
                        <select 
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value="Todos">Todos os Tipos</option>
                          <option value="Vídeo">Vídeos</option>
                          <option value="PDF">PDFs</option>
                          <option value="Link">Links</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Tags</label>
                        <input 
                          type="text"
                          placeholder="Ex: Frontend,IA..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                          value={searchTags}
                          onChange={(e) => {
                            const valueWithoutSpaces = e.target.value.replace(/\s/g, '');
                            setSearchTags(capitalizeFirst(valueWithoutSpaces));
                          }}
                        />
                      </div>
                      {hasActiveFilters && (
                        <button 
                          onClick={() => {
                            setSearchTitle('');
                            setSearchTags('');
                            setFilterType('Todos');
                          }}
                          className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Limpar Filtros
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-inner">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="w-24 px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest text-center">Editar</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest text-left">Recurso</th>
                  <th className="w-24 px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest text-center">
                    <div className="flex items-center justify-center gap-2">Excluir
                      {resources.length > 0 && (
                        <button 
                          onClick={deleteAllResources}
                          className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-md transition-all group/all text-slate-600"
                          title="Excluir tudo"
                        >
                          <Trash2 size={14} className="group-hover/all:scale-110 transition-transform" />
                        </button>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="3" className="p-10 text-center text-slate-400 font-medium italic animate-pulse">Carregando dados...</td></tr>
                ) : currentItems.length === 0 ? (
                  <tr><td colSpan="3" className="p-10 text-center text-slate-400 font-medium italic">Nenhum recurso encontrado.</td></tr>
                ) : currentItems.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-6 text-center">
                      <button 
                        onClick={() => onEdit(res)}
                        className="inline-flex items-center justify-center p-2.5 text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90 shadow-sm"
                        title="Editar recurso"
                      >
                        <Edit3 size={18} strokeWidth={2} />
                      </button>
                    </td>
                    <td className="px-6 py-6 text-left cursor-pointer group/card relative" onClick={() => setSelectedResource(res)}>
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
                            className="flex items-center justify-center p-1.5 bg-slate-700 text-white rounded-md transition-colors shadow-sm shrink-0" 
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
                            <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded font-bold tracking-wider border border-indigo-100/50">
                              <Tag size={10} />
                              {tag}
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
                        <Trash2 size={18} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredResources.length > 0 &&
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 tracking-tight"> 
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              {filteredResources.length} {filteredResources.length === 1 ? 'Material' : 'Materiais'}
            </span>
              {filteredResources.length > 5 &&
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  Página {currentPage} de {totalPages || 1}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>}
            </div>}
          </div>
        </div>
      </div>
      {selectedResource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeDetails}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">            <div className={`h-2 w-full shrink-0 ${
              selectedResource.resource_type === 'Vídeo' ? 'bg-red-500' : 
              selectedResource.resource_type === 'PDF' ? 'bg-blue-500' : 'bg-emerald-500'
            }`} />
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    {getTypeIcon(selectedResource.resource_type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {selectedResource.resource_type}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                      {selectedResource.title}
                    </h2>
                  </div>
                </div>
                <button 
                  onClick={closeDetails}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-700 transition-colors"
                >
                  <X size={20} /> 
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Descrição</h3>
                  <p className="text-slate-600 leading-relaxed text-base bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedResource.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Tags Relacionadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.tags && selectedResource.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-2">
                        <Tag size={12} />
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-6 flex gap-3">
                <button 
                  onClick={() => { onEdit(selectedResource); closeDetails(); }}
                  className="p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90 shadow-sm text-slate-700"
                  title="Editar recurso"
                >
                  <Edit3 size={20} strokeWidth={2} />
                </button>
                <a 
                  href={selectedResource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
                >
                  Acessar Conteúdo
                  <ExternalLink size={18} />
                </a>
                <button 
                  onClick={() => { deleteResource(selectedResource.id); closeDetails(); }}
                  className="p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90 shadow-sm text-slate-700"
                  title="Excluir recurso"
                >
                  <Trash2 size={20} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Appointment;