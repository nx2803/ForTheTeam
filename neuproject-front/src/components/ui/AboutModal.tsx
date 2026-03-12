'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
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
                            className="bg-[#0a0a0a] border-2 border-zinc-800 w-full max-w-2xl p-8 relative shadow-[0_0_40px_rgba(255,255,255,0.05)] rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
                        >
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
                                <h1 className="text-4xl md:text-5xl font-black font-oswald text-white uppercase tracking-tighter mb-2 italic">
                                    FOR THE <span className="text-sport-red">TEAM</span>
                                </h1>
                                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                                    사이트 사용법 가이드
                                </p>
                            </div>

                            {/* Content */}
                            <div className="space-y-8 text-zinc-300 font-sans">
                                <section>
                                    <h2 className="text-white font-bold text-lg uppercase mb-3 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-sport-red block"></span>
                                        경기 일정 확인
                                    </h2>
                                    <p className="leading-relaxed text-sm">
                                        NBA, NHL, MLB, KBO 등 다양한 스포츠 리그의 경기 일정을 실시간으로 확인할 수 있습니다.
                                        상단의 큰 월(Month) 표시 옆의 화살표를 클릭하여 다른 달의 일정을 찾아보세요.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-white font-bold text-lg uppercase mb-3 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-sport-red block"></span>
                                        팀 커스터마이징
                                    </h2>
                                    <p className="leading-relaxed text-sm">
                                        페이지 하단의 <span className="text-white font-bold mx-1">'CUSTOMIZE TEAM'</span> 버튼을 클릭하여 관심 있는 리그와 팀을 선택하고 나만의 대시보드를 구성할 수 있습니다.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-white font-bold text-lg uppercase mb-3 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-sport-red block"></span>
                                        메인 팀 설정 및 필터링
                                    </h2>
                                    <p className="leading-relaxed text-sm">
                                        상단 중앙의 팀 로고들을 클릭하여 특정 팀의 경기만 필터링하여 볼 수 있습니다.
                                        <span className="text-white font-bold mx-1">'SORT'</span> 버튼을 눌러 팔로우한 팀들의 순서를 변경하거나 편집할 수 있습니다.
                                        필터를 해제하려면 로고 왼쪽의 <span className="text-white font-bold mx-1">'ALL'</span> 버튼을 클릭하세요.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-white font-bold text-lg uppercase mb-3 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-sport-red block"></span>
                                        뷰 모드 전환
                                    </h2>
                                    <p className="leading-relaxed text-sm">
                                        좌측 상단의 전환 스위치를 사용하여 <span className="text-white font-bold mx-1">달력</span> 뷰와 <span className="text-white font-bold mx-1">D-Day</span> 뷰 사이를 자유롭게 전환할 수 있습니다.
                                    </p>
                                </section>

                                <section className="pt-4 border-t border-zinc-800">
                                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest text-center">
                                        © 2026 FOR THE TEAM - ALL SPORTS IN ONE PLACE
                                    </p>
                                </section>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full bg-white text-black font-black font-oswald text-xl uppercase py-3 mt-8 hover:bg-sport-red hover:text-white transition-all duration-300"
                            >
                                GOT IT
                            </button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
