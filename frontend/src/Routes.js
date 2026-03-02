import { Routes as ReactRoutes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';
import Appointment from './Appointment';
import ResourceForm from './App'; 

export function Routes({ editingResource, setEditingResource }) {
  const navigate = useNavigate();
  const actions = {
    toHome: () => navigate('/'),
    toList: () => navigate('/list'),
    toCreate: () => {
      setEditingResource(null);
      navigate('/create');
    },
    toEdit: (resource) => {
      setEditingResource(resource);
      navigate('/create');
    }
  };
  return (
    <ReactRoutes>
      <Route path="/" element={<Home onStart={actions.toCreate} onViewList={actions.toList} />} />
      <Route path="/list" element={
        <Appointment 
          onNavigateToCreate={actions.toCreate} 
          onEdit={actions.toEdit} 
          onBack={actions.toHome} 
        /> 
      } />
      <Route path="/create" element={
        <ResourceForm 
          editingResource={editingResource} 
          setEditingResource={setEditingResource}
          onBack={actions.toHome}
          onViewList={actions.toList}
        /> 
      } />
    </ReactRoutes>
  );
}