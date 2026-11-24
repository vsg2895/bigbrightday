import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_LIST, Stars } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusGroups from '@/components/BonusGroups'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3


/**
 * The label on each hour plate in the picks card — the mockup's own `HOURS`
 * array, which prints `No. 1` / `No. 2` / `No. 3`.
 *
 * This is the ONE place in this network where a rank numeral is printed, and
 * it is allowed here for a reason that does not generalise: this list is
 * headed "Today's top 3", so the ordinal IS what the list is about. The
 * network's rule — no rank numbers on a CASINO CARD — still holds, and
 * `CasinoCard` prints none; a numeral on each of twenty cards invites reading
 * it as a score, where a numeral on three rows under that heading is the
 * heading's own content.
 *
 * Written out rather than derived from the index so the string that reaches
 * the page is the string in the source, and a screen reader gets "No. 1"
 * rather than a bare digit beside a casino name.
 */
const HOUR_LABELS = ['No. 1', 'No. 2', 'No. 3'] as const

/** The three daylight tints, in the order the hour plates use them, so the
 *  method's numerals and the hero's picks are the same three steps. An array
 *  rather than a `:nth-child` cycle because this list is exactly three long
 *  and these are POSITIONS: a cycle would keep going if the slice ever grew,
 *  and the fourth tint it reached for does not exist. */
