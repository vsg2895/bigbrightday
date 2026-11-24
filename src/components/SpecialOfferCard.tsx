import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose cards carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the card's primary action a property of
 * the data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/**
 * The grid offer capsules sit in.
 *
 * THE TRACK IS CAPPED AT 300px, which the mockup's own `minmax(min(100%,290px),
 * 1fr)` is not — and the cap is the difference between a capsule and an egg.
 * With a `1fr` maximum the track width is whatever is left over after the
 * item count divides the row, so THREE offers at 1200px each got a 369px
 * track; at 490px tall that is a 1.3 ratio, which reads as an oval blob, and
 * the same three offers on a 1600px screen would read as something else
 * again. A pill has to be visibly taller than it is wide or it is not a pill,
 * so the maximum is a fixed 300px and the row is CENTRED in whatever space is
 * left. The shape is then the same at every screen width and every offer
 * count, which is the whole point of having a signature shape.
 *
 * `auto-fit` rather than `auto-fill` so a row holding one capsule centres that
 * capsule instead of parking it at the left with three empty tracks beside it.
 *
 * The capsules STRETCH to the row's height rather than each taking its own:
 * three pills with three different bottoms read as a mistake, where three of
 * one height read as a set. The tallest is whichever offer has the longest
 * amount, and at a 300px cap even a 490px one is still 1.63 tall.
 *
 * `offer-grid` drives the `:nth-child` cycle on each capsule's SUN — gold,
 * orange, blue. A CSS cycle is right HERE and wrong on the bonus types: the
 * colour is rhythm and carries no meaning, so repainting it when the set
 * changes costs nothing.
 */
export const OFFER_GRID = 'offer-grid grid grid-cols-[repeat(auto-fit,minmax(min(100%,272px),300px))] justify-center gap-[22px]'

/** Up to two initials, for a casino with no logo artwork. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * An offer card for the listing grids — `.offer` in sites/bigbrightday.html: a
 * CAPSULE. A 999px pill 420px tall, centred, with the sun at its head and a
 * round key at its foot. Nothing else in this network is a tall pill, and it is
 * the shape this site is most recognisable by.
 *
 * THE PADDING IS WHAT MAKES A PILL USABLE, and it is worth writing down why
 * each figure is what it is. A 999px radius on a 300x532 box is an ellipse
 * with a 150px horizontal semi-axis, so the usable width NARROWS towards the
 * top and the bottom: at 52px down the box is only ~178px wide inside the
 * curve, and 32px up from the foot only ~142px. That is why the only thing at
 * the top is the 62px sun with its 10px halo (82px across) and the only thing
 * at the foot is a ~102px key, while everything with a line of text in it sits
 * in the middle third where the full 252px is available. Reducing `pt-12`,
 * raising the foot or widening the text puts words under the curve.
 *
 * 24px side padding and a 252px cap on the amount, NOT the mockup's 34px and
 * 260px — the mockup's pair leaves a content box NARROWER than its own cap, so
 * the cap never binds at all. The amount is 22px rather than the mockup's 26px
 * for the related reason: Syne 800 is a WIDE display face in a narrow column,
 * and the longest single word an operator writes has to fit on one line, or
 * `overflow-wrap: anywhere` puts the break wherever it likes. Measured against
 * the real catalogue, the widest word is "Luckydreams" — 286px at 26, 264 at
 * 24, 242 at 22, against a 252px box. 26 broke it mid-word, 24 still broke it,
 * 22 clears with 10px to spare. `overflow-wrap: anywhere` stays as the safety
 * net for the operator name nobody predicted; it should just never be the
 * thing that runs on ordinary copy.
 *
 * `min-height`, not `height`: an operator's amount can run to three lines, and
 * a pill that cannot grow would clip it. The radius stays 999px at any height,
 * which is what keeps the shape a capsule rather than a stadium.
 *
 * `logo` is ACCEPTED AND UNUSED, on purpose. A casino page passes its own logo
 * down because the offers it lists arrive without their casino attached, and
 * every sibling's card paints that mark somewhere. This one does not: there is
 * no width for a plate inside the curve, and the mockup's capsule names the
 * operator in words and spends its space on the amount. The prop stays in the
 * signature so a caller written against any site in the network still compiles.
 */
