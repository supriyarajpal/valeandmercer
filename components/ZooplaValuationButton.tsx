// The class/id/text/image URLs here are fixed by Zoopla's widget
// loader script — it queries `#online-valuation-tool` by id and,
// when successfully loaded, attaches an iframe-modal click handler
// that calls preventDefault before the browser follows the href.
//
// The href is a real Zoopla instant-valuation URL (not `#`) so that
// if the widget loader script fails to attach for any reason —
// Cloudflare returning its "Just a moment..." challenge instead of
// the real JS, ad-blocker, Cookiebot blocking-mode, network drop —
// the click still does something useful: it navigates to Zoopla's
// own instant-valuation page in a new tab. Never let a user click
// this button and have absolutely nothing happen.
//
// Do not swap the <img> tags for next/image (the widget script
// wires up around raw DOM img nodes) and do not rehost the icons.
export default function ZooplaValuationButton() {
  return (
    <a
      id="online-valuation-tool"
      className="ovt-button-fixed zt-ovt-button"
      href="https://www.zoopla.co.uk/home-values/"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://www.zoopla.co.uk/zvt/house-light.png"
        alt=""
        aria-hidden="true"
      />
      <span>
        Request an Instant
        <br />
        Online Valuation
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://www.zoopla.co.uk/zvt/arrow-right-light.png"
        alt=""
        aria-hidden="true"
      />
    </a>
  )
}
