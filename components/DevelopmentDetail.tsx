'use client'
import { useMemo, useState } from 'react'
import { Reveal } from '@/components/Reveal'
import DevelopmentHero from '@/components/DevelopmentHero'
import DevelopmentEnquiryActions from '@/components/DevelopmentEnquiryActions'
import { DevelopmentCard, type DevelopmentCardData } from '@/components/DevelopmentsListing'
import { submitToWeb3Forms } from '@/lib/web3forms'
import type { Development, UnitMixRow, SpecSection } from '@/lib/developments'
import type { DevelopmentAssets } from '@/lib/developmentAssets'
import { SUPPRESS_UNITMIX } from '@/lib/developmentDisplay'

// Single-column development detail page. Enquiry is a full-width section in the
// main flow (no sticky side card). The page title is the address-based title
// (street, city · unit type) passed in from the server. Every surface reads
// from the theme tokens; the only dark elements are the deliberate brand
// accents (enquiry panel, pull-quote tile, CTA banner). The developer field is
// intentionally not rendered anywhere (value stays in data.json).

export default function DevelopmentDetail({
  development, title, assets, similar,
}: {
  development: Development
  title: string
  assets: DevelopmentAssets
  similar: DevelopmentCardData[]
}) {
  const d = development
  const hasStation = !!(d.nearestStation && d.nearestStation.name)
  const hasLocation = !!(d.locationNotes || hasStation)
  const suppressUnitMix = SUPPRESS_UNITMIX.has(d.slug)
  const showUnitMix = !suppressUnitMix && Array.isArray(d.unitMix) && d.unitMix.length > 0
  const pullQuote = useMemo(() => firstSentence(d.description), [d.description])

  return (
    <main style={{ background: 'var(--surface)', paddingBottom: 'var(--section-y)' }}>
      {/* 1 — Full-bleed hero gallery + Floorplan / Location / Brochure tabs */}
      <DevelopmentHero name={d.name ?? d.slug} assets={assets} locationNotes={d.locationNotes} nearestStation={d.nearestStation} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 var(--gutter)' }}>
        {/* 2–4 — ENTRY POINT: title (address-based), price, badges */}
        <Reveal y={24} amount={0.2}>
          <header style={{ paddingTop: 'clamp(40px, 6vw, 72px)', maxWidth: 900 }}>
            <h1 style={{ color: 'var(--text)', fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.08, marginBottom: 20 }}>{title}</h1>
            {d.price && (
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(24px, 3.4vw, 36px)', color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 20 }}>{d.price}</div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {d.tenure && <Badge tone="gold">{d.tenure}</Badge>}
              <Badge tone="outline">New Listing</Badge>
            </div>
          </header>
        </Reveal>

        {/* 5 — Key facts: unit mix + size */}
        {(showUnitMix || suppressUnitMix || d.sizeRange) && (
          <Section eyebrow="Key facts" title="Unit mix & sizes">
            {suppressUnitMix ? (
              d.totalUnits != null && (
                <p style={{ fontSize: 16, color: 'var(--text)' }}><strong style={{ fontWeight: 500 }}>{`${d.totalUnits} apartments`}</strong></p>
              )
            ) : (
              showUnitMix && <UnitMixGrid rows={d.unitMix as UnitMixRow[]} />
            )}
            {d.sizeRange && (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: showUnitMix || suppressUnitMix ? 20 : 0 }}>
                <span style={{ letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 11, color: 'var(--text-faint)', marginRight: 12 }}>Size range</span>
                {d.sizeRange}
              </p>
            )}
          </Section>
        )}

        {/* 6 — Collapsible property information (developer NOT rendered) */}
        <PropertyInformation development={d} />

        {/* 7 — Quick links */}
        <QuickLinks assets={assets} hasSpec={!!(d.specification && d.specification.length)} />

        {/* 8 — Share row */}
        <ShareRow name={title} slug={d.slug} />

        {/* 9 — Enquiry: full-width section in the main flow (no side box) */}
        <EnquirySection name={title} price={d.price} />

        {/* 10 — Overview: headline + description (read more/less) */}
        {(d.headline || d.description) && (
          <Section eyebrow="Overview" title={d.headline ?? 'About this development'}>
            {d.description && <ReadMore text={d.description} />}
          </Section>
        )}

        {/* 11 — Highlighted features */}
        {d.highlightedFeatures && d.highlightedFeatures.length > 0 && (
          <Section eyebrow="Highlighted Features" title="What stands out">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
              {d.highlightedFeatures.map(f => (
                <li key={f} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 15, color: 'var(--text)', lineHeight: 1.75 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A0845C', marginTop: 9, flexShrink: 0 }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 14 — Location */}
        {hasLocation && (
          <Section eyebrow="Location" title="Getting around">
            {d.locationNotes && <p style={{ fontSize: 15.5, lineHeight: 1.95, color: 'var(--text)', opacity: 0.85 }}>{d.locationNotes}</p>}
            {hasStation && (
              <div style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 16, padding: '16px 22px', borderRadius: 'var(--radius-md)', background: 'var(--surface-2)', border: '0.5px solid var(--border)' }}>
                <StationIcon />
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 4 }}>Nearest station</div>
                  <div style={{ fontSize: 15, color: 'var(--text)' }}>
                    {d.nearestStation!.name}
                    {(d.nearestStation!.time || d.nearestStation!.distance) && <span style={{ color: '#A0845C' }}> · {d.nearestStation!.time || d.nearestStation!.distance}</span>}
                  </div>
                </div>
              </div>
            )}
          </Section>
        )}

        {/* 15 — Floorplan & specifications */}
        {(assets.brochure || assets.floorplan || (d.specification && d.specification.length > 0)) && (
          <Section id="floorplan-specs" eyebrow="Floorplan & Specifications" title="Plans & finish">
            {assets.brochure && (
              <a href={assets.brochure} target="_blank" rel="noopener noreferrer" className="btn-press" style={downloadBtnStyle} onMouseEnter={hoverDownloadOn} onMouseLeave={hoverDownloadOff}>
                <DownloadIcon /> Download brochure (PDF)
              </a>
            )}
            {assets.floorplan && (
              <figure style={{ margin: assets.brochure ? '28px 0 0' : 0 }}>
                <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'clamp(12px, 2vw, 24px)' }}>
                  <img src={assets.floorplan} alt={`${title} floor plan`} loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 4 }} />
                </div>
                <figcaption style={{ fontSize: 11, letterSpacing: '0.06em', color: 'var(--text-faint)', marginTop: 10 }}>Indicative floor plan. Areas and layouts subject to change.</figcaption>
              </figure>
            )}
            {d.specification && d.specification.length > 0 && (
              <div style={{ marginTop: assets.brochure || assets.floorplan ? 36 : 0, display: 'grid', gap: 1, background: 'var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {d.specification.map(sec => <SpecBlock key={sec.heading} section={sec} />)}
              </div>
            )}
          </Section>
        )}
      </div>

      {/* 12 — Interleaved gallery with a pull-quote (full width) */}
      {assets.images.length > 0 && (
        <InterleavedGallery images={assets.images} name={title} pullQuote={pullQuote} />
      )}

      {/* 13 — Speak to our team banner */}
      <SpeakToTeam />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 var(--gutter)' }}>
        {/* 16 — Similar developments */}
        {similar.length > 0 && (
          <Section eyebrow="Similar" title="Other developments">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 36px', alignItems: 'start' }}>
              {similar.map(s => <DevelopmentCard key={s.slug} dev={s} />)}
            </div>
          </Section>
        )}

        {/* 17 — Enquiry form (Web3Forms) */}
        <EnquiryForm developmentName={title} slug={d.slug} />
      </div>
    </main>
  )
}

