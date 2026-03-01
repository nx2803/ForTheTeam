'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { login, signup, LoginResponse } from '@/lib/authApi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess?: (user: LoginResponse) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nickname: '',
        teamId: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                const user = await login({
                    email: formData.email,
                    pass: formData.password,
                });

                // 로그인 성공 - 로컬스토리지에 저장
                localStorage.setItem('user', JSON.stringify(user));
                onLoginSuccess?.(user);
                onClose();
            } else {
                // 회원가입
                if (!formData.nickname || !formData.teamId) {
                    setError('모든 필드를 입력해주세요');
                    setIsLoading(false);
                    return;
                }

                const user = await signup({
                    email: formData.email,
                    pass: formData.password,
                    nickname: formData.nickname,
                    teamId: formData.teamId,
                });

                // 회원가입 성공 - 자동 로그인
                localStorage.setItem('user', JSON.stringify(user));
                onLoginSuccess?.(user);
                onClose();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setError('');
        setFormData({ email: '', password: '', nickname: '', teamId: '' });
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border-2 border-zinc-800 w-full max-w-md p-8 relative shadow-[0_0_40px_rgba(227,6,19,0.1)] rounded-lg overflow-hidden"
                        >
                            {/* Decorative Accent Removed as requested */}
                            {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sport-red to-transparent" /> */}

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-black font-oswald text-white uppercase italic tracking-tighter">
                                    {mode === 'login' ? 'MEMBER' : 'CREATE'} <span className="text-sport-red">{mode === 'login' ? 'LOGIN' : 'ACCOUNT'}</span>
                                </h2>
                                <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-widest">
                                    {mode === 'login' ? 'Access your personalized dashboard' : 'Join the team community'}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-mono rounded-sm">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 font-mono">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 focus:outline-none focus:border-sport-red focus:bg-zinc-900 transition-all font-mono text-sm rounded-sm placeholder:text-zinc-700"
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 font-mono">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 focus:outline-none focus:border-sport-red focus:bg-zinc-900 transition-all font-mono text-sm rounded-sm placeholder:text-zinc-700"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                {mode === 'signup' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 font-mono">Nickname</label>
                                            <input
                                                type="text"
                                                value={formData.nickname}
                                                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                                className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 focus:outline-none focus:border-sport-red focus:bg-zinc-900 transition-all font-mono text-sm rounded-sm placeholder:text-zinc-700"
                                                placeholder="Your Nickname"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 font-mono">Favorite Team ID</label>
                                            <input
                                                type="text"
                                                value={formData.teamId}
                                                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                                                className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 focus:outline-none focus:border-sport-red focus:bg-zinc-900 transition-all font-mono text-sm rounded-sm placeholder:text-zinc-700"
                                                placeholder="Team UUID"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {mode === 'login' && (
                                    <div className="flex items-center justify-between text-xs text-zinc-500 font-mono pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-300">
                                            <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-sport-red focus:ring-0" />
                                            REMEMBER ME
                                        </label>
                                        <a href="#" className="hover:text-sport-red transition-colors">FORGOT PASSWORD?</a>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-black font-black font-oswald text-xl italic uppercase py-3 mt-4 hover:bg-sport-red hover:text-white transition-all duration-300 -skew-x-6 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="block skew-x-6 group-hover:scale-110 transition-transform">
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <LoadingSpinner size="sm" text="" />
                                                <span>PROCESSING...</span>
                                            </div>
                                        ) : mode === 'login' ? 'Sign In' : 'Sign Up'}
                                    </span>
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 text-center border-t border-zinc-800 pt-4">
                                <p className="text-zinc-600 text-xs font-mono">
                                    {mode === 'login' ? "DON'T HAVE AN ACCOUNT?" : 'ALREADY HAVE AN ACCOUNT?'}
                                    <button onClick={toggleMode} className="text-white font-bold hover:text-sport-red transition-colors ml-1">
                                        {mode === 'login' ? 'REGISTER NOW' : 'LOGIN'}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
