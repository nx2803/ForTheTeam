'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    const { themeColors } = useTheme();
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
                            className="bg-[#0a0a0a] border-2 border-zinc-800 w-full max-w-2xl p-8 relative shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
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
                                        국내외 스포츠 일정 제공
                                    </h2>
                                    <p className="leading-relaxed text-sm">
                                        유럽 4대 축구 리그(EPL, 라리가, 분데스리가, 세리에 A)와 LCK(e스포츠), NBA, MLB, NHL, KBO 등 다양한 종목의 경기 일정을 한곳에서 제공합니다. 상단의 월 표시 옆 화살표를 눌러 월별 경기 일정을 이동해보세요.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-white font-bold text-lg uppercase mb-3 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-sport-red block"></span>
                                        실시간 스코어 동기화
                                    </h2>
                                    <p className="leading-relaxed text-sm">
                                        경기가 진행 중(`ongoing`)이거나 끝났을 때 웹소켓을 통해 스코어와 경기 상태가 실시간으로 자동 업데이트됩니다. 화면 새로고침 없이 가장 빠르고 정확한 스코어보드를 체감할 수 있습니다.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-white font-bold text-lg uppercase mb-3 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-sport-red block"></span>
                                        지능형 팀 테마 엔진
                                    </h2>
                                    <p className="leading-relaxed text-sm">
                                        팔로우한 팀 로고를 클릭하여 메인 팀으로 지정하면 사이트 전체가 해당 팀의 고유 컬러 브랜드 테마로 동적 변경됩니다. 특히 가독성 보정을 위한 대비 색상 알고리즘이 내장되어 어떠한 색상 조합에서도 텍스트가 명확하게 식별됩니다.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-white font-bold text-lg uppercase mb-3 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-sport-red block"></span>
                                        팀 설정 및 클라우드 동기화
                                    </h2>
                                    <p className="leading-relaxed text-sm">
                                        하단의 <span className="text-white font-bold mx-1">'CUSTOMIZE TEAM'</span> 버튼을 통해 응원 팀을 선택할 수 있으며, <span className="text-white font-bold mx-1">'SORT'</span>를 눌러 순서를 바꿀 수 있습니다. 회원가입 시 선택된 팀 목록이 클라우드 계정에 연동되어 보존됩니다.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-white font-bold text-lg uppercase mb-3 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-sport-red block"></span>
                                        3가지 하이브리드 뷰 모드
                                    </h2>
                                    <p className="leading-relaxed text-sm">
                                        직관적인 월별 <span className="text-white font-bold mx-1">달력(Calendar)</span> 뷰, 직근 경기와 잔여 일정을 모아보는 <span className="text-white font-bold mx-1">D-Day</span> 뷰, 그리고 현재 시즌 상황을 빠르게 점검할 수 있는 <span className="text-white font-bold mx-1">순위표(Rank)</span> 뷰를 자유롭게 넘나들 수 있습니다.
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
                                className="w-full font-black font-oswald text-xl uppercase py-3 mt-8 transition-all duration-300 relative group overflow-hidden active:scale-95 border"
                                style={{
                                    backgroundColor: themeColors.primary,
                                    color: themeColors.primaryText,
                                    borderColor: themeColors.secondary + '40'
                                }}
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                <span className="relative">GOT IT</span>
                            </button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