/* ------------------------------------------------------------------ */
/* 9 — Enquiry section (full-width, in the main flow)                  */
/* ------------------------------------------------------------------ */

function EnquirySection({ name, price }: { name: string; price?: string }) {
  return (
    <Reveal y={24} amount={0.15}>
      <section style={{ marginTop: 40, borderTop: '0.5px solid var(--border)', paddingTop: 42 }}>
        <div style={{ position: 'relative' }}>
          {/* Blurred gold/bronze/ink blob backdrop, clipped to this panel. */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ position: 'absolute', inset: '-15%', filter: 'blur(26px)', background: 'radial-gradient(40% 60% at 18% 20%, rgba(160,132,92,0.6), transparent 70%), radial-gradient(46% 70% at 90% 86%, rgba(122,96,62,0.55), transparent 72%), radial-gradient(50% 60% at 60% 50%, rgba(40,35,28,0.5), transparent 74%)' }} />
          </div>
          <div className="glass-strong vm-enquiry-panel" style={{ position: 'relative', zIndex: 1, color: '#F2EFE9', padding: 'clamp(28px, 4vw, 44px)', borderRadius: 'var(--radius-lg)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 360px)', gap: 'clamp(24px, 4vw, 56px)', alignItems: 'center' }}>
            <div>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 12 }}>Enquire</p>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(24px, 3vw, 34px)', letterSpacing: '-0.01em', marginBottom: 12 }}>Register your interest</div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(242,239,233,0.72)', maxWidth: 440 }}>
                Speak to us directly about availability and pricing, or use the enquiry form below.
              </p>
            </div>
            <div>
              <DevelopmentEnquiryActions name={name} price={price} />
            </div>
          </div>
        </div>
      </section>
      {/* Stack the panel's two columns on narrow screens. */}
      <style>{`@media (max-width: 720px){ .vm-enquiry-panel { grid-template-columns: 1fr !important; } }`}</style>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* 5 — Unit-mix grid                                                   */
