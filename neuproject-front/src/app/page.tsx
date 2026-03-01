// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from "@/components/layout/Header";
import MainCalendar from "@/components/calendar/MainCalendar";
import TeamSelector from "@/components/team/TeamSelector";
import Ticker from "@/components/layout/Ticker";
import { Team } from '@/types/team';
import { useAuth } from '@/hooks/useAuth';
import { getFollowedTeams, toggleTeamFollow } from '@/lib/teamsApi';

export default function Home() {
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const { user, isLoggedIn } = useAuth();

  // 초기 로드: DB에서 팔로우한 팀 목록 가져오기
  useEffect(() => {
    if (isLoggedIn && user?.uid) {
      const fetchFollows = async () => {
        try {
          const followedTeams = await getFollowedTeams(user.uid);
          const formattedTeams: Team[] = followedTeams.map(t => ({
            id: t.id,
            name: t.name,
            logo: '',
            logoUrl: t.logo_url || undefined,
            mainColor: t.primary_color || '#ff4655',
            subColor: t.secondary_color || '#000000',
            leagueId: t.league_id,
            sport: (t.leagues as any)?.category || 'Sports'
          }));

          // 사용자 지정 순서 복원
          const savedOrder = localStorage.getItem(`teamOrder_${user.uid}`);
          if (savedOrder) {
            try {
              const orderArr: string[] = JSON.parse(savedOrder);
              formattedTeams.sort((a, b) => {
                const idxA = orderArr.indexOf(a.id);
                const idxB = orderArr.indexOf(b.id);
                if (idxA === -1 && idxB === -1) return 0;
                if (idxA === -1) return 1;
                if (idxB === -1) return -1;
                return idxA - idxB;
              });
            } catch (e) {
              console.error("Failed to parse saved order", e);
            }
          }
          setMyTeams(formattedTeams);
        } catch (error) {
          console.error('Failed to fetch followed teams:', error);
        }
      };
      fetchFollows();
    }
  }, [isLoggedIn, user?.uid]);

  const handleReorder = (newTeams: Team[]) => {
    setMyTeams(newTeams);
    if (user?.uid) {
      localStorage.setItem(`teamOrder_${user.uid}`, JSON.stringify(newTeams.map(t => t.id)));
    }
  };

  const toggleTeam = async (team: Team) => {
    // 1. 낙관적 업데이트 (UI 즉시 반영) // Drag and drop compatibility
    const isCurrentlyFollowed = myTeams.find(t => t.id === team.id);
    let newTeams: Team[];
    if (isCurrentlyFollowed) {
      newTeams = myTeams.filter(t => t.id !== team.id);
    } else {
      newTeams = [...myTeams, team];
    }
    setMyTeams(newTeams);
    if (user?.uid) {
      localStorage.setItem(`teamOrder_${user.uid}`, JSON.stringify(newTeams.map(t => t.id)));
    }

    // 2. DB 동기화 (로그인된 경우)
    if (isLoggedIn && user?.uid) {
      try {
        await toggleTeamFollow(team.id, user.uid);
      } catch (error) {
        console.error('Failed to toggle team follow in DB:', error);
        if (isCurrentlyFollowed) {
          setMyTeams(prev => [...prev, team]);
        } else {
          setMyTeams(prev => prev.filter(t => t.id !== team.id));
        }
      }
    }
  };

  return (
    <main className="flex h-screen w-full flex-col relative overflow-hidden bg-[#0a0a0a]">
      {/* 0. Top Ticker */}
      <Ticker myTeams={myTeams} />

      {/* 1. Background Typography (THE 'REAL' FTT GRID) */}
      <div className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden opacity-[0.35]">
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
      <Header myTeams={myTeams} />

      {/* 3. Main Content Area */}
      <div className="flex-1 w-full mx-auto p-4 md:p-6 pt-20 md:pt-24 pb-2 relative z-10 flex gap-6 max-h-[calc(100vh-1rem)]">
        {/* Calendar acts as the suspend main card */}
        <div className="flex-1 h-full shadow-2xl">
          <MainCalendar myTeams={myTeams} setMyTeams={handleReorder} />
        </div>
      </div>

      {/* 4. Team Selector (Bottom Dock) */}
      <TeamSelector myTeams={myTeams} toggleTeam={toggleTeam} />
    </main>
  );
}