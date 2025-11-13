import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Filtros from './components/Filters';
import Login from './components/Login';
import Register from './components/Register';
import Xat from './components/Xat';
import Perfil from './components/Perfil';
import { AuthContext } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { state } = React.useContext(AuthContext);
  return state.token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <Filtros />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/" element={<PrivateRoute><Xat /></PrivateRoute>} />
      </Routes>
    </div>
  );
}
