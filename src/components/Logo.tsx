import Link from 'next/link'

/**
 * Big Bright Day brand mark, from sites/bigbrightday.html: a sun ON the
 * horizon. A navy plate, five gold rays fanned over it, a gold half-disc
 * cresting a cream horizon line, and the mockup's bright orange at its core.
 *
 * The HALF disc is the point. Every sun on this site is cut by something — the
 * hero's by the picks card, a casino card's by the arch floor, this one by its
 * own horizon — because a whole circle is a sun at noon and a cut one is
 * daybreak, which is the name. It is also the smallest instance of the shape
 * the whole page is built from, so the mark and the hero are the same drawing
 * at a 12:1 difference in scale.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request
 * and stays crisp at any size. The artwork is aria-hidden; the Link's name is
 * its visible text.
 *
 * THE WORDMARK IS ONE WORD IN TWO COLOURS — the mockup's own
 * `bigbright<i>day</i>`, where the tail is the accent. On the page that tail
 * is `--color-brand` #B53C00 (5.48:1), not the mockup's #FF6B1A, which at
 * 2.69:1 could not carry a letter at any size. The bright orange stays in the
 * artwork beside it, where it is a fill.
 *
 * `onDark` INVERTS the plate rather than recolouring the wordmark alone, which
 * is what the mockup's own footer mark does: the plate goes cream, the rays
 * orange, the horizon navy. On that ground the mockup's gold is finally
 * correct as text (10.20:1), so the tail takes it exactly as drawn.
 *
 * `taglineClassName` lets a caller hide the tagline where the header runs out
 * of room, rather than shipping a second, shorter logo.
 */
export default function Logo({
  className = '',
  taglineClassName = '',
  onDark = false,
}: {
  className?: string
  taglineClassName?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="14" fill={onDark ? '#fbf8f1' : '#12204a'} />
        {/* The five rays. Gold on the navy plate, the bright orange on the
            cream one — gold on cream is 1.46:1 and the fan would vanish. */}
        <g stroke={onDark ? '#ff6b1a' : '#ffc83d'} strokeWidth="3" strokeLinecap="round">
          <path d="M24 9v5M12.5 14.5l3.4 3.4M35.5 14.5l-3.4 3.4M7.5 27h5M35.5 27h5" />
        </g>
        {/* The half disc cresting the horizon, and its core. */}
        <path d="M14 33a10 10 0 0120 0z" fill="#ffc83d" />
        <circle cx="24" cy="33" r="3.2" fill="#ff6b1a" />
        {/* The horizon the sun is cut by — the plate's own ground colour
            inverted, so it reads as a gap in the disc rather than as a line
            drawn over it. */}
        <path d="M9 34h30" stroke={onDark ? '#12204a' : '#fbf8f1'} strokeWidth="2.6" strokeLinecap="round" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className={`font-display text-[22px] sm:text-[25px] ${onDark ? 'text-paper' : 'text-ink'}`}>
          bigbright<i className={`not-italic ${onDark ? 'text-night-accent' : 'text-brand'}`}>day</i>
        </span>
        <span className={`mt-[7px] text-[11.5px] font-semibold tracking-[0.06em] ${onDark ? 'text-night-faint' : 'text-muted'} ${taglineClassName}`.trim()}>
          Bright casinos, clear bonuses
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
