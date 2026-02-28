import { CalendarEvent } from './sportsData';

const TEAM_IDS = {
    LG: 'fe9c023d-8850-4f01-b8e2-f75ccb5cd4d7',
    DOO: 'ecca8e25-2175-46da-be18-926d65ac27d8',
    LOT: '7a5766c3-34b5-459b-9feb-2db9910abe9c',
    T1: '30d0df89-0cdf-49c2-b7bf-c6df75d3bb9a',
    BAY: '01ab211e-8372-4188-b26d-db0b001ee8fa',
    KIA: 'c6e63f6e-f580-432c-9563-a981dcbaf456',
    SSG: 'dbd7b801-b1f2-40b7-a6e8-fd4dfee12dd2',
    NC: '0755cfd8-845a-45a5-beee-91d3c0f395c6',
    KT: '1350a841-cd0f-48d4-a5ca-fa216ef3508c',
    KIW: '14ebd48e-4fc9-4909-a17c-135e26794dfc',
    SAM: '2f9c74e1-982c-42b0-934c-80f352b4b807',
    HAN: '62f5f64a-64e4-486d-874a-f0f3946e1dac',
    GEN: '1dc08d62-c41e-4776-80c8-17b5d0617368',
    DK: 'dc3ef3c5-2c14-44f0-98d5-011fb56173d1',
    HLE: '39b72430-393c-4dd6-832c-1a794d8c3b47',
    DOR: '56f6fcd3-2a10-4702-85f6-0fa69411ea29',
    LEV: 'c955339b-4ff7-466d-a3df-f29358c052c4',
    RBL: '8b48ec5f-d39a-4cfa-83f0-9be1d8ae4320',
    SGE: 'fdd49914-b657-484d-90f0-55b3e18d8639',
    WOB: '8d8e46c8-f9db-4c08-a916-7a159b885ee8',
    BRO: 'fa05d365-1188-4cd5-9b8f-27af5c855316',
    NS: '386172b1-74d0-4e87-84c6-1222ed7f7eb5',
    DNS: '0f87dcdc-522b-4a8e-a6fb-8ced5f0099ab',
    DRX: '3f98864c-1af7-4ee1-970c-6e6228926f8d'
};

