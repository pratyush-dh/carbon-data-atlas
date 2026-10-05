# Carbon Data Atlas

A plain-language catalog of satellite, model, inventory and ground-based datasets that measure or estimate atmospheric carbon dioxide (CO₂), methane (CH₄) and nitrous oxide (N₂O). For each dataset it shows what it measures, where and when it has data, strengths and limits, how to access it, and how to cite it, so you can decide whether to use one dataset, another, or several together.

**Live site:** https://pratyush-dh.github.io/carbon-data-atlas/

## What you can do

- **Explore:** pick a gas, then a data type, then an optional area of interest. Each step narrows the catalog.
- **Coverage:** overlay datasets on a world map and compare them in time and by latitude range.
- **Guide:** match a goal (for example "find large methane emitters") to datasets that work well together.
- **Compare and export:** select datasets, compare them side by side, and export metadata (CSV/JSON), official download links, citations, or a starter Python script.

## Data

Metadata is compiled by hand from each provider's documentation and lives in plain JSON:

| File | Contents |
| --- | --- |
| `src/data/datasets.json` | Dataset metadata, official data and documentation links, DOIs, citations |
| `src/data/coverage.json` | Approximate spatial footprints and record dates used by the maps and timelines |
| `src/data/guide.json` | Goal-based dataset recommendations |

Footprints are approximate (latitude bands, boxes, representative station locations). Always check the provider before relying on a version, date or URL.

## Help keep it accurate

Missing a dataset, or spotted something wrong? Use the **Suggest a fix or collaborate** form on the site, which opens a pre-filled issue in this repo, or open an issue directly.

## Develop

```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/
```

Built with React, Vite and d3-geo. Deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Credits

Inspired by the [Global Carbon Atlas](https://globalcarbonatlas.org/).
