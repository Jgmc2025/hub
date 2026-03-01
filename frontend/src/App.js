import { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, Save, Tag, X, Plus, HelpCircle, Zap } from 'lucide-react';
import Home from './Home';
import Appointment from './Appointment';

function App() {
  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const [view, setView] = useState('home');
  const [activeHelp, setActiveHelp] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null)
  const [isAdding, setIsAdding] = useState(false); 
  const [newTagValue, setNewTagValue] = useState('');
  const [editValue, setEditValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resource_type: 'Vídeo',
    tags: '',
    url: ''
  });
  const HelpButton = ({ id, text }) => (
    <span className="relative inline-block ml-2 align-middle">
      <span
        onMouseEnter={() => setActiveHelp(id)}
        onMouseLeave={() => setActiveHelp(null)}
        className="text-gray-400 hover:text-indigo-500 transition-colors"
      >
        <HelpCircle size={14} />
      </span>
      {activeHelp === id && (
        <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-2 bg-gray-700 text-white text-[12px] rounded shadow-lg animate-in fade-in zoom-in duration-200 tracking-normal leading-relaxed">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mb-1 border-8 border-transparent border-t-gray-700" />
        </div>
      )}
    </span>
  );
  const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t !== '') : [];
  const handleSmartAssist = async () => {
    if (!formData.title) {
      alert("Digite um título primeiro!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/smart-assist', {
        title: formData.title,
        resource_type: formData.resource_type
      });
      setFormData({
        ...formData,
        description: capitalizeFirst(response.data.description),
        tags: response.data.tags.map(t => capitalizeFirst(t.trim())).join(', ')
      });
    } catch (error) {
      console.error("Erro na IA:", error);
      alert("O Serviço de Assistência por IA está indisponível no momento. Por favor, tente mais tarde.");
    } finally {
      setLoading(false);
    }
  };
  const validateForm = () => {
    const titleClean = formData.title.trim();
    const urlClean = formData.url.trim();
    if (titleClean.length < 3) {
      alert("Por favor, insira um título mais descritivo.");
      return false;
    }
    try {
      if (!urlClean) throw new Error();
      new URL(urlClean);
    } catch (error) {
      alert("Por favor, insira um endereço de URL válido.");
      return false;
    }
    return true;
  };
  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        resource_type: formData.resource_type,
        url: formData.url,
        tags: tagsArray.join(', ')
      };
      await axios.post('http://127.0.0.1:8000/resources', payload);
      alert("Recurso salvo com sucesso!");
      setFormData({ 
        title: '', 
        description: '', 
        resource_type: 'Vídeo', 
        tags: '', 
        url: '' 
      });
      setView('list'); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };
  const updateTagsString = (newArray) => {
    setFormData({ ...formData, tags: newArray.join(', ') });
  };
  const removeTag = (indexToRemove) => {
    updateTagsString(tagsArray.filter((_, index) => index !== indexToRemove));
  };
  const saveTagEdit = (index) => {
    const cleanEdit = editValue.trim().toLowerCase();
    if (!cleanEdit) {
      setEditingIndex(null);
      return;
    }
    const isDuplicate = tagsArray.some((tag, i) => i !== index && tag.toLowerCase() === cleanEdit);
    if (isDuplicate) {
      alert(`A tag "${cleanEdit}" já existe nesta lista.`);
      setEditingIndex(null); 
      return;
    }
    const newTags = [...tagsArray];
    newTags[index] = editValue.trim(); 
    updateTagsString(newTags);
    setEditingIndex(null);
  };
  const addNewTag = () => {
    const cleanTag = newTagValue.trim();
    if (cleanTag) {
      const tagExists = tagsArray.some(t => t.toLowerCase() === cleanTag.toLowerCase());
      if (tagExists) {
        alert("Esta tag já existe.");
      } else {
        updateTagsString([...tagsArray, cleanTag]);
      }
    }
    setNewTagValue('');
    setIsAdding(false);
  };
  const titleError = formData.title.length > 0 && formData.title.trim().length < 3;
  const descError = formData.description.length > 0 && formData.description.trim().length < 20;
  const isUrlValid = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };
  const urlError = formData.url.length > 0 && !isUrlValid(formData.url);
  const isFormValid = () => {
    const isTitleValid = formData.title.trim().length >= 3;
    const isDescriptionValid = formData.description.trim().length >= 20;
    const isTagsValid = tagsArray.length > 0;
    let isUrlValid = false;
    try {
      new URL(formData.url);
      isUrlValid = true;
    } catch (e) {
      isUrlValid = false;
    }
    return isTitleValid && isDescriptionValid && isTagsValid && isUrlValid;
  };
  if (view === 'home') {
    return <Home onStart={() => setView('create')} />;
  }
  if (view === 'list') {
    return <Appointment onBack={() => setView('create')} />;
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
        <button onClick={() => setView('list')} className="text-sm font-bold text-indigo-600">
             Ver Repositório
          </button>
      </nav>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Recurso</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título
            <HelpButton id="title" text="Dê um nome claro e objetivo ao recurso para facilitar a busca futura." />
            </label>
            <input 
              type="text"
              className={`block w-full border rounded-md p-2 outline-none transition-all ${titleError ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: capitalizeFirst(e.target.value)})}
              placeholder='Insira o título...'
            />
            {titleError && <p className="text-red-500 text-xs mt-1">Mínimo de 3 dígitos.</p>}
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo
              <HelpButton id="type" text="Selecione o formato do conteúdo: Vídeo (YouTube), PDF (Documentos) ou Link (Artigos)." />
              </label>
              <select 
                className="block w-full border border-gray-300 rounded-md px-2 h-11 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.resource_type}
                onChange={(e) => setFormData({...formData, resource_type: e.target.value})}
              >
                <option>Vídeo</option>
                <option>PDF</option>
                <option>Link</option>
              </select>
            </div>
            <button 
              onClick={handleSmartAssist} 
              disabled={loading || titleError || formData.title.length === 0} 
              className={`flex items-center justify-center gap-2 px-4 rounded-md transition-all h-11 font-medium flex-none w-[240px] whitespace-nowrap
                ${loading || titleError || formData.title.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm active:scale-95'
                }`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {loading ? 'Gerando...' : "Gerar Descrição com IA"}
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2 h-6 mb-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center leading-none">Descrição
              <HelpButton id="desc" text="Explique brevemente o que o aluno encontrará neste recurso. A IA pode preencher isso para você!" />
              </label>
              {loading && (
                <span className="text-indigo-600 text-xs font-medium animate-pulse flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" />
                  IA escrevendo descrição...
                </span>
              )}
            </div>
            <div className={`relative border rounded-md bg-white transition-all ${descError ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-200' : 'border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500'}`}>
              <textarea 
                rows="4"
                className="block w-full border-none bg-transparent py-2 px-3 pr-10 resize-none outline-none overflow-y-auto leading-relaxed text-black"
                style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)' }}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: capitalizeFirst(e.target.value)})}
                placeholder='Descreva o conteúdo completo...'
              />
            </div>
            {descError && <p className="text-red-500 text-xs mt-1">Mínimo de 20 dígitos.</p>}
          </div>
          <div>
            <div className="flex items-center gap-2 h-6 mb-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center leading-none">Tags
              <HelpButton id="tags" text="Palavras-chave que ajudam a organizar seu conteúdo. Ex: 'React', 'Frontend', 'Iniciante'." />
              </label>
              {loading && (
                <span className="text-indigo-600 text-xs font-medium animate-pulse flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" />
                  IA escrevendo tags...
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-300 rounded-md min-h-[60px] items-center">
              {tagsArray.map((tag, index) => (
                <div key={index} className="flex items-center">
                  {editingIndex === index ? (
                    <input 
                      autoFocus
                      className="group flex items-center gap-1 bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-md border border-indigo-100 shadow-sm hover:border-indigo-400 transition-all"
                      value={editValue}
                      onChange={(e) => setEditValue(capitalizeFirst(e.target.value))}
                      onBlur={() => saveTagEdit(index)}
                      onKeyDown={(e) => e.key === 'Enter' && saveTagEdit(index)}
                    />
                  ) : (
                    <span className="group flex items-center gap-1 bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-md border border-indigo-100 shadow-sm hover:border-indigo-400 transition-all">
                      <span onClick={() => { setEditingIndex(index); setEditValue(tag); }} className="cursor-pointer flex items-center gap-1">
                        <Tag size={10} />
                        {tag}
                      </span>
                      <X 
                        size={14} 
                        className="ml-1 text-gray-300 hover:text-red-500 cursor-pointer" 
                        onClick={() => removeTag(index)}
                      />
                    </span>
                  )}
                </div>
              ))}
              {isAdding ? (
                <input 
                  autoFocus
                  placeholder="Nome da tag..."
                  className="group flex items-center gap-1 bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-md border border-indigo-100 shadow-sm hover:border-indigo-400 transition-all"
                  onChange={(e) => setNewTagValue(capitalizeFirst(e.target.value))}
                  onBlur={addNewTag}
                  onKeyDown={(e) => e.key === 'Enter' && addNewTag()}
                />
              ) : (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-1 bg-white text-gray-400 text-xs font-bold px-3 py-1.5 rounded-md border border-dashed border-gray-300 hover:border-indigo-400 hover:text-indigo-500 transition-all shadow-sm"
                >
                  <Plus size={14} />
                  Nova Tag
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">URL
            <HelpButton id="url" text="Insira o link completo começando com http:// ou https:// para que o recurso possa ser acessado." />
            </label>
            <input 
              type="url"
              className={`block w-full border rounded-md p-2 outline-none transition-all ${urlError ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              placeholder='https://youtube.com/...'
            />
            {urlError && <p className="text-red-500 text-xs mt-1">Insira uma URL válida.</p>}
          </div>
          <button 
            onClick={handleSave}
            disabled={loading || !isFormValid()}
            className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-md mt-6 transition-all active:scale-95 
              ${loading || !isFormValid() 
                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              }`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;