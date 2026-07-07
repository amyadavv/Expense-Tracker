import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Wallet, ArrowRight, Loader2 } from 'lucide-react';

const AuthScreen = () => {
    const { login, register, error, setError } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setUsername('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (isLogin) {
            await login(email, password);
        } else {
            await register(username, email, password);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="auth-container">
            {/* Ambient Background Glows */}
            <div className="bg-glow bg-glow-1"></div>
            <div className="bg-glow bg-glow-2"></div>
            
            <div className="auth-card-wrapper">
                {/* Brand / Left side (visible on larger screens or stacked) */}
                <div className="auth-brand-section">
                    <div className="brand-logo-container">
                        <Wallet className="brand-icon-logo" size={32} />
                        <span className="brand-logo-text">SpendWise</span>
                    </div>
                    
                    <h1 className="brand-title">Smart Expense Management</h1>
                    <p className="brand-description">
                        Track, analyze, and optimize your personal finances. Take control of your daily expenses with our intuitive analytics platform.
                    </p>
                    
                    {/* Visual Stats Showcase inside branding */}
                    <div className="brand-feature-card">
                        <div className="feature-avatar-group">
                            <span className="feature-dot"></span>
                            <span className="feature-label">Separation of accounts</span>
                        </div>
                        <div className="feature-bar-container">
                            <div className="feature-bar" style={{ width: '70%' }}></div>
                            <div className="feature-bar" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Form Card Side */}
                <div className="auth-form-card">
                    <div className="auth-header">
                        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p>{isLogin ? 'Sign in to access your dashboard' : 'Join us to start managing your expenses'}</p>
                    </div>

                    {error && (
                        <div className="auth-error-alert">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <div className="input-with-icon">
                                    <User className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-with-icon">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-with-icon">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="btn-loading-content">
                                    <Loader2 className="animate-spin" size={18} />
                                    Processing...
                                </span>
                            ) : (
                                <span className="btn-content">
                                    {isLogin ? 'Sign In' : 'Get Started'}
                                    <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button onClick={toggleAuthMode} className="auth-toggle-link">
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
