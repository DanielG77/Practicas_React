import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { AuthContext } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { state } = React.useContext(AuthContext);
  return state.token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="app">
      <Header />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
