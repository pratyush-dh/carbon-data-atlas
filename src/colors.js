import datasets from './data/datasets.json'

const PALETTE = [
  '#0072B2', '#D55E00', '#009E73', '#CC79A7', '#E69F00', '#56B4E9', '#6a3d9a', '#b15928',
  '#e31a1c', '#1f9ea8', '#7b8f00', '#a6761d', '#e7298a', '#33a02c', '#ff7f00', '#5a6b7b'
]

export const colorOf = id => PALETTE[Math.max(0, datasets.findIndex(d => d.id === id)) % PALETTE.length]
