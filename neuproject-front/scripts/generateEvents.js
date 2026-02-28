const teams = {
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
    HAN: '62f5f64a-64e4-486d-874a-f0f3946e1dac'
};

const events = [];
let idCounter = 1000;

function addEvent(teamKey, opponent, date, time, type = 'match') {
    events.push({
        id: idCounter++,
        teamId: teams[teamKey],
        opponent: opponent,
        home: Math.random() > 0.5,
        date: date,
        time: time,
        type: type,
        score: null
    });
}

// Generate KBO (Every day except Monday from March 22)
const months = [3, 4, 5, 6];
const kboTeams = ['LG', 'DOO', 'LOT', 'KIA', 'SSG', 'NC', 'KT', 'KIW', 'SAM', 'HAN'];

months.forEach(month => {
    for (let day = 1; day <= 30; day++) {
        if (month === 3 && day < 22) continue; // Start Mar 22

        const dateStr = `2026-0${month}-${day < 10 ? '0' + day : day}`;
        const dateObj = new Date(dateStr);
        if (dateObj.getDay() === 1) continue; // Monday is off

        // Pick some teams to play
        kboTeams.forEach(team => {
            if (Math.random() > 0.4) {
                const opp = kboTeams.filter(t => t !== team)[Math.floor(Math.random() * 9)];
                addEvent(team, opp, dateStr, '18:30');
            }
        });
    }
});

// T1 (Esports) - Selective days
for (let day = 1; day <= 30; day += 3) {
    addEvent('T1', 'DK', `2026-03-${day < 10 ? '0' + day : day}`, '17:00');
    addEvent('T1', 'GEN', `2026-04-${day < 10 ? '0' + day : day}`, '20:00');
}

// Bayern (Soccer) - Weekends
for (let day = 7; day <= 28; day += 7) {
    addEvent('BAY', 'DOR', `2026-03-${day < 10 ? '0' + day : day}`, '23:30');
    addEvent('BAY', 'LEV', `2026-04-${day < 10 ? '0' + day : day}`, '01:00');
}

console.log(JSON.stringify(events, null, 2));
