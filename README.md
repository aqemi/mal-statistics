# MAL Statistics

This project provides tools to analyze your MyAnimeList (MAL) data. It includes scripts to extract and visualize your anime watching history, organized by year and season.

## Features

- `overall.js`: Shows your anime statistics by year, including total count and average score
- `seasonal.js`: Shows your anime watching patterns by season, with percentage of popular shows watched

## Prerequisites

- Node.js (v16 or later recommended)
- A MyAnimeList account
- MyAnimeList API Client ID (get it from [MyAnimeList API](https://myanimelist.net/apiconfig))

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mal-statistics.git
   cd mal-statistics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with your MAL API client ID:
   ```
   MAL_CLIENT_ID=your_client_id_here
   ```

## Usage

### Overall Statistics

Shows your completed anime count by year with average scores:

```bash
npm run overall -- yourusername
```

Or run directly:

```bash
node overall.js yourusername
```

### Seasonal Statistics

Shows your watched anime by season with percentage of popular shows:

```bash
npm run seasonal -- yourusername
```

Or run directly:

```bash
node seasonal.js yourusername
```

## Example Output

### Overall Statistics
```
┌──────┬───────┬───────┬────────────┐
│ Year │ Delta │ Total │ Mean Score │
├──────┼───────┼───────┼────────────┤
│ 2020 │    45 │    45 │       7.82 │
│ 2021 │    58 │   103 │       7.95 │
│ 2022 │    62 │   165 │       8.13 │
│ 2023 │    71 │   236 │       8.05 │
│ 2024 │    52 │   288 │       7.98 │
└──────┴───────┴───────┴────────────┘
```

### Seasonal Statistics
```
┌──────────────┬─────────┬───────┬────┐
│ Season       │ In List │ Total │  % │
├──────────────┼─────────┼───────┼────┤
│ Spring 2023  │      16 │    35 │ 46 │
│ Winter 2022  │      14 │    32 │ 44 │
│ Fall 2021    │      15 │    36 │ 42 │
│ Summer 2023  │      13 │    33 │ 39 │
└──────────────┴─────────┴───────┴────┘
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
