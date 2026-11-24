import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many regions a card names before collapsing the rest into a count. */
const REGIONS_SHOWN = 3

/**
 * Exported so the home page's picks list shows the same stars as a card.
 *
 * A DEEP gold #B87B00, not the mockup's #FFC83D, which is 1.55:1 on a card: a
 * filled star and an empty one would read as the same shape at the same
 * weight, which is the only thing a star rating has to do. The mockup's own
 * 0.4px #D89A00 stroke does not rescue it either — the outline is 2.46:1.
 *
 * #B87B00 is 3.58:1 on a card, 3.37:1 on the page and 3.18:1 on the gold tint
 * an offer capsule turns when pointed at, so it clears the 3:1 a graphic needs
 * on every ground it is ever drawn on. The exact figure is printed beside the
 * stars everywhere they appear, so the colour is never the only carrier.
 */
export function Stars({ rating, onDark = false }: { rating: number; onDark?: boolean }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 16px reads as a rendering fault.
  const filled = Math.round(rating)
  const on = onDark ? 'text-night-accent' : 'text-gold'
  const off = onDark ? 'text-night-line' : 'text-line'

  return (
    <span
      className="inline-flex items-center tracking-[2px] text-[16px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? on : off} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The grid the cards sit in — the mockup's `.list`: THREE across on a wide
 * screen, two on a tablet, one on a phone. Callers render
 * `<ol className={CASINO_LIST}>`; the order of the list is the ranking.
 *
 * `casino-list` drives the three-colour cycle on the arch TINTS and the colour
 * of the sun rising inside each one, together (globals.css), so a row of three
 * is cool / warm / gold and never repeats a pairing. It is on the LIST rather
 * than inside the card because `:nth-child` can only be written where the
 * siblings are.
 */
export const CASINO_LIST = 'casino-list grid grid-cols-1 gap-6 min-[42.5rem]:grid-cols-2 min-[68.75rem]:grid-cols-3'

/**
 * A casino as a SUNRISE POSTCARD — `.cc` in sites/bigbrightday.html: a white
 * card under a hairline, opening on an ARCH whose top corners are round and
 * whose bottom corners are square, with a haloed sun rising from below the
 * arch's floor, a horizon rule across it, and the logo on a plate floating in
 * the middle. Everything under the arch is CENTRED, which is the mockup's own
 * layout and is what makes the card read as a picture with a caption rather
 * than as a row of fields.
 *
 * The card lifts 4px and takes an INK EDGE on hover. The edge is the signal —
 * the shadow only follows it — because at a 1.28:1 hairline there is nothing
 * for a shadow alone to change.
 *
 * NO RANK NUMERAL, as on every site in this network and as in this mockup:
 * the <ol> order is the ranking. The leader is marked by the mockup's own
 * `.badge`, a chip pinned over the top of the arch, and it is driven by
 * `rank === 1` rather than `:first-child` so page 2 of /casinos does not crown
 * its first row.
 *
 * The mockup's `.facts` pair — MIN. DEPOSIT and PAYOUT — is NOT shipped: no
 * column in the API holds either, and a payout time is the one figure this
 * site has promised not to invent. The regions line takes that slot, which is
 * real.
 */
export default function CasinoCard({
  casino,
  rank,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length
  const isLeader = rank === 1

  return (
    <li className="flex">
      {/* `p-3` on the card and the arch filling it edge to edge: the arch is
          inset by the card's own padding rather than by a margin of its own,
          so the 30px card radius and the 20px arch radius stay concentric at
          the two bottom corners. */}
      <div className="rw relative flex w-full flex-col rounded-[30px] p-3">
        {/* The arch. Its tint and its sun cycle with the row — see
            CASINO_LIST. 200px tall, which is where the `200px 200px` radius
            comes from: at that height the top is a true semicircle. */}
        <div className="cc-arch grid h-[200px] place-items-center">
          {isLeader && (
            <span className="badge absolute left-1/2 top-2.5 z-[2] -translate-x-1/2 whitespace-nowrap px-3 py-[5px] text-[12px] font-bold uppercase tracking-[0.08em]">
              {COPY.casinos.topPick}
            </span>
          )}

          {/* The plate. A FIXED height at every breakpoint, never `auto`:
              operator artwork ranges from square to wide banner, and an auto
              box sizes itself to whichever it happens to get. White because
              operator logos carry their own ground — see `.clogo`. */}
          <span className="clogo grid h-[76px] w-[min(230px,84%)] place-items-center overflow-hidden p-2 text-center">
            {image ? (
              <Image src={image} alt={`${casino.name} logo`} width={320} height={160} sizes="230px" className="max-h-[60px] w-full object-contain" />
            ) : (
              <span className="font-display text-[17px] leading-[1.05] text-ink [overflow-wrap:anywhere]">{casino.name}</span>
            )}
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center gap-3 px-3 pb-2.5 pt-[22px] text-center">
          <h3 className="font-display text-[23px] text-ink [overflow-wrap:anywhere] sm:text-[26px]">{casino.name}</h3>

          <p className="flex items-center gap-2.5">
            <Stars rating={casino.rating} />
            <span aria-hidden className="text-[14.5px] font-bold text-ink tabular-nums">{casino.rating.toFixed(1)}</span>
          </p>

          {/* The welcome bonus in a well of the page cream — the one place a
              card is not white, so the figure that matters most is the one
              thing with a ground of its own. Dropped entirely when the
              operator has none, rather than left as an empty line. */}
          {casino.bonuses && (
            <p className="w-full rounded-[18px] bg-cream px-4 py-3.5 text-[17px] font-bold leading-[1.3] text-ink [overflow-wrap:anywhere] sm:text-[17.5px]">
              <small className="mb-1 block text-[12px] font-bold uppercase tracking-[0.1em] text-brand">Welcome bonus</small>
              {casino.bonuses}
            </p>
          )}

          {/* The regions as the mockup writes them — a SENTENCE, not chips.
              A centred card has no good place for a wrapping chip row, and
              `Available: …` says what the list is where a bare chip does not.
              Still capped: an operator accepting forty countries would
              otherwise set the height of every card in the row. */}
          {shownRegions.length > 0 && (
            <p className="text-[14px] text-muted">
              Available: {shownRegions.map((c) => c.name).join(', ')}
              {extraRegions > 0 && ` +${extraRegions} more`}
            </p>
          )}

          {/* The actions, side by side as the mockup pairs them. `mt-auto`
              ends every card in a row on its buttons, but it is NOT the gap
              above them — it is whatever slack the card has left, which is
              zero on the tallest card in the row. The `pt-1` is the floor,
              and `mt-auto` only ever adds to it. */}
          <div className="mt-auto grid w-full grid-cols-2 gap-2 pt-1">
            <a
              href={casino.attachment.affiliate_url}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="btn-or btn-flat min-h-12 px-3 text-[15px]"
            >
              {COPY.casinos.visitCasino}
            </a>
            <Link href={`/casinos/${casino.slug}`} className="btn-ln btn-flat min-h-12 px-3 text-[15px]">
              {COPY.casinos.readReview}
            </Link>
          </div>
        </div>
      </div>
    </li>
  )
}
