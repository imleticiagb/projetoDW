import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SelecaoPage from './components/SelecaoPage';
import FilaPage from './components/FilaPage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/selecao" element={<SelecaoPage />} />
        <Route path="/fila" element={<FilaPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;