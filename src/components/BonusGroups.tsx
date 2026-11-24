import Link from 'next/link'
import { COPY } from '@/constants/copy'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'

/** The dot before each subhead, cycling the three daylight colours.
 *
 *  These are FILLS, which is the only way the bright gold, orange and blue are
 *  allowed on this page: as text they are 1.46, 2.69 and 3.13 on the paper.
 *  A 14px disc is a graphic and needs 3:1, which all three clear comfortably
 *  as solid shapes against the cream.
 *
 *  Indexed by position rather than cycled with `:nth-child` because the colour
 *  is applied in TSX here, and a CSS cycle would have to reach across the
 *  group boundary into each `offer-grid` and fight the capsule suns' own
 *  cycle for the same selectors. */
const DOT_TONE = ['bg-accent', 'bg-orange', 'bg-sky'] as const

/**
 * The home page's Bonuses — the mockup's `.subh` + `.offers` pairs: one
 * DISPLAY-FACE subhead led by a COLOURED DOT per bonus type, over a grid of
 * that type's capsules.
 *
 * Built in this site's own language rather than the sibling sites' — which is
 * the point, since they all serve the same catalogue and a reader comparing
 * them should not meet the same block four times. The siblings wrap each type
 * in a card with a coloured head band; here there is no card at all — the type
 * is a Syne line behind a 14px disc and the CAPSULES carry the weight, which
 * is the arrangement the mockup draws (`.subh::before`) and the reason its
 * suns cycle three tones.
 *
 * The count sits beside the subhead and the link is pushed to the right edge,
 * with nothing between them — no trailing rule. The section this sits in is
 * already headed by a two-tone display line, and a second horizontal rule four
 * times down one section would read as the page being ruled into a form.
 *
 * Each subhead carries the type's name, this site's own `offers_count` for it,
 * and a link to the type's page. The count is resolved server-side over the
 * unlimited set, so it is the number of offers of this kind on the whole site
 * rather than the number of cards under it.
 *
 * Every type's offers are in the server HTML, and each group keeps the
 * `#bonus-<slug>` anchor the bonus-type rows land on.
 *
 * Each grid is its own `offer-grid`, so the three-tone cycle on the capsule
 * SUNS restarts per type: the colours are rhythm within a run of cards, and a
 * cycle carried across group boundaries would make the first sun of each group
 * a different colour for no reason a reader could name.
 */
export default function BonusGroups({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  return (
    <div className="flex flex-col gap-12">
      {sections.map((section, i) => (
        <section
          key={section.id}
          id={`bonus-${section.slug}`}
          aria-labelledby={`bonus-${section.slug}-heading`}
          className="scroll-mt-28"
        >
          <div className="mb-[18px] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3 id={`bonus-${section.slug}-heading`} className="font-display flex min-w-0 items-center gap-3 text-[22px] text-ink sm:text-[26px]">
              {/* The mockup's `.subh::before`. A real element rather than a
                  pseudo-element so the colour can be chosen per position — see
                  DOT_TONE — and `aria-hidden` because it is rhythm, not a key:
                  nothing on the page says what any of the three mean. */}
              <span aria-hidden className={`h-3.5 w-3.5 flex-none rounded-full ${DOT_TONE[i % DOT_TONE.length]}`} />
              <span className="[overflow-wrap:anywhere]">{section.name}</span>
              <span className="sr-only">
                {' '}— {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
              </span>
              {/* `font-sans` is load-bearing: this span is INSIDE the h3, so
                  without it the digit inherits Syne at 800 with -0.02em
                  tracking, which at 14px sets two numerals almost touching. */}
              <span aria-hidden className="font-sans text-[14px] font-bold text-muted tabular-nums">{section.offers_count}</span>
            </h3>
            <Link
              href={`/bonuses/${section.slug}`}
              className="inline-flex min-h-11 items-center text-[15px] font-semibold text-sea transition-colors hover:text-brand"
            >
              {COPY.home.seeMore}<span className="sr-only"> {section.name}</span> <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
          {section.description && <p className="mb-[18px] max-w-[640px] text-[15px] text-ink-soft">{section.description}</p>}
          <div className={OFFER_GRID}>
            {section.offers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
