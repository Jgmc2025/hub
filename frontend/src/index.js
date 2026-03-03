import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './Routes'; 

const Root = () => {
  const [editingResource, setEditingResource] = useState(null);
  return (
    <BrowserRouter>
      <Routes 
        editingResource={editingResource} 
        setEditingResource={setEditingResource} 
      />
    </BrowserRouter>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);