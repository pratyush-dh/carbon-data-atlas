export const GASES = [
  { key: 'CO2', symbol: 'CO₂', name: 'Carbon dioxide', blurb: 'The main driver of climate change. Fossil fuels, land use and natural sinks.' },
  { key: 'CH4', symbol: 'CH₄', name: 'Methane', blurb: 'A potent short-lived greenhouse gas from energy, agriculture, landfills and wetlands.' },
  { key: 'N2O', symbol: 'N₂O', name: 'Nitrous oxide', blurb: 'Mostly from fertilizer use and soils. Fewer datasets so far.' }
]

export const TYPES = [
  { key: 'Satellite', blurb: 'Measured from space' },
  { key: 'Model', blurb: 'Simulated or assimilated fields' },
  { key: 'Inventory', blurb: 'Bottom-up emission estimates' },
  { key: 'Ground-based', blurb: 'Fixed observing stations' },
  { key: 'In situ', blurb: 'Direct samples from air, sea and towers' }
]

export const typeClass = t => t.toLowerCase().replace(' ', '-')
