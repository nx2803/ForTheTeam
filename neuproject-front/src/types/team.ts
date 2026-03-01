export type Team = {
    id: string;
    name: string;
    logo: string;
    logoUrl?: string | null;
    mainColor: string;
    subColor: string;
    leagueId: string;
    sport?: string;
    abbreviation?: string;
};

export type League = {
    id: string;
    name: string;
    teams: Team[];
};

export type Sport = {
    id: string;
    name: string;
    icon: string;
    leagues: League[];
};

export type CalendarEvent = {
    id: string;
    teamId: string;
    opponent: string;
    home: boolean;
    date: string; // ISO format: 'YYYY-MM-DD'
    time: string; // 'HH:mm'
    type: 'match' | 'race';
    score: string | null;
    homeTeam?: any;
    awayTeam?: any;
    league?: any;
    homeTeamName?: string;
    awayTeamName?: string;
    homeTeamAbbr?: string;
    awayTeamAbbr?: string;
    venue?: string;
};