export default function SpecialOfferCard({ offer }: { offer: SpecialOffer; logo?: string | null }) {
  const casinoName = offer.casino?.name ?? ''
  const kind = offer.bonus_category_name ?? 'Bonus'
  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY

  return (
    <article className="offer flex min-h-[420px] flex-col items-center gap-3 px-6 pb-9 pt-12 text-center">
      {/* The capsule's sun. Its fill cycles gold / orange / blue down the grid
          and its inner halo goes white while the capsule is lit, so the disc
          keeps its rings on the gold ground the card takes — see globals.css. */}
      <span aria-hidden className="sun sun-md mb-2.5 h-[62px] w-[62px] flex-none" />

      <span className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-muted">{kind}</span>

      {/* Capped at 252px — the content box at this capsule's widest. */}
      <h3 className="font-display max-w-[252px] text-[22px] leading-[1.15] text-ink [overflow-wrap:anywhere]">
        <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {offer.bonuses || offer.title}
        </Link>
      </h3>

      {/* When the headline above is the AMOUNT, the offer's own name still has
          to appear somewhere — otherwise two different offers of the same size
          are indistinguishable in a grid. */}
      {offer.bonuses && <p className="max-w-[252px] text-[14.5px] text-ink-soft [overflow-wrap:anywhere]">{offer.title}</p>}

      {casinoName && (
        <span className="max-w-full text-[15px] text-ink-soft [overflow-wrap:anywhere]">
          by <b className="font-semibold text-ink">{casinoName}</b>
        </span>
      )}

      <span
        className="text-[15px] leading-none tracking-[2px] text-gold"
        role="img"
        aria-label={`${offer.rating} out of 5`}
      >
        {'★'.repeat(offer.rating)}
        <span className="text-line" aria-hidden>
          {'★'.repeat(5 - offer.rating)}
        </span>
      </span>

      {/*
        * The foot. ONE control, always 58px tall and always fully rounded, so
        * the capsule ends on the same round key whichever way in it offers —
        * a circle when a word is unnecessary, and that same key stretched to
        * hold "Claim" when it is not. An external, sponsored link has to SAY
        * that it leaves the site; a second way into a page the whole capsule
        * already links to does not.
        *
        * Claim belongs to the Special Offers bonus type and to nothing else.
        *
        *   Special Offers + link   ->  Claim -> the casino
        *   Special Offers, NO link ->  Claim, leading to the offer's own page,
        *                               where the terms and the operator are.
        *   any other bonus type    ->  the round key, to the offer's page.
        *
        * `relative z-10` lifts it over the heading's stretched link, or the
        * card-wide hit area would swallow the one control inside it.
        */}
      <div className="relative z-10 mt-auto pt-2.5">
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or btn-flat btn-pill min-h-[58px] whitespace-nowrap px-7 text-[16px]">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or btn-flat btn-pill min-h-[58px] whitespace-nowrap px-7 text-[16px]">Claim</Link>
          )
        ) : (
          <Link href={`/special-offers/${offer.slug}`} className="o-go grid h-[58px] w-[58px] place-items-center text-[22px] leading-none">
            <span aria-hidden>→</span>
            <span className="sr-only">See the {offer.title} offer</span>
          </Link>
        )}
      </div>
    </article>
  )
}

/**
 * An offer as a row inside a group: the logo, whose offer it is, its name and
 * amount, and on the right the way in. The whole row opens the offer (the
 * title link is stretched over it) and takes the deeper cream on hover.
 *
 * The SAME Claim rule as the card: Claim only for the Special Offers type —
 * to the casino when the offer has a link, to its own page when it has none.
 * Any other type shows "Details →".
 *
 * `heading` is the title's level: `h4` under a group card's `h3` (the home
 * page), `h3` where the rows sit straight under a section's `h2`.
 */
export function OfferRow({ offer, logo: logoOverride, heading: Heading = 'h4' }: { offer: SpecialOffer; logo?: string | null; heading?: 'h3' | 'h4' }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY
  const kicker = offer.casino?.name ?? offer.bonus_category_name ?? ''

  return (
    <li className="of relative grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2.5 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:px-5">
      {/* The plate stays WHITE: operator logos arrive with their own white
          ground baked in, and any other fill behind one shows as a hard
          rectangle inside the circle. */}
      <span aria-hidden className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border border-line bg-white p-1.5 text-xs font-bold text-ink">
        {logo ? (
          <Image src={logo} alt="" width={104} height={104} sizes="52px" className="h-full w-full object-contain" />
        ) : (
          initials(kicker || offer.title)
        )}
      </span>
      <div className="min-w-0">
        {kicker && <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand">{kicker}</p>}
        <Heading className="text-[15px] font-bold leading-[1.3] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </Heading>
        {offer.bonuses && <p className="text-sm font-bold text-ink [overflow-wrap:anywhere]">{offer.bonuses}</p>}
      </div>
      <div className="relative z-10 col-span-2 flex items-center justify-end gap-3 sm:col-span-1">
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or btn-flat min-h-11 px-4 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or btn-flat min-h-11 px-4 text-sm">Claim</Link>
          )
        ) : (
          <span aria-hidden className="text-[13px] font-semibold text-sea">Details →</span>
        )}
      </div>
    </li>
  )
}
