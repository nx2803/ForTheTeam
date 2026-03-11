const axios = require('axios');

async function testEspn() {
    const sports = [
        { name: 'NBA', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' },
        { name: 'MLB', url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard' },
        { name: 'NHL', url: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard' },
        { name: 'NFL', url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard' }
    ];

    for (const sport of sports) {
        try {
            console.log(`Testing ${sport.name}...`);
            const response = await axios.get(sport.url, { params: { limit: 5 } });
            console.log(`  - Success! Found ${response.data.events?.length || 0} events.`);
        } catch (error) {
            console.error(`  - Failed ${sport.name}: ${error.message}`);
        }
    }
}

testEspn();