/* ------------------------------------------------------------------ */

function UnitMixGrid({ rows }: { rows: UnitMixRow[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 1, background: 'var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      {rows.map((row, i) => {
        const unit = row.unit != null ? String(row.unit) : null
        const count = row.count != null ? Number(row.count) : null
        const primary = row.type ?? (unit != null ? `Unit ${unit}` : (row.size ?? '—'))
        const meta: string[] = []
        if (count != null && !Number.isNaN(count)) meta.push(`${count} ${count === 1 ? 'home' : 'homes'}`)
        if (row.size && row.size !== primary) meta.push(String(row.size))
        if (row.price) meta.push(String(row.price))
        if (unit != null && row.type) meta.push(`Unit ${unit}`)
        return (
          <div key={i} style={{ background: 'var(--surface-2)', padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--text)', letterSpacing: '-0.01em' }}>{primary}</div>
            {meta.length > 0 && (
              <div style={{ fontSize: 11, letterSpacing: '0.04em', color: 'var(--text-muted)', marginTop: 5, lineHeight: 1.6 }}>{meta.join(' · ')}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6 — Collapsible property information (developer intentionally omitted) */
/* ------------------------------------------------------------------ */

function PropertyInformation({ development }: { development: Development }) {
  const d = development
  const rows: Array<{ label: string; value: string }> = []
  // NOTE: `developer` is intentionally NOT rendered anywhere on /buy (per spec);
  // the value remains in data.json.
  if (d.completion) rows.push({ label: 'Completion', value: String(d.completion) })
  if (d.totalUnits != null) rows.push({ label: 'Total units', value: String(d.totalUnits) })
  if (d.paymentStructure) rows.push({ label: 'Payment structure', value: d.paymentStructure })
  if (d.warranty) rows.push({ label: 'Warranty', value: d.warranty })

  const [open, setOpen] = useState(true)
  if (rows.length === 0) return null

  return (
    <Reveal y={24} amount={0.15}>
      <section style={{ marginTop: 40, borderTop: '0.5px solid var(--border)', paddingTop: 42 }}>
        <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(22px, 2.6vw, 30px)', color: 'var(--text)', letterSpacing: '-0.01em' }}>Property information</span>
          <span aria-hidden style={{ color: '#A0845C', fontSize: 14, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.35s var(--ease-out-soft)' }}>▾</span>
        </button>
        {open && (
          <div style={{ marginTop: 22 }}>
            {rows.map((row, i) => (
              <div key={row.label} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)', gap: 20, padding: '15px 0', borderTop: i === 0 ? 'none' : '0.5px solid var(--border)', fontSize: 14.5 }}>
                <span style={{ color: '#7A7268', letterSpacing: '0.02em' }}>{row.label}</span>
                <span style={{ color: 'var(--text)', lineHeight: 1.7 }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* 7 — Quick links                                                     */
/* ------------------------------------------------------------------ */

function QuickLinks({ assets, hasSpec }: { assets: DevelopmentAssets; hasSpec: boolean }) {
  const links: Array<{ label: string; onClick?: () => void; href?: string }> = []
  if (assets.floorplan || hasSpec) links.push({ label: 'Floor plan', onClick: () => scrollToId('floorplan-specs') })
  if (assets.brochure) links.push({ label: 'Download brochure', href: assets.brochure })
  links.push({ label: 'Enquire', onClick: () => scrollToId('enquiry-form') })

  return (
    <Reveal y={16} amount={0.2}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 40 }}>
        {links.map(l => l.href ? (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={chipStyle} onMouseEnter={chipOn} onMouseLeave={chipOff}>{l.label}<span aria-hidden style={{ color: '#A0845C', marginLeft: 8 }}>→</span></a>
        ) : (
          <button key={l.label} type="button" onClick={l.onClick} style={{ ...chipStyle, cursor: 'pointer' }} onMouseEnter={chipOn} onMouseLeave={chipOff}>{l.label}<span aria-hidden style={{ color: '#A0845C', marginLeft: 8 }}>→</span></button>
        ))}
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* 8 — Share row                                                       */
/* ------------------------------------------------------------------ */

function ShareRow({ name, slug }: { name: string; slug: string }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = () => (typeof window !== 'undefined' ? window.location.href : `https://valeandmercer.co.uk/buy/${slug}`)

  const copy = async () => {
    try { await navigator.clipboard.writeText(shareUrl()); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard unavailable */ }
  }
  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) { try { await navigator.share({ title: name, url: shareUrl() }) } catch { /* dismissed */ } }
    else copy()
  }

  return (
    <Reveal y={16} amount={0.2}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Share</span>
        <button type="button" onClick={copy} style={{ ...chipStyle, cursor: 'pointer' }} onMouseEnter={chipOn} onMouseLeave={chipOff}>{copied ? 'Link copied' : 'Copy link'}</button>
        <a href={`https://wa.me/?text=${encodeURIComponent(`${name} — ${shareUrl()}`)}`} target="_blank" rel="noopener noreferrer" style={chipStyle} onMouseEnter={chipOn} onMouseLeave={chipOff}>WhatsApp</a>
        <a href={`mailto:?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(shareUrl())}`} style={chipStyle} onMouseEnter={chipOn} onMouseLeave={chipOff}>Email</a>
        <button type="button" onClick={nativeShare} style={{ ...chipStyle, cursor: 'pointer' }} onMouseEnter={chipOn} onMouseLeave={chipOff}>Share…</button>
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* 10 — Read more / less                                               */
/* ------------------------------------------------------------------ */

function ReadMore({ text }: { text: string }) {
  const LIMIT = 340
  const long = text.length > LIMIT
  const [open, setOpen] = useState(false)
  const shown = !long || open ? text : text.slice(0, text.lastIndexOf(' ', LIMIT)) + '…'
  return (
    <div style={{ maxWidth: 800 }}>
      <p style={{ fontSize: 15.5, lineHeight: 1.95, color: 'var(--text)', opacity: 0.85 }}>{shown}</p>
      {long && (
        <button type="button" onClick={() => setOpen(o => !o)} className="link-underline" style={{ marginTop: 14, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: '#A0845C', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          {open ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 12 — Interleaved gallery + pull-quote (uniform 4:3 tiles)           */
/* ------------------------------------------------------------------ */

function InterleavedGallery({ images, name, pullQuote }: { images: string[]; name: string; pullQuote: string | null }) {
  const tiles: Array<{ kind: 'img'; src: string } | { kind: 'quote'; text: string }> = images.map(src => ({ kind: 'img' as const, src }))
  if (pullQuote && images.length >= 2) tiles.splice(Math.min(2, tiles.length), 0, { kind: 'quote', text: pullQuote })

  return (
    <section style={{ background: 'var(--surface)', padding: 'clamp(48px, 7vw, 96px) var(--gutter)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal y={18} amount={0.15}><p className="eyebrow" style={{ color: '#A0845C', marginBottom: 26 }}>Gallery</p></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {tiles.map((tile, i) => tile.kind === 'img' ? (
            <div key={i} className="img-zoom" style={{ overflow: 'hidden', borderRadius: 'var(--radius-md)', aspectRatio: '4 / 3', background: 'var(--surface-3)', border: '1px solid var(--border)' }}>
              <img src={tile.src} alt={`${name} gallery image`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ) : (
            <blockquote key={i} style={{ margin: 0, aspectRatio: '4 / 3', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: 'clamp(18px, 2.2vw, 28px)', borderRadius: 'var(--radius-md)', background: '#28231C', color: '#F2EFE9' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(13px, 1.35vw, 17px)', lineHeight: 1.4 }}>
                <span style={{ color: '#A0845C' }}>“</span>{tile.text}<span style={{ color: '#A0845C' }}>”</span>
              </p>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 13 — Speak to our team banner (deliberate dark accent)              */
/* ------------------------------------------------------------------ */

function SpeakToTeam() {
  return (
    <section style={{ padding: 'clamp(24px, 4vw, 56px) var(--gutter)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <Reveal y={20} amount={0.2}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: '#28231C', padding: 'clamp(36px, 6vw, 64px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 28 }}>
            <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(60% 120% at 90% 10%, rgba(160,132,92,0.35), transparent 60%)' }} />
            <div style={{ position: 'relative', maxWidth: 560 }}>
              <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Speak to our team</p>
              <h2 style={{ color: '#F2EFE9', fontSize: 'clamp(26px, 3.6vw, 40px)', lineHeight: 1.1 }}>
                Considering this <span style={{ color: '#A0845C', fontStyle: 'italic' }}>development?</span>
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.85, color: 'rgba(242,239,233,0.7)', marginTop: 16, maxWidth: 460 }}>
                We&rsquo;ll talk you through availability, pricing and the buying process — no pressure.
              </p>
            </div>
            <button type="button" onClick={() => scrollToId('enquiry-form')} className="btn-press" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#28231C', background: '#A0845C', border: '1px solid #A0845C', padding: '15px 28px', borderRadius: 'var(--radius-pill)', cursor: 'pointer' }}>
              Enquire now <span aria-hidden>→</span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 17 — Enquiry form (Web3Forms)                                       */
/* ------------------------------------------------------------------ */

function EnquiryForm({ developmentName, slug }: { developmentName: string; slug: string }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '', consent: false })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [consentError, setConsentError] = useState(false)

  const handleSubmit = async () => {
    if (!form.consent) { setConsentError(true); return }
    setConsentError(false)
    setStatus('sending')
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim() || 'Unknown'
    try {
      const ok = await submitToWeb3Forms({
        subject: `New Homes Enquiry: ${developmentName}`,
        from_name: 'Vale and Mercer Website',
        replyto: form.email,
        'Form': 'New Homes Enquiry',
        'Development': developmentName,
        'Development slug': slug,
        'Name': fullName,
        'Email': form.email,
        'Phone': form.phone,
        'Message': form.message,
        'Consent given': 'Yes (given at submission)',
      })
      setStatus(ok ? 'sent' : 'error')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Development enquiry network error', err)
      setStatus('error')
    }
  }

  const inp: React.CSSProperties = { background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--text)', fontSize: 15, padding: '12px 0', outline: 'none', width: '100%', fontFamily: 'var(--font-sans)', transition: 'border-color 0.4s var(--ease-out-soft)' }
  const lab: React.CSSProperties = { fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8, display: 'block' }
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = '#A0845C' }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'var(--border-strong)' }

  return (
    <section id="enquiry-form" style={{ marginTop: 40, borderTop: '0.5px solid var(--border)', paddingTop: 42 }}>
      <Reveal y={24} amount={0.15}>
        <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>Enquiry</p>
        <h2 style={{ color: 'var(--text)', fontSize: 'clamp(22px, 2.6vw, 30px)', lineHeight: 1.2, marginBottom: 24 }}>Register your interest</h2>
      </Reveal>

      {status === 'sent' ? (
        <Reveal y={20}>
          <div className="glass-cream" style={{ textAlign: 'center', padding: '64px 32px', borderRadius: 'var(--radius-lg)', maxWidth: 760 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 44, fontWeight: 300, color: 'var(--text)', marginBottom: 14 }}>Thank you</div>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: 'var(--text-muted)' }}>We have your enquiry and will be in touch shortly.</p>
          </div>
        </Reveal>
      ) : (
        <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div className="form-name-row">
            <div>
              <label style={lab}>First name</label>
              <input type="text" style={inp} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={lab}>Last name</label>
              <input type="text" style={inp} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>
          <div>
            <label style={lab}>Email address</label>
            <input type="email" style={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={lab}>Phone number</label>
            <input type="tel" style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={lab}>Message</label>
            <textarea rows={4} style={{ ...inp, resize: 'vertical' }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
          </div>
          {status === 'error' && <p style={{ fontSize: 13, color: '#c0392b' }}>Something went wrong. Please try again.</p>}
          <div>
            <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.consent} onChange={e => { setForm({ ...form, consent: e.target.checked }); if (e.target.checked) setConsentError(false) }} aria-invalid={consentError} style={{ marginTop: 3, width: 16, height: 16, accentColor: '#A0845C', flexShrink: 0, cursor: 'pointer' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.8, letterSpacing: '0.01em' }}>
                I agree to Vale &amp; Mercer contacting me about this enquiry and, optionally, with property updates. Unsubscribe anytime.{' '}
                <a href="/privacy" className="link-underline" style={{ color: '#A0845C' }}>Privacy Notice</a>.
              </span>
            </label>
            {consentError && <p role="alert" style={{ fontSize: 12, color: '#c0392b', marginTop: 8, marginLeft: 28 }}>Please tick the box to consent before submitting.</p>}
          </div>
          <button onClick={handleSubmit} disabled={status === 'sending'} className="btn-press" style={{ position: 'relative', background: '#34302B', color: '#F2EFE9', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '18px 28px', border: 'none', borderRadius: 'var(--radius-pill)', cursor: status === 'sending' ? 'wait' : 'pointer', overflow: 'hidden', width: '100%' }}>
            <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              {status === 'sending' ? 'Sending...' : 'Send Enquiry'}
              {status !== 'sending' && <span aria-hidden>→</span>}
            </span>
          </button>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal y={24} amount={0.15}>
      <section id={id} style={{ marginTop: 40, borderTop: '0.5px solid var(--border)', paddingTop: 42 }}>
        <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 14 }}>{eyebrow}</p>
        <h2 style={{ color: 'var(--text)', fontSize: 'clamp(22px, 2.6vw, 30px)', lineHeight: 1.2, marginBottom: 24, maxWidth: 720 }}>{title}</h2>
        {children}
      </section>
    </Reveal>
  )
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'gold' | 'outline' }) {
  const style = tone === 'gold'
    ? { background: '#A0845C', color: '#F2EFE9', border: '1px solid #A0845C' }
    : { background: 'transparent', color: 'var(--text)', border: '1px solid rgba(160,132,92,0.5)' }
  return (
    <span style={{ display: 'inline-block', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: 'var(--radius-pill)', ...style }}>{children}</span>
  )
}

function SpecBlock({ section }: { section: SpecSection }) {
  return (
    <div style={{ background: 'var(--surface-2)', padding: 'clamp(22px, 3vw, 32px)' }}>
      <h3 style={{ fontSize: 18, color: 'var(--text)', marginBottom: 16 }}>{section.heading}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {section.items.map(item => (
          <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#A0845C', marginTop: 8, flexShrink: 0 }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const chipStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'var(--text)', background: 'var(--surface-2)', border: '0.5px solid var(--border)',
  padding: '10px 16px', borderRadius: 'var(--radius-pill)', textDecoration: 'none',
  transition: 'border-color var(--dur) var(--ease-apple), background var(--dur) var(--ease-apple)',
}
const chipOn = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.borderColor = 'rgba(160,132,92,0.6)'; e.currentTarget.style.background = 'var(--surface-3)' }
const chipOff = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-2)' }

const downloadBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
  color: '#F2EFE9', background: '#34302B', border: '1px solid #34302B', padding: '15px 26px', borderRadius: 'var(--radius-pill)',
  textDecoration: 'none', transition: 'background var(--dur) var(--ease-apple), border-color var(--dur) var(--ease-apple)',
}
const hoverDownloadOn = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.background = '#A0845C'; e.currentTarget.style.borderColor = '#A0845C' }
const hoverDownloadOff = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.background = '#34302B'; e.currentTarget.style.borderColor = '#34302B' }

function scrollToId(id: string) {
  if (typeof document === 'undefined') return
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function firstSentence(text?: string): string | null {
  if (!text) return null
  const m = text.match(/^(.{40,210}?[.!?])(\s|$)/)
  return m ? m[1] : null
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
    </svg>
  )
}

function StationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden fill="none" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="12" rx="2" />
      <path d="M6 12h12M9 20l-2 1M15 20l2 1M9 16v2m6-2v2" />
    </svg>
  )
}
