const axios = require('axios');

async function testEspnSeason() {
    const sports = [
        { name: 'NBA', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard', type: 'entry' },
        { name: 'NFL', url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard', type: 'week' }
    ];

    for (const sport of sports) {
        try {
            console.log(`\n--- Testing ${sport.name} Season Fetching ---`);
            
            // 1. Get Calendar
            const baseRes = await axios.get(sport.url, { params: { limit: 1 } });
            const calendar = baseRes.data.leagues?.[0]?.calendar || [];
            console.log(`Found ${calendar.length} calendar years/sections.`);

            if (calendar.length > 0) {
                // Test first entry of the first year
                const yearEntry = calendar[0];
                const entries = yearEntry.entries || yearEntry.weeks || [];
                console.log(`First year "${yearEntry.label}" has ${entries.length} ${sport.type}s.`);

                if (entries.length > 0) {
                    const firstEntry = entries[0];
                    console.log(`Fetching data for: ${firstEntry.label || firstEntry.value}...`);
                    
                    const params = { limit: 50 };
                    if (sport.name === 'NFL') {
                        params.seasontype = yearEntry.value;
                        params.week = firstEntry.value;
                    } else {
                        params.dates = firstEntry.value;
                    }

                    const detailRes = await axios.get(sport.url, { params });
                    const events = detailRes.data.events || [];
                    console.log(`  - Success! Found ${events.length} events for this period.`);
                    if (events.length > 0) {
                        console.log(`  - First Game: ${events[0].name} on ${events[0].date}`);
                    }
                }
            }
        } catch (error) {
            console.error(`  - Failed ${sport.name}: ${error.message}`);
        }
    }
}

testEspnSeason();
