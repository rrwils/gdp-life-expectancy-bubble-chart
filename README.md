# GDP vs Life Expectancy Bubble Chart

This project is a React + Vite learning example that visualizes country data with a bubble chart using D3.

## What it shows

- GDP per capita on the x-axis
- Life expectancy on the y-axis
- Bubble size representing population
- Bubble color representing continent
- Interactive tooltip with country, life expectancy, GDP, and population
- Hover highlight that brightens the selected bubble and fades the rest
- Size legend showing representative population values

## Built with

- React
- Vite
- D3.js

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL in your browser and explore the chart.

## Project structure

- `src/App.jsx` — main React app container
- `src/BubblePlot.jsx` — bubble chart rendering and interactions
- `src/AxisBottom.jsx` — custom x-axis rendering
- `src/AxisLeft.jsx` — custom y-axis rendering
- `src/data.js` — dataset used for plotting

## Purpose

This repository is intended as a hands-on exercise in combining React with D3 to build a fully interactive data visualization. The focus is on chart layout, scales, legends, and user interactions rather than a production-ready analytics dashboard.
# gdp-life-expectancy-bubble-chart
