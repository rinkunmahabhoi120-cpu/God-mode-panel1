'use client'

import { useState } from 'react'

const PLATFORMS = ['youtube', 'twitter', 'facebook', 'linkedin'] as const
type Platform = (typeof PLATFORMS)[number]

interface Result {
  status?: string
  message?: string
  topic?: string
  job_id?: string
  [key: string]: unknown
}

export default function Form() {
  const [topic, setTopic] = useState('')
  const [platforms, setPlatforms] = useState<Platform[]>(['youtube', 'twitter'])
  const [testMode, setTestMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  function togglePlatform(p: Platform) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  async function handleSubmit() {
    const t = topic.trim()
    if (!t) { setError('Topic is required.'); return }
    if (platforms.length === 0) { setError('Select at least one platform.'); return }

    const url = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
    if (!url) { setError('NEXT_PUBLIC_N8N_WEBHOOK_URL is not set in .env.local'); return }

    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t, test_mode: testMode, platforms }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      setResult((await res.json()) as Result)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const isOk = result?.status === 'posted' || result?.status === 'test_mode'

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '36px 16px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '28px 22px', boxShadow: '0 1px 6px rgba(0,0,0,.07)' }}>

        {/* Header */}
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 2px', letterSpacing: '-0.3px' }}>⚡ GOD MODE v5</h1>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 26px' }}>Automation control panel</p>

        {/* Topic */}
        <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Topic</label>
        <input
          type="text"
          value={topic}
          disabled={loading}
          placeholder="e.g. 5 fitness habits that changed my life"
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          style={{
            width: '100%', padding: '10px 12px', fontSize: 14,
            border: '1.5px solid #e0e0e0', borderRadius: 8,
            boxSizing: 'border-box', outline: 'none', marginBottom: 20,
            background: loading ? '#f9f9f9' : '#fff',
          }}
        />

        {/* Platforms */}
        <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
          Platforms
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {PLATFORMS.map((p) => {
            const on = platforms.includes(p)
            return (
              <button
                key={p}
                type="button"
                disabled={loading}
                onClick={() => togglePlatform(p)}
                style={{
                  padding: '6px 15px', borderRadius: 20, fontSize: 13,
                  fontWeight: on ? 600 : 400, cursor: loading ? 'not-allowed' : 'pointer',
                  border: on ? '2px solid #000' : '1.5px solid #ddd',
                  background: on ? '#000' : '#fff',
                  color: on ? '#fff' : '#333',
                  transition: 'all 0.12s',
                }}
              >
                {p}
              </button>
            )
          })}
        </div>

        {/* Test mode toggle */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => { if (!loading) setTestMode((v) => !v) }}
          onKeyDown={(e) => { if (!loading && (e.key === 'Enter' || e.key === ' ')) setTestMode((v) => !v) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 9, marginBottom: 22,
            cursor: loading ? 'not-allowed' : 'pointer', userSelect: 'none',
            background: testMode ? '#fffbeb' : '#f0fdf4',
            border: `1.5px solid ${testMode ? '#fde68a' : '#bbf7d0'}`,
          }}
        >
          {/* Pill toggle */}
          <div style={{
            width: 38, height: 22, borderRadius: 11, flexShrink: 0,
            background: testMode ? '#f59e0b' : '#22c55e',
            position: 'relative', transition: 'background 0.2s',
          }}>
            <div style={{
              position: 'absolute', top: 3,
              left: testMode ? 3 : 19,
              width: 16, height: 16, borderRadius: '50%',
              background: '#fff', transition: 'left 0.18s',
            }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: testMode ? '#92400e' : '#166534' }}>
              {testMode ? '🧪 Test mode' : '🚀 Live mode'}
            </div>
            <div style={{ fontSize: 11, color: testMode ? '#a16207' : '#15803d', marginTop: 1 }}>
              {testMode ? 'No posting — safe to test' : 'Will post to all selected platforms'}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="button"
          disabled={loading || !topic.trim()}
          onClick={handleSubmit}
          style={{
            width: '100%', padding: 13, fontSize: 15, fontWeight: 700,
            border: 'none', borderRadius: 10, cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
            background: loading || !topic.trim() ? '#999' : '#000',
            color: '#fff',
          }}
        >
          {loading ? '⚡ Generating...' : '⚡ GENERATE'}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 16, padding: '10px 13px', borderRadius: 8, fontSize: 13,
            background: '#fff0f0', border: '1px solid #f5c0c0', color: '#c00',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ marginTop: 16, border: '1px solid #e8e8e8', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{
              padding: '10px 14px', fontSize: 13, fontWeight: 600,
              borderBottom: '1px solid #eee',
              background: isOk ? (result.status === 'posted' ? '#f0fdf4' : '#fffbeb') : '#f8f8f8',
              color: isOk ? (result.status === 'posted' ? '#166534' : '#92400e') : '#333',
            }}>
              {result.status === 'posted' && '✅ Posted'}
              {result.status === 'test_mode' && '🧪 Test complete'}
              {!['posted', 'test_mode'].includes(result.status ?? '') && `Status: ${result.status}`}
              {result.topic ? ` · ${result.topic}` : ''}
            </div>
            <pre style={{
              margin: 0, padding: 14, fontSize: 11, lineHeight: 1.6,
              background: '#0e0e0e', color: '#4ade80',
              overflowX: 'auto', maxHeight: 260,
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  )
}
