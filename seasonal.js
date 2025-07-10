import { AsciiTable3 } from 'ascii-table3';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get username from command line args
const [, , username] = process.argv;

// Check if username is provided
if (!username) {
  console.error('Error: MyAnimeList username is required');
  console.error('Usage: node seasonal.js <username>');
  process.exit(1);
}

const MAL_CLIENT_ID = process.env.MAL_CLIENT_ID;

// Check if API key is provided
if (!MAL_CLIENT_ID) {
  console.error('Error: MAL_CLIENT_ID is not set in .env file');
  console.error('Create a .env file with your MAL_CLIENT_ID. See .env.example for format.');
  process.exit(1);
}

const START_YEAR = 2005;
const END_YEAR = new Date().getFullYear() - 1;
const SEASONS = ['winter', 'spring', 'summer', 'fall'];

const params = {
  nsfw: true,
  limit: 1000,
};

const queryString = new URLSearchParams(params).toString();

const userlistResponse = await fetch(`https://api.myanimelist.net/v2/users/${username}/animelist?${queryString}`, {
  headers: { 'X-MAL-CLIENT-ID': MAL_CLIENT_ID },
});

const userlist = await userlistResponse.json();
const addedIds = userlist.data.map((x) => x.node.id);

const matrix = [];

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

for (let year = START_YEAR; year <= END_YEAR; year += 1) {
  console.log(`Processing year: ${year}`);
  for (const season of SEASONS) {
    const seasonResponse = await fetch(
      `https://api.myanimelist.net/v2/anime/season/${year}/${season}?nsfw=true&limit=500&fields=media_type,start_season,popularity`,
      {
        headers: { 'X-MAL-CLIENT-ID': MAL_CLIENT_ID },
      }
    );

    const response = await seasonResponse.json();

    const tv = response.data.filter((x) => x.node.media_type === 'tv');
    const thisSeason = tv.filter((x) => x.node.start_season.year === year && x.node.start_season.season === season);
    const popular = thisSeason.filter((x) => typeof x.node.popularity === 'number' && x.node.popularity <= 5000);
    const total = popular.length;
    const inList = popular.filter((x) => addedIds.includes(x.node.id)).length;
    const row = [`${capitalize(season)} ${year}`, inList, total, Math.round((inList / total) * 100)];
    matrix.push(row);
  }
}

const sorted = matrix.sort((a, b) => b[3] - a[3]);

const table = new AsciiTable3().setHeading('Season', 'In List', 'Total', '%').setStyle('unicode-round').addRowMatrix(sorted);

console.log(table.toString());
