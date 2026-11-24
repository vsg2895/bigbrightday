import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * Big Bright Day category tabs, from sites/bigbrightday.html (`.filters` /
 * `.tab`): a wrapping row of 12px-cornered slots, each carrying its casino
 * count on a small plate beside the label. The current one FILLS INK and puts
 * its count on GOLD — the one place in the row where the gold appears, and the
 * strongest pair in the palette at 10.20:1.
 *
 * The resting border is `line-strong`, not the mockup's transparent edge over
 * a 1.28:1 hairline: a tab is a CONTROL, it needs 3:1, and a row of tabs with
 * no resting boundary gives a keyboard user nothing to find.
 *
 * 12px corners rather than pills, which the siblings use. On this site a pill
 * is a 420px offer capsule and a round top is a sunrise; spending either shape
 * on a filter would spend the two things the design is recognised by.
 *
 * THE MOCKUP'S COUNTRY SELECT IS NOT HERE. Its filter row opens with an "All
 * Countries" dropdown driven by a hard-coded `geo` field on each casino in its
 * demo data. The API has countries, but nothing scopes a casino LIST by one —
 * /countries/<slug> is its own page with its own rules — so a select here
 * would either do nothing or quietly filter on a field that does not mean what
 * its label says. Removing it also returns the tabs to the full width of the
 * row, which is what lets seven of them wrap onto two lines instead of three.
 *
 * The tabs NAVIGATE rather than filter in place: always the canonical
 * /categories/<slug> route. The query forms (`/?category=`,
 * `/casinos?category=`) are 301'd to it at the edge (lib/seo/redirects.ts), so
 * linking either would spend a redirect per visitor and crawl budget on URLs
 * that resolve elsewhere.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories" className="mb-6">
      {/* WRAPS rather than scrolling sideways. The mockup's row is
          `flex-wrap`, and with seven categories plus their counts a single
          scrolling line on a phone hides most of the set behind a gesture with
          no affordance saying so. */}
      <ul className="flex flex-wrap gap-1.5" role="list">
        {categories.map((c) => {
          const active = c.slug === selected
          return (
            <li key={c.id} className="min-w-0">
              <Link
                href={`/categories/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`tab flex min-h-12 items-center gap-2.5 whitespace-nowrap px-4 text-[15px] font-semibold ${
                  active ? 'tab-on' : ''
                }`}
              >
                {/* The category's own icon, as in the Casinos menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {c.logo_path && (
                  <img src={resolveImageUrl(c.logo_path)!} alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
                )}
                <span>{c.name}</span>
                {typeof c.casinos_count === 'number' && (
                  /* The mockup's `.tab .n`: a 7px PLATE, not a bare number.
                     Both its fills live in globals.css next to `.tab-on`, for
                     the same layering reason the active tab does. */
                  <span className="tab-count grid h-[22px] min-w-6 place-items-center px-1.5 text-[12.5px] font-bold tabular-nums">
                    {c.casinos_count}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
