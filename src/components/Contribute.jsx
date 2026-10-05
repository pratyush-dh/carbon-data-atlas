import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import datasets from '../data/datasets.json'
import { GITHUB_REPO } from '../config.js'

const KINDS = [
  ['missing', 'A dataset is missing', 'dataset-request'],
  ['wrong', 'Something is wrong or out of date', 'data-correction'],
  ['link', 'A link is broken', 'broken-link'],
  ['collab', 'I want to collaborate', 'collaboration'],
  ['other', 'Something else', 'feedback']
]

export default function Contribute() {
  const [params] = useSearchParams()
  const [kind, setKind] = useState(params.get('kind') || 'wrong')
  const [dataset, setDataset] = useState(params.get('dataset') || '')
  const [details, setDetails] = useState('')
  const [source, setSource] = useState('')

  const submit = e => {
    e.preventDefault()
    const [, label, tag] = KINDS.find(k => k[0] === kind)
    const ds = datasets.find(d => d.id === dataset)
    const title = `${label}${ds ? `: ${ds.shortName}` : ''}`
    const body = [
      `**Type:** ${label}`,
      ds ? `**Dataset:** ${ds.name} (\`${ds.id}\`)` : '',
      '',
      '**Details**',
      details,
      source ? `\n**Source / link:** ${source}` : '',
      '\n_Submitted from the Carbon Data Atlas feedback form._'
    ].filter(l => l !== '').join('\n')
    const url = `https://github.com/${GITHUB_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=${encodeURIComponent(tag)}`
    window.open(url, '_blank', 'noopener')
  }

  return (
    <>
      <h1>Help improve the atlas</h1>
      <p className="lead">
        Metadata here is compiled from provider documentation and can be incomplete or out of date. Tell us what is missing or wrong,
        or get in touch if you would like to collaborate.
      </p>
      <form className="form" onSubmit={submit}>
        <label>What would you like to tell us?
          <select value={kind} onChange={e => setKind(e.target.value)}>
            {KINDS.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </label>
        <label>Which dataset? (optional)
          <select value={dataset} onChange={e => setDataset(e.target.value)}>
            <option value="">Not about a specific dataset</option>
            {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
        <label>Details
          <textarea required rows="6" value={details} onChange={e => setDetails(e.target.value)}
            placeholder="What should be added or corrected? Include the correct value if you know it." />
        </label>
        <label>Source or link (optional)
          <input type="url" value={source} onChange={e => setSource(e.target.value)} placeholder="https://…" />
        </label>
        <button className="btn primary big" type="submit">Continue on GitHub →</button>
        <p className="note">
          This opens a new GitHub issue with your comment pre-filled. You will need a free GitHub account to post it.
          Comments are public.
        </p>
      </form>
    </>
  )
}