export const ALL_EVENTS: CalendarEvent[] = [
    // --- 3월 ---
    { id: 1001, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.KT, home: true, date: '2026-03-22', time: '14:00', type: 'match', score: null },
    { id: 1002, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.KT, home: true, date: '2026-03-23', time: '14:00', type: 'match', score: null },
    { id: 1003, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.SSG, home: false, date: '2026-03-25', time: '18:30', type: 'match', score: null },
    { id: 1004, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.SSG, home: false, date: '2026-03-26', time: '18:30', type: 'match', score: null },
    { id: 1005, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.DOO, home: true, date: '2026-03-28', time: '17:00', type: 'match', score: null },
    { id: 1006, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.DOO, home: true, date: '2026-03-29', time: '14:00', type: 'match', score: null },
    { id: 1007, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.LOT, home: false, date: '2026-03-31', time: '18:30', type: 'match', score: null },

    { id: 2001, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.NC, home: false, date: '2026-03-22', time: '14:00', type: 'match', score: null },
    { id: 2003, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.KIA, home: true, date: '2026-03-25', time: '18:30', type: 'match', score: null },
    { id: 2007, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.SAM, home: true, date: '2026-03-31', time: '18:30', type: 'match', score: null },

    { id: 3001, teamId: TEAM_IDS.KIA, opponent: TEAM_IDS.SAM, home: true, date: '2026-03-22', time: '14:00', type: 'match', score: null },
    { id: 3003, teamId: TEAM_IDS.KIA, opponent: TEAM_IDS.LOT, home: true, date: '2026-03-28', time: '17:00', type: 'match', score: null },
    { id: 3004, teamId: TEAM_IDS.KIA, opponent: TEAM_IDS.NC, home: false, date: '2026-03-31', time: '18:30', type: 'match', score: null },

    { id: 4001, teamId: TEAM_IDS.T1, opponent: TEAM_IDS.GEN, home: true, date: '2026-03-21', time: '17:00', type: 'match', score: null },
    { id: 4002, teamId: TEAM_IDS.T1, opponent: TEAM_IDS.DK, home: false, date: '2026-03-24', time: '20:00', type: 'match', score: null },
    { id: 4003, teamId: TEAM_IDS.T1, opponent: TEAM_IDS.KT, home: true, date: '2026-03-27', time: '17:00', type: 'match', score: null },
    { id: 4004, teamId: TEAM_IDS.T1, opponent: TEAM_IDS.HLE, home: false, date: '2026-03-30', time: '19:00', type: 'match', score: null },

    // --- 4월 ---
    { id: 1101, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.KIA, home: true, date: '2026-04-01', time: '18:30', type: 'match', score: null },
    { id: 1103, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.LOT, home: false, date: '2026-04-04', time: '17:00', type: 'match', score: null },
    { id: 1105, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.SAM, home: true, date: '2026-04-07', time: '18:30', type: 'match', score: null },
    { id: 1107, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.HAN, home: false, date: '2026-04-10', time: '18:30', type: 'match', score: null },
    { id: 1109, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.NC, home: true, date: '2026-04-14', time: '18:30', type: 'match', score: null },
    { id: 1111, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.KT, home: false, date: '2026-04-17', time: '18:30', type: 'match', score: null },
    { id: 1113, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.SSG, home: true, date: '2026-04-21', time: '18:30', type: 'match', score: null },
    { id: 1114, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.DOO, home: false, date: '2026-04-24', time: '18:30', type: 'match', score: null },

    { id: 2101, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.SSG, home: true, date: '2026-04-01', time: '18:30', type: 'match', score: null },
    { id: 2103, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.KT, home: false, date: '2026-04-04', time: '17:00', type: 'match', score: null },
    { id: 2105, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.NC, home: true, date: '2026-04-07', time: '18:30', type: 'match', score: null },
    { id: 2107, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.KIA, home: false, date: '2026-04-10', time: '18:30', type: 'match', score: null },
    { id: 2109, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.SAM, home: true, date: '2026-04-14', time: '18:30', type: 'match', score: null },
    { id: 2110, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.HAN, home: true, date: '2026-04-17', time: '18:30', type: 'match', score: null },
    { id: 2111, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.LOT, home: false, date: '2026-04-21', time: '18:30', type: 'match', score: null },

    { id: 4101, teamId: TEAM_IDS.T1, opponent: TEAM_IDS.BRO, home: true, date: '2026-04-03', time: '17:00', type: 'match', score: null },
    { id: 4102, teamId: TEAM_IDS.T1, opponent: TEAM_IDS.NS, home: false, date: '2026-04-08', time: '20:00', type: 'match', score: null },
    { id: 4103, teamId: TEAM_IDS.T1, opponent: TEAM_IDS.DNS, home: true, date: '2026-04-12', time: '17:00', type: 'match', score: null },
    { id: 4104, teamId: TEAM_IDS.T1, opponent: TEAM_IDS.DRX, home: false, date: '2026-04-16', time: '19:00', type: 'match', score: null },

    { id: 5101, teamId: TEAM_IDS.BAY, opponent: TEAM_IDS.DOR, home: true, date: '2026-04-05', time: '01:30', type: 'match', score: null },
    { id: 5102, teamId: TEAM_IDS.BAY, opponent: TEAM_IDS.RBL, home: false, date: '2026-04-12', time: '23:30', type: 'match', score: null },
    { id: 5103, teamId: TEAM_IDS.BAY, opponent: TEAM_IDS.SGE, home: true, date: '2026-04-19', time: '22:30', type: 'match', score: null },
    { id: 5104, teamId: TEAM_IDS.BAY, opponent: TEAM_IDS.WOB, home: false, date: '2026-04-26', time: '22:30', type: 'match', score: null },

    // --- 5월 ---
    { id: 1201, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.DOO, home: true, date: '2026-05-05', time: '14:00', type: 'match', score: null },
    { id: 1203, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.KT, home: false, date: '2026-05-08', time: '18:30', type: 'match', score: null },
    { id: 1205, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.SSG, home: true, date: '2026-05-12', time: '18:30', type: 'match', score: null },
    { id: 1206, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.KIW, home: true, date: '2026-05-15', time: '18:30', type: 'match', score: null },
    { id: 1207, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.NC, home: false, date: '2026-05-19', time: '18:30', type: 'match', score: null },
    { id: 1208, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.KIA, home: true, date: '2026-05-22', time: '18:30', type: 'match', score: null },

    { id: 2203, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.LOT, home: true, date: '2026-05-08', time: '18:30', type: 'match', score: null },
    { id: 2205, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.KIA, home: false, date: '2026-05-12', time: '18:30', type: 'match', score: null },
    { id: 2206, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.SAM, home: true, date: '2026-05-15', time: '18:30', type: 'match', score: null },
    { id: 2207, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.KT, home: true, date: '2026-05-19', time: '18:30', type: 'match', score: null },

    // --- 6월 ---
    { id: 1301, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.LOT, home: true, date: '2026-06-02', time: '18:30', type: 'match', score: null },
    { id: 1303, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.SAM, home: false, date: '2026-06-05', time: '18:30', type: 'match', score: null },
    { id: 1305, teamId: TEAM_IDS.LG, opponent: TEAM_IDS.NC, home: true, date: '2026-06-09', time: '18:30', type: 'match', score: null },

    { id: 2301, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.KIA, home: true, date: '2026-06-02', time: '18:30', type: 'match', score: null },
    { id: 2303, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.SSG, home: false, date: '2026-06-05', time: '18:30', type: 'match', score: null },
    { id: 2305, teamId: TEAM_IDS.DOO, opponent: TEAM_IDS.LOT, home: true, date: '2026-06-09', time: '18:30', type: 'match', score: null },
];
