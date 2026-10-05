const FIELDS = [
  ['id', 'ID'], ['name', 'Name'], ['type', 'Type'], ['gases', 'Gases'], ['variables', 'Variables'],
  ['spatial', 'Spatial resolution'], ['temporal', 'Temporal resolution'], ['coverage', 'Coverage'],
  ['start', 'Start'], ['end', 'End'], ['latency', 'Latency'], ['format', 'Format'],
  ['provider', 'Provider'], ['version', 'Version'], ['access', 'Access'],
  ['downloadUrl', 'Download URL'], ['docsUrl', 'Docs URL'], ['citation', 'Citation']
]

const cell = v => {
  const s = Array.isArray(v) ? v.join('; ') : (v ?? '')
  return `"${String(s).replace(/"/g, '""')}"`
}

export const toCsv = list =>
  [FIELDS.map(f => cell(f[1])).join(','), ...list.map(d => FIELDS.map(f => cell(d[f[0]])).join(','))].join('\n')

export const toJson = list => JSON.stringify(list, null, 2)

export const toLinks = list =>
  list.map(d => `# ${d.name} (${d.access})\n${d.downloadUrl}\n`).join('\n')

export const toCitations = list => list.map(d => `- ${d.citation}`).join('\n')

// Starter script: opens each portal and prints access requirements.
// Bulk download needs each provider's own login, so this stays a helper, not a downloader.
export const toPython = list => `"""Carbon Data Atlas - starter script.
Opens each selected dataset's official download portal and prints what you need to log in."""
import webbrowser

DATASETS = [
${list.map(d => `    {"name": ${JSON.stringify(d.name)}, "url": ${JSON.stringify(d.downloadUrl)}, "access": ${JSON.stringify(d.access)}},`).join('\n')}
]

for d in DATASETS:
    print(f"{d['name']}\\n  access: {d['access']}\\n  {d['url']}\\n")
    webbrowser.open(d["url"])
`

export function download(filename, text, mime = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type: mime }))
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click()
  URL.revokeObjectURL(url)
}
