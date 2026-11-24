import { ImageResponse } from 'next/og'
import { SHARE_IMAGE_ALT } from '@/lib/seo'

/**
 * Dynamic Open Graph / Twitter card image.
 *
 * Until now no og:image existed anywhere while twitter:card was set to
 * `summary_large_image`, so every share of these pages rendered as an empty
 * card — the single most visible SEO/social gap on the site. Generating it here
 * means it can never drift out of sync with the site name, and needs no binary
 * asset committed to the repo.
 *
 * Next.js links this file automatically on the home page only. Every other
 * page sets its own `openGraph`, which REPLACES the layout's (metadata
 * merges shallowly) and drops this card — so those pages restate it via
 * `SHARE_IMAGES` in lib/seo, which also holds the alt text below.
 */
export const alt = SHARE_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The sunrise at card size.
 *
 * The halos are THREE NESTED CIRCLES, not one `box-shadow` with two ring
 * stops. Satori renders a subset of CSS and its shadow support is the part
 * least worth betting a share card on — a card that silently loses its rings
 * is a card nobody notices is wrong. Concrete divs cannot fail that way, and
 * concentric circles are exactly what the ring shadow was drawing anyway.
 *
 * The three radii are the hero's own proportions: a 340px disc with a 36px
 * ring and a 36px ring beyond it, scaled to the card.
 */
const SUN = { x: 880, y: 540, disc: 340, ring: 36 }

/** Centres a square of side `d` on the sun's centre. */
function ring(d: number, color: string) {
  return {
    display: 'flex',
    position: 'absolute' as const,
    left: SUN.x - d / 2,
    top: SUN.y - d / 2,
    width: d,
    height: d,
    borderRadius: d / 2,
    background: color,
  }
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: '#fbf8f1',
          color: '#12204a',
          fontFamily: 'sans-serif',
        }}
      >
        {/* The sun, rising at the right. */}
        <div style={ring(SUN.disc + SUN.ring * 4, '#fff6dd')} />
        <div style={ring(SUN.disc + SUN.ring * 2, '#fff1c7')} />
        <div style={ring(SUN.disc, '#ffc83d')} />
        {/* EVERYTHING BELOW THE HORIZON, PAINTED BACK OUT. The card is only
            630 tall, so the disc's lower half does not fall off the bottom —
            it sits there in full, and a whole circle is a sun at NOON, which
            is the opposite of what this site is called. A cream band from the
            skyline down cuts it, exactly as the page's own clip does and as
            the favicon's cover rectangle does. */}
        <div style={{ display: 'flex', position: 'absolute', left: 0, top: SUN.y, width: 1200, height: 630 - SUN.y, background: '#fbf8f1' }} />
        {/* The horizon itself, full width and over both. */}
        <div style={{ display: 'flex', position: 'absolute', left: 0, top: SUN.y, width: 1200, height: 3, background: '#12204a' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'absolute', left: 80, top: 186 }}>
          {/* The kicker, on GOLD with ink on it — 10.20:1, the strongest pair
              in this palette. */}
          <div
            style={{
              display: 'flex',
              fontSize: 23,
              letterSpacing: 3,
              textTransform: 'uppercase',
              background: '#ffc83d',
              color: '#12204a',
              borderRadius: 999,
              padding: '12px 28px',
              fontWeight: 700,
            }}
          >
            Bright casinos, clear bonuses
          </div>
          {/* Satori needs an EXPLICIT display on any element with more than one
              child — the wordmark is two coloured spans, so this one says flex
              rather than relying on the browser default it never sees. */}
          <div style={{ display: 'flex', fontSize: 80, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 30 }}>
            {/* Two colours, so the spans must touch exactly. The tail is the
                DEEP orange: the mockup's #FF6B1A is 2.69:1 on this paper and
                could not carry a letter at any size, where #B53C00 is 5.48. */}
            <span>bigbright</span><span style={{ color: '#b53c00' }}>day</span>
          </div>
          <div style={{ display: 'flex', fontSize: 25, marginTop: 26, color: '#3e4a6e', fontWeight: 500 }}>
            18+ · Gamble responsibly
          </div>
        </div>
      </div>
    ),
    size,
  )
}
