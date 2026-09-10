import { Reveal } from '@/components/Reveal'

import { LOGO_FALLBACKS } from '@/lib/logoFallbacks'

// Homepage trust strip. The same seven footer logos (accreditations,
// Propertymark certificates and portal partners) reproduced as a seamless,
// slow right-to-left marquee. All the treatment lives in globals.css (.acc-*):
// logos are desaturated and multiplied onto the cream band so they sit
// quietly, a single logo crossfades to true colour on hover, the strip pauses
// on hover, and prefers-reduced-motion collapses it to a static centred row.
// Palette (#A0845C gold) and easing (--ease-out-soft) unchanged.

// One flat list of the seven logo visuals, rendered twice into the track (the
// second copy is aria-hidden and, under reduced motion, removed). Each carries
// the `acc-logo` class so it picks up the tint + hover-to-colour treatment.
const LOGO_ITEMS: React.ReactNode[] = [
  <svg
    key="prs"
    className="acc-logo"
    width="86"
    height="30"
    viewBox="0 0 120 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Property Redress Scheme"
  >
    <rect x="0" y="8" width="6" height="26" fill="#333" />
    <rect x="9" y="14" width="6" height="20" fill="#9B59B6" />
    <rect x="18" y="19" width="6" height="15" fill="#C39BD3" />
    <text x="28" y="22" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="bold" fill="#333">Property</text>
    <text x="28" y="36" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="bold" fill="#333">Redress</text>
  </svg>,
  <img key="arla" className="acc-logo" src="/images/footer-image.svg" alt="ARLA Propertymark" style={{ height: 24, width: 'auto', display: 'block' }} />,
  <img key="tds" className="acc-logo" src="/images/tenancy-deposit.png" alt="Tenancy Deposit Scheme" style={{ height: 32, width: 'auto', display: 'block' }} />,
  <img
    key="zoopla"
    className="acc-logo"
    src={LOGO_FALLBACKS.zoopla}
    alt="Zoopla"
    style={{ height: 20, width: 'auto', display: 'block' }}
  />,
  <img
    key="otm"
    className="acc-logo"
    src={LOGO_FALLBACKS.onthemarket}
    alt="OnTheMarket"
    style={{ height: 20, width: 'auto', display: 'block' }}
  />,
  <img
    key="cert1"
    className="acc-logo"
    src={LOGO_FALLBACKS.certificate1}
    alt="Certified and accredited by Propertymark"
    style={{ height: 36, width: 'auto', display: 'block' }}
  />,
  <img
    key="cert3"
    className="acc-logo"
    src={LOGO_FALLBACKS.certificate3}
    alt="Propertymark Client Money Protection (CMP)"
    style={{ height: 36, width: 'auto', display: 'block' }}
  />,
]

export default function AccreditationsStrip() {
  return (
    <section style={{ background: 'transparent', padding: 'clamp(40px, 6vw, 72px) 0' }}>
      {/* Label stays inset + centred; only it animates in (keeping the marquee
          out of Reveal avoids a transient opacity layer that would break the
          logos' multiply blend during the entrance). */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--gutter)', textAlign: 'center' }}>
        <Reveal y={24} amount={0.3}>
          <span style={{ display: 'block', width: 32, height: 1, background: '#A0845C', margin: '0 auto 16px' }} />
          <p className="eyebrow" style={{ color: '#A0845C', marginBottom: 34 }}>Accreditations &amp; Partnerships</p>
        </Reveal>
      </div>

      {/* Full-bleed marquee. Two identical copies of the logo set → seamless
          -50% loop. Pause-on-hover + reduced-motion handled in CSS. */}
      <div className="acc-marquee" role="group" aria-label="Accreditations and partnerships">
        <div className="acc-track">
          {[false, true].map(dup =>
            LOGO_ITEMS.map((node, i) => (
              <span
                className="acc-item"
                key={`${dup ? 'dup' : 'main'}-${i}`}
                data-dup={dup ? 'true' : undefined}
                aria-hidden={dup ? true : undefined}
              >
                {node}
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  )
}
