export type Team = {
    id: string;
    name: string;
    logo: string;
    logoUrl?: string | null; // 이미지 URL (선택적)
    mainColor: string; // Hex code for primary brand color
    subColor: string; // Hex code for secondary brand color
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
    id: number;
    teamId: string;
    opponent: string;
    home: boolean;
    date: string; // ISO format: 'YYYY-MM-DD'
    time: string; // 'HH:mm'
    type: 'match' | 'race';
    score: string | null;
};

export const SPORTS_DATA: Team[] = [
    { id: 'fe9c023d-8850-4f01-b8e2-f75ccb5cd4d7', name: 'LG 트윈스', logo: '⚾', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/KBO_LG.svg', mainColor: '#c40037', subColor: '#c40037' },
    { id: 'ecca8e25-2175-46da-be18-926d65ac27d8', name: '두산 베어스', logo: '⚾', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/KBO_OB.svg', mainColor: '#010039', subColor: '#eb1b26' },
    { id: 'c6e63f6e-f580-432c-9563-a981dcbaf456', name: 'KIA 타이거즈', logo: '⚾', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/KBO_HT.svg', mainColor: '#ea0029', subColor: '#05141f' },
    { id: '2f9c74e1-982c-42b0-934c-80f352b4b807', name: '삼성 라이온즈', logo: '⚾', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/KBO_SS.svg', mainColor: '#0365b1', subColor: '#c0c0c2' },
    { id: '7a5766c3-34b5-459b-9feb-2db9910abe9c', name: '롯데 자이언츠', logo: '⚾', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/KBO_LT.svg', mainColor: '#022346', subColor: '#d10f31' },
    { id: 'dbd7b801-b1f2-40b7-a6e8-fd4dfee12dd2', name: 'SSG 랜더스', logo: '⚾', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/KBO_SK.svg', mainColor: '#c2182d', subColor: '#fac108' },
    { id: '0755cfd8-845a-45a5-beee-91d3c0f395c6', name: 'NC 다이노스', logo: '⚾', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/KBO_NC.svg', mainColor: '#1d467d', subColor: '#c7a079' },
    { id: '1350a841-cd0f-48d4-a5ca-fa216ef3508c', name: 'KT 위즈', logo: '⚾', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/KBO_KT.svg', mainColor: '#000000', subColor: '#ec1c24' },
    { id: '14ebd48e-4fc9-4909-a17c-135e26794dfc', name: '키움 히어로즈', logo: '⚾', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/KBO_WO.svg', mainColor: '#820024', subColor: '#e30084' },
    { id: '62f5f64a-64e4-486d-874a-f0f3946e1dac', name: '한화 이글스', logo: '⚾', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/KBO_HH.svg', mainColor: '#fc4e00', subColor: '#07111f' },

    // LCK
    { id: '30d0df89-0cdf-49c2-b7bf-c6df75d3bb9a', name: 'T1', logo: '🎮', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/LCK_T1.svg', mainColor: '#e2012d', subColor: '#e2012d' },
    { id: '1dc08d62-c41e-4776-80c8-17b5d0617368', name: 'Gen.G', logo: '🎮', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/LCK_GEN.svg', mainColor: '#aa8a00', subColor: '#aa8a00' },
    { id: 'dc3ef3c5-2c14-44f0-98d5-011fb56173d1', name: 'Dplus KIA', logo: '🎮', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/LCK_DK.svg', mainColor: '#92e1e6', subColor: '#92e1e6' },
    { id: '39b72430-393c-4dd6-832c-1a794d8c3b47', name: 'Hanwha Life Esports', logo: '🎮', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/LCK_HLE.svg', mainColor: '#f37321', subColor: '#404041' },
    { id: 'fa05d365-1188-4cd5-9b8f-27af5c855316', name: 'BRION', logo: '🎮', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/LCK_BRO.svg', mainColor: '#003a22', subColor: '#003327' },
    { id: '386172b1-74d0-4e87-84c6-1222ed7f7eb5', name: 'Nongshim RedForce', logo: '🎮', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/LCK_NS.svg', mainColor: '#ec1b24', subColor: '#ec1b24' },
    { id: '0f87dcdc-522b-4a8e-a6fb-8ced5f0099ab', name: 'DN SOOPers', logo: '🎮', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/LCK_DNS.svg', mainColor: '#0c50f1', subColor: '#0c50f1' },
    { id: '3f98864c-1af7-4ee1-970c-6e6228926f8d', name: 'DRX', logo: '🎮', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/LCK_DRX.svg', mainColor: '#1102a3', subColor: '#1102a3' },

    // Bundesliga
    { id: '01ab211e-8372-4188-b26d-db0b001ee8fa', name: 'FC Bayern München', logo: '⚽', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/BUN_BAY.svg', mainColor: '#ed0038', subColor: '#ffffff' },
    { id: '56f6fcd3-2a10-4702-85f6-0fa69411ea29', name: 'Borussia Dortmund', logo: '⚽', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/BUN_DOR.svg', mainColor: '#ffd900', subColor: '#ffd900' },
    { id: '8b48ec5f-d39a-4cfa-83f0-9be1d8ae4320', name: 'RB Leipzig', logo: '⚽', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/BUN_RBL.svg', mainColor: '#ca023c', subColor: '#001f47' },
    { id: 'fdd49914-b657-484d-90f0-55b3e18d8639', name: 'Eintracht Frankfurt', logo: '⚽', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/BUN_SGE.svg', mainColor: '#cc0013', subColor: '#cc0013' },
    { id: '8d8e46c8-f9db-4c08-a916-7a159b885ee8', name: 'VfL Wolfsburg', logo: '⚽', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/team-logos/BUN_WOB.svg', mainColor: '#5eb245', subColor: '#FFFFFF' }
];
