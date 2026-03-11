// src/app/page.tsx
'use client';

import { useEffect, Suspense, useTransition } from 'react';
import { motion } from 'framer-motion';
import Header from "@/components/layout/Header";
import MainCalendar from "@/components/calendar/MainCalendar";
import TeamSelector from "@/components/team/TeamSelector";
import Ticker from "@/components/layout/Ticker";

import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { useTeamStore } from '@/store/teamStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { user } = useAuth();
  const { fetchFollowedTeams } = useTeamStore();
  const [isPending, startTransition] = useTransition();
  useSocket(); // 실시간 소켓 연결 활성

  // 초기 로드: 스토어를 통해 팔로우 팀 목록 가져오기
  useEffect(() => {
    if (user?.uid) {
      fetchFollowedTeams(user.uid);
    }
  }, [user?.uid, fetchFollowedTeams]);

  return (
    <main className="flex h-screen w-full flex-col relative overflow-hidden bg-[#0a0a0a]">
      {/* 0. Top Ticker */}
      <Ticker />

      {/* 1. Background Typography (THE 'REAL' FTT GRID) */}
      <div className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden opacity-[0.25]">
        <div
          className="absolute w-[200vw] h-[200vh] top-[-50vh] left-[-50vw] flex flex-col justify-center"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex whitespace-nowrap"
              animate={{ x: i % 2 === 0 ? [0, -1500] : [-1500, 0] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 40 + (i % 3) * 10,
              }}
            >
              {Array.from({ length: 12 }).map((_, j) => (
                <h1
                  key={j}
                  className="text-[14rem] font-black italic uppercase tracking-tighter leading-[0.85] px-12 text-transparent"
                  style={{
                    WebkitTextStroke: '4px var(--color-primary)',
                    opacity: 1
                  }}
                >
                  FORTHETEAM
                </h1>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

       {/* 2. Floating Header */}
      <Header isPending={isPending} startTransition={startTransition} />

      {/* 3. Main Content Area */}
      <div className="flex-1 w-full min-h-0 mx-auto p-2 md:p-6 pt-20 md:pt-24 pb-16 md:pb-6 relative z-10 flex flex-col justify-stretch">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center bg-black">
            <LoadingSpinner size="xl" text="LOADING SPORTS DATA..." />
          </div>
        }>
          <div className="flex-1 min-h-0 shadow-2xl overflow-hidden flex flex-col">
            <MainCalendar isPending={isPending} startTransition={startTransition} />
          </div>
        </Suspense>
      </div>

      {/* 4. Team Selector (Bottom Dock) */}
      <TeamSelector />
    </main>
  );
}