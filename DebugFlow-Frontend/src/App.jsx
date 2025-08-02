import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import io from 'socket.io-client';

// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CodeAnalysis from './pages/CodeAnalysis';
import DebugSession from './pages/DebugSession';
import BugReports from './pages/BugReports';
import TestRunner from './pages/TestRunner';
import Settings from './pages/Settings';

// Context
import { SocketContext } from './contexts/SocketContext';
import { ApiContext } from './contexts/ApiContext';

// API
import api from './services/api';

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');
    
    newSocket.on('connect', () => {
      console.log('🔌 Connected to DebugFlow backend');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from backend');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      <ApiContext.Provider value={{ api, user, setUser }}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analysis" element={<CodeAnalysis />} />
                <Route path="/debug" element={<DebugSession />} />
                <Route path="/bugs" element={<BugReports />} />
                <Route path="/tests" element={<TestRunner />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>

            <Toaster position="top-right" />
          </div>
        </Router>
      </ApiContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
