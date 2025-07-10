import { AsciiTable3 } from 'ascii-table3';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get username from command line args
const [, , username] = process.argv;

// Check if username is provided
if (!username) {
  console.error('Error: MyAnimeList username is required');
  console.error('Usage: node overall.js <username>');
  process.exit(1);
}

const MAL_CLIENT_ID = process.env.MAL_CLIENT_ID;

// Check if API key is provided
if (!MAL_CLIENT_ID) {
  console.error('Error: MAL_CLIENT_ID is not set in .env file');
  console.error('Create a .env file with your MAL_CLIENT_ID. See .env.example for format.');
  process.exit(1);
}

const params = {
  nsfw: true,
  status: 'completed',
  limit: 1000,
  fields: 'list_status',
};

const queryString = new URLSearchParams(params).toString();

const response = await fetch(`https://api.myanimelist.net/v2/users/${username}/animelist?${queryString}`, {
  headers: { 'X-MAL-CLIENT-ID': MAL_CLIENT_ID },
});

const data = await response.json();

const round = (n, dp) => {
  const h = +'1'.padEnd(dp + 1, '0'); // 10 or 100 or 1000 or etc
  return Math.round(n * h) / h;
};

const grouped = data.data
  .map((x) => ({ id: x.node.id, year: new Date(x.list_status.finish_date).getFullYear(), score: x.list_status.score }))
  .reduce((acc, title) => {
    const { year, score } = title;
    const item = { score };
    const itemsPerYear = acc[year];
    return { ...acc, [year]: itemsPerYear ? [...itemsPerYear, item] : [item] };
  }, {});

const matrix = Object.entries(grouped).reduce((acc, [year, titles], index) => {
  const delta = titles.length;
  const meanScore = round(titles.reduce((acc, title) => acc + title.score, 0) / delta, 2);
  const [, , prevTotal = 0] = acc[index - 1] ?? [];
  const total = prevTotal + delta;
  const row = [year, delta, total, meanScore];
  return [...acc, row];
}, []);

const table = new AsciiTable3().setHeading('Year', 'Delta', 'Total', 'Mean Score').setStyle('unicode-round').addRowMatrix(matrix);

console.log(table.toString());
