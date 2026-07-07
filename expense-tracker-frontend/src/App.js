import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import './App.css';

function MainApp() {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <div className="app-loading-screen">
                <div className="loader-spinner"></div>
                <p>Syncing your wallet...</p>
            </div>
        );
    }

    return token ? <Dashboard /> : <AuthScreen />;
}

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <MainApp />
            </div>
        </AuthProvider>
    );
}

export default App;