const STEP_TINT = ['bg-accent', 'bg-tint-sun', 'bg-tint-sky'] as const

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* Hero — THE SUNRISE, and the one piece of this page that has to be
            read as a whole rather than as parts.

            The claim is at the left. At the right, a column with the day's top
            three on a white card and, BEHIND IT, a 520px gold disc inside two
            halos, rising from below. The section has NO bottom padding and the
            card has no bottom border: the card's lower edge lands exactly on
            the horizon rule that closes the hero, so the card sits ON the
            skyline and the sun rises behind it. Three details make that work
            and all three are load-bearing:

              · the grid is `items-end`, so the card is pinned to the bottom of
                the row however tall the claim beside it grows;
              · the column CLIPS (`overflow-hidden`) and is pulled out to the
                page gutter with a negative margin, so the disc can be wider
                than the column and be cut off at the edges instead of
                deciding the page's width — the siblings' version of this bug
                was a sun that set the horizontal scroll on a phone;
              · the card's shadow points UP (`0 -18px 40px`, on `.hard-gold`),
                because the light is below it.

            `.slab` keeps its name so the shared class vocabulary holds across
            the network; here it carries nothing, and `.horizon` below is the
            rule that actually closes the section. */}
        <section className="slab relative overflow-hidden pt-12 sm:pt-[72px]">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <div className="grid grid-cols-1 items-end gap-0 min-[56.25rem]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[56.25rem]:gap-14">
              <div className="relative z-[2]">
                {/* The mockup's `.kicker`: a white pill under a hairline with a
                    small haloed sun at its left end — the mark's own disc, at
                    the smallest size it appears on the page. */}
                <p className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-line bg-paper py-[7px] pl-2 pr-4 text-[14.5px] font-semibold text-ink-soft">
                  <span aria-hidden className="sun sun-sm h-[22px] w-[22px] flex-none" />
                  <span>{COPY.home.heroEyebrow}</span>
                </p>
                <h1 className="font-display mt-[26px] text-[clamp(44px,6.6vw,96px)] tracking-[-0.045em] text-balance text-ink">
                  {COPY.home.heroHeadline}{' '}
                  {/* The mockup sets this phrase in #FF6B1A, which is 2.69:1
                      on this paper — under even the 3:1 a display size is
                      allowed. The deep orange is 5.48:1 and is the same hue,
                      so the hero still turns orange where it was drawn to. */}
                  <span className="text-brand">{COPY.home.heroHighlight}</span>
                  {COPY.home.heroHeadlineTail && <> {COPY.home.heroHeadlineTail}</>}
                </h1>
                <p className="mt-[26px] max-w-[540px] text-[17px] text-ink-soft sm:text-[20px]">{COPY.home.heroSubtitle}</p>
                <div className="mt-[34px] flex flex-wrap gap-3 pb-14 sm:pb-[72px]">
                  <Link href="/casinos" className="btn-or min-h-14 px-7 text-[16.5px]">
                    {COPY.home.featuredCasinos}
                  </Link>
                  {anyOffersVisible && (
                    <Link href="/special-offers" className="btn-ln min-h-14 px-7 text-[16.5px]">
                      {COPY.home.specialOffers}
                    </Link>
                  )}
                </div>
              </div>

              {/* The sunrise column. The disc is sized in THREE fixed steps
                  rather than one percentage, which is the mockup's own
                  approach and the right one: a percentage of a narrow column
                  shrinks the sun to a dot on a phone, where a fixed 360px disc
                  bleeds past the gutter and gets clipped — so the sun stays a
                  sunrise at every width and never adds a pixel of scroll. */}
              {casinos.length >= 3 && (
                <aside
                  aria-labelledby="podium-heading"
                  /* NO `overflow-hidden` HERE, deliberately, though the
                     mockup puts it on this column. Clipping at the column's
                     own edge cuts the outer halo off with a hard VERTICAL LINE
                     48px in from each side, and what you see is not a sunrise
                     but a pale rectangle with a circle in it. The section
                     above clips instead, so the halo is only ever cut by the
                     window — which is what the edge of a sunrise should be cut
                     by. The disc is absolutely positioned, so it adds no width
                     to the layout either way, and `body { overflow-x: clip }`
                     plus the section's own clip mean no width of halo can ever
                     produce a horizontal scrollbar. */
                  className="relative -mx-4 flex min-w-0 flex-col justify-end self-stretch px-4 pt-[30px] sm:-mx-[22px] sm:px-[22px] min-[56.25rem]:pt-[60px]"
                >
                  {/* THE SUN, IN A CLIPPING LAYER THAT ONLY CLIPS VERTICALLY.
                      The disc hangs 130-160px below this column, and what has
                      to cut it off is the HORIZON — the column's own bottom
                      edge. Clipping on the column itself does that, but it
                      also cuts the halo off with a hard vertical line 48px in
                      from each side, which is the version that reads as a pale
                      rectangle rather than as light.

                      So the clip is this wrapper: the column's full height
                      (`inset-y-0`) and 200px wider than it on each side. The
                      halo reaches at most 72px past the disc and the disc at
                      most ~65px past the column, so nothing is ever cut
                      horizontally, while the bottom is cut exactly at the
                      skyline. The wrapper is symmetric, so `left-1/2` inside
                      it is still the column's centre.

                      Without this the lower half of the disc showed BELOW the
                      horizon on a phone and the hero read as a card sitting on
                      a full circle — a sun at noon, which is the opposite of
                      what this site is called. */}
                  <span aria-hidden className="pointer-events-none absolute inset-y-0 -inset-x-[200px] overflow-hidden">
                    <span className="sun sun-xl absolute bottom-[-130px] left-1/2 aspect-square w-[360px] -translate-x-1/2 min-[27.5rem]:bottom-[-150px] min-[27.5rem]:w-[440px] min-[56.25rem]:bottom-[-160px] min-[56.25rem]:w-[min(520px,100%)]" />
                  </span>
                  <div className="hard-gold relative z-[1] px-4 pb-2 pt-[18px] min-[27.5rem]:px-[22px] min-[27.5rem]:pt-[22px]">
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <h2 id="podium-heading" className="text-[15px] font-bold uppercase tracking-[0.1em] text-muted">
                        {COPY.home.podiumTitle}
                      </h2>
                      {/* The mockup's own "☀ Updated", which dates nothing.
                          The badge says the cadence the method publishes
                          instead, which is a claim this site can keep. */}
                      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">{COPY.home.podiumBadge}</p>
                    </div>
                    <ol className="picks">
                      {casinos.slice(0, 3).map((c, i) => (
                        <li key={c.id}>
                          <Link
                            href={`/casinos/${c.slug}`}
                            className="pick grid grid-cols-[62px_minmax(0,1fr)] items-center gap-3 px-1 py-3.5 text-ink min-[27.5rem]:grid-cols-[62px_minmax(0,1fr)_auto] min-[27.5rem]:gap-4"
                          >
                            {/* The hour plate. The ordinal is REAL CONTENT and
                                is read out — see HOUR_LABELS. */}
                            {/* `whitespace-nowrap` and a 62px column at EVERY
                                width: at 54px "No. 2" broke after "No." and
                                the plate rendered two lines of a label that is
                                two words long. The plate is a fixed shape and
                                its label has to fit it, not wrap inside it. */}
                            <span className="hr font-display grid h-11 place-items-center whitespace-nowrap text-[15px] tracking-[-0.01em] text-ink">
                              {HOUR_LABELS[i]}
                            </span>
                            <span className="min-w-0">
                              {/* WRAPS rather than truncating: at 320px this
                                  column has about 150px, enough to turn "7 Bit
                                  Casino" into "7 Bit Casi…", and a list of
                                  picks whose names are cut off identifies
                                  nothing. */}
                              <b className="pick-name font-display block text-[19px] leading-[1.1] text-ink [overflow-wrap:anywhere] min-[27.5rem]:text-[22px]">{c.name}</b>
                              <span className="mt-1 flex items-center gap-2">
                                <Stars rating={c.rating} />
                              </span>
                            </span>
                            {/* The mockup's `.t3d` carries a MIN. DEPOSIT.
                                Nothing in the API holds one, so the slot
                                carries the rating, which is real. Hidden below
                                27.5rem, as the mockup hides its own third
                                column: at that width the row has already given
                                it up to keep the name readable, and the stars
                                beside it already carry the figure. */}
                            <span className="hidden whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-[14px] font-bold text-ink tabular-nums min-[27.5rem]:inline">
                              <span className="sr-only">{COPY.home.podiumRatingLabel} </span>{c.rating.toFixed(1)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                </aside>
              )}
            </div>
          </div>
          {/* THE HORIZON. Full-bleed, outside the 1200px column, because a
              skyline that stops short of the window is not a skyline. */}
          <div className="horizon" aria-hidden />
        </section>

        {/* 1 — the rankings. Category tabs, then the casinos as cards. */}
        <section className="pt-[68px] sm:pt-24" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <SectionHead
              id="top-casinos-heading"
              eyebrow={COPY.home.rankingLabel}
              title={COPY.home.topCasinosTitle}
              subtitle={COPY.home.topCasinosSubtitle}
              more={casinos.length > 0 ? { href: '/casinos', label: COPY.home.viewAll, sr: ' casinos' } : undefined}
            />

            {categories.length > 0 && selected && (
              <CategoryNav categories={categories} selected={selected} />
            )}

            {casinos.length === 0 ? (
              /* The mockup's `.empty`: a dashed box in the hairline tan,
                 which is decoration around a sentence rather than a boundary
                 anything depends on — so it stays at the mockup's own value
                 while the tabs above it take `line-strong`. */
              <p className="rounded-[22px] border-[1.5px] border-dashed border-line p-11 text-center text-[16px] text-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={CASINO_LIST}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-7 flex justify-center">
                <Link href={`/categories/${selected}`} className="btn-ln min-h-14 px-[30px] text-[16.5px]">
                  See more casinos<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 2 — the bonus types, as a HAIRLINE GRID. Nothing at all without a
            Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pt-[68px] sm:pt-24" aria-labelledby="bonus-types-heading">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
              <SectionHead id="bonus-types-heading" eyebrow={COPY.home.bonusTypesKicker} title={COPY.home.bonusTypesTitle} />
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* 3 — the offers, as CAPSULES grouped by type. */}
        {bonusSections.length > 0 ? (
          <section className="pt-[68px] sm:pt-24" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
              <SectionHead
                id="bonus-heading"
                eyebrow={COPY.home.bonusesLabel}
                title={COPY.home.bonus}
                subtitle={COPY.home.bonusesSubtitle}
                more={{ href: '/special-offers', label: COPY.home.seeAllBonuses, sr: '' }}
              />
              <BonusGroups sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="pt-[68px] sm:pt-24" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
              <SectionHead
                id="offers-heading"
                eyebrow={COPY.home.bonusesLabel}
                title={COPY.home.specialOffers}
                more={{ href: '/special-offers', label: COPY.home.viewAll, sr: ' special offers' }}
              />
              <div className={OFFER_GRID}>
                {topOffers.map((offer) => (
                  <SpecialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4 — how a casino earns its place. Not in the mockup, which ends at
            the FAQ; kept because it is the page's only account of where the
            ranking comes from, and an affiliate site that ranks operators
            without publishing its method is asking to be taken on trust. */}
        <section className="pt-[68px] sm:pt-24" aria-labelledby="method-heading">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-[22px]">
            <SectionHead id="method-heading" eyebrow={COPY.home.methodLabel} title={COPY.home.methodTitle} subtitle={COPY.home.methodSubtitle} />
            <ol className="grid grid-cols-1 gap-[26px] sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
              {COPY.home.methodSteps.map((step, i) => (
                <li key={step.no} className="step rounded-[22px] p-[26px]">
                  <p className="flex items-center gap-3.5 text-[13px] font-bold uppercase tracking-[0.08em] text-brand">
                    {/* An HOUR PLATE, the same device the hero's picks use:
                        the same 10px radius and the same three tints in the
                        same order, so the two numbered lists on the page read
                        as one idea rather than two.

                        NOT the `.hr` CLASS, though. `.hr` is unlayered and
                        sets its own `background`, and Tailwind's utilities
                        live in `@layer utilities` — which loses to every
                        unlayered rule whatever the source order. Written with
                        `.hr` here, all three plates silently came out the same
                        deeper cream and the cycle did not exist. The radius is
                        the only thing `.hr` was contributing, so it is spelled
                        out and the fill is left to win on its own.

                        The tints are whole class names out of STEP_TINT rather
                        than interpolated fragments, so Tailwind can see them. */}
                    <span aria-hidden className={`font-display grid h-11 w-11 place-items-center rounded-[10px] text-[19px] text-ink ${STEP_TINT[i % STEP_TINT.length]}`}>
                      {step.no.replace(/^0/, '')}
                    </span>
                    {step.verb}
                  </p>
                  <h3 className="font-display mt-[18px] text-[22px] text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-[15.5px] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-7 flex items-center gap-3 text-[15px] font-medium text-muted">
              <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
              </svg>
              <span>{COPY.home.methodLoop}</span>
            </p>
          </div>
        </section>

        {/* 5 — the FAQ, one numbered column as the mockup lays it out. Every
            answer is in the HTML, open or closed, which the FAQPage schema
            requires. */}
        <section className="pt-[68px] sm:pt-24" aria-labelledby="faq-heading">
          {/* NARROWER than every other section — the mockup's `.narrow`, 840px.
              An answer is a paragraph, and a paragraph set across 1200px runs
              past the ~75-character measure where a reader starts losing the
              start of the next line. */}
          <div className="mx-auto max-w-[840px] px-4 sm:px-[22px]">
            <SectionHead id="faq-heading" eyebrow={COPY.home.faqLabel} title={COPY.home.faqTitle} subtitle={COPY.home.faqSubtitle} />
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
    </>
  )
}

/**
 * The mockup's `.sec-head`: an EYEBROW, then the heading with its LAST WORD IN
 * ORANGE, its line underneath, and an optional link to the full list pushed to
 * the right edge.
 *
 * The eyebrow is doing work the heading cannot. These headings are phrases
 * rather than labels — "Casinos you can read in one go" says the argument but
 * not which part of the page you have arrived at — so the tracked-out line
 * above it names the section in two or three words. It is `aria-hidden`: it is
 * a second, shorter name for the same section, and announcing both would read
 * the heading twice.
 *
 * The two-tone heading is the section's visual marker. The split is done here
 * rather than in the copy so the strings stay plain text, readable in a
 * <title> and in JSON-LD, with no markup to strip. It splits on the LAST
 * SPACE, so a one-word heading ("Bonuses") goes entirely orange and a longer
 * one keeps its tail coloured; an empty or single-word string is handled
 * rather than left to produce an undefined.
 *
 * ORANGE, not the link blue: on this site blue is what you can click, and a
 * heading is not. Spending the link colour on a heading is how a page teaches
 * someone that colour means nothing.
 *
 * A local component rather than one in components/: every site in the network
 * heads its sections differently, and this shape is this design's own. Nothing
 * else renders it, so it lives where it is used.
 */
function SectionHead({
  id,
  eyebrow,
  title,
  subtitle,
  more,
}: {
  id: string
  eyebrow?: string
  title: string
  subtitle?: string
  more?: { href: string; label: string; sr: string }
}) {
  const cut = title.lastIndexOf(' ')
  const head = cut === -1 ? '' : title.slice(0, cut)
  const tail = cut === -1 ? title : title.slice(cut + 1)

  return (
    /* `flex-[1_1_28rem]` on the text, NOT `flex-1` and not the default.
       With `flex-wrap`, a line is broken using each item's HYPOTHETICAL size
       — its flex-basis, which for `auto` is max-content — and not its
       min-content. A heading like "Casinos you can read in one go" at 60px has
       a max-content width around 1700px, so with the default basis it claimed
       a line of its own and pushed "View all" underneath, at the LEFT, where
       it read as part of the subtitle. A 448px basis is small enough to share
       a wide row (the text then grows to fill it) and large enough to still
       claim its own line on a phone, which is where the link does belong
       below. */
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
      <div className="min-w-0 flex-[1_1_28rem]">
        {eyebrow && (
          <span aria-hidden className="mb-3 block text-[13px] font-bold uppercase tracking-[0.14em] text-muted">
            {eyebrow}
          </span>
        )}
        <h2 id={id} className="font-display text-[34px] text-ink sm:text-[clamp(36px,5vw,60px)]">
          {head && <>{head} </>}
          <span className="text-brand">{tail}</span>
        </h2>
        {subtitle && <p className="mt-3 max-w-[620px] text-[17.5px] text-ink-soft">{subtitle}</p>}
      </div>
      {more && (
        <Link href={more.href} className="inline-flex min-h-11 flex-none items-center text-[16px] font-semibold text-sea transition-colors hover:text-brand">
          {more.label}{more.sr && <span className="sr-only">{more.sr}</span>} <span aria-hidden className="ml-1">→</span>
        </Link>
      )}
    </div>
  )
}
