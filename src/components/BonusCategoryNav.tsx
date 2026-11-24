import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * "Browse by bonus type", from sites/bigbrightday.html (`.btypes` / `.btype`):
 * a HAIRLINE GRID. Three columns of rows drawn entirely in rules — a 1.5px ink
 * rule across the top, then a hairline under and between the cells — each row
 * carrying the type's icon on a tinted disc, its name over its offer count,
 * and an orange arrow. The row fills with the gold tint when pointed at, and
 * the disc goes WHITE so the icon is never tint-on-tint.
 *
 * NO CARDS, NO SHADOWS, NO GAPS. This is the one section on the page built
 * from lines rather than panels, and the contrast is what makes it read as an
 * index rather than as more content: the hero, the casinos and the offers are
 * all objects on a surface, and between them sits a table of contents.
 *
 * THE RULES ARE SPLIT SO NO LINE IS EVER DRAWN TWICE. The container draws the
 * top rule; each cell draws its own bottom and, except in the leftmost column,
 * its own left. "Leftmost" cannot be a property of the container because the
 * column count changes at two breakpoints, so it is a `:nth-child` sum per
 * count in globals.css — one column suppresses every left rule, two take the
 * even cells, three take the 2nd and 3rd of each run. A single border on the
 * container plus borders on the cells would paint a 2px line wherever the two
 * met, which is visible on a 1px hairline.
 *
 * THE DISC TAKES A TINT, NOT A SATURATED FILL. The mockup draws its own line
 * icons in ink on a solid pink, blue or green disc; the icons here arrive from
 * the admin as full-colour artwork, and a saturated disc behind an arbitrary
 * colour is a clash nobody can predict. The three tints read under anything
 * and keep the cycle — and ink is over 12.8:1 on all three.
 *
 * This component renders NO HEADING. The section's head — its title and
 * eyebrow — is drawn by the page's own `SectionHead`, and a second <h2>
 * carrying the same id as that one is a duplicate id, not a heading.
 *
 * Each row opens that type's own page. The counts are the SITE's — active,
 * claimable, owned by a casino attached here — resolved server-side. Renders
 * nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  return (
    <ul className="btypes-grid grid grid-cols-1 min-[46rem]:grid-cols-2 min-[67.5rem]:grid-cols-3" role="list">
      {types.map((section) => (
        <li key={section.id} className="min-w-0">
          <Link
            href={`/bonuses/${section.slug}`}
            /* The left padding is NOT here: it has to change with the left
               RULE, which depends on the column count, so both are declared
               together in globals.css. */
            className="btype flex h-full items-center gap-[18px] py-[26px] pr-5"
          >
            <span aria-hidden className="btype-plate grid h-[52px] w-[52px] shrink-0 place-items-center">
              {/* The type's own icon, as in the Bonus menu. A plain <img>:
                  next/image refuses SVG. alt="" because the label names it. */}
              {section.icon_path && (
                <img src={resolveImageUrl(section.icon_path)!} alt="" width={24} height={24} className="h-6 w-6" />
              )}
            </span>
            <span className="min-w-0">
              <b className="block text-[17px] font-bold leading-[1.25] [overflow-wrap:anywhere] sm:text-[18px]">
                {section.name}
              </b>
              <span className="text-[14px] text-muted">
                {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
              </span>
            </span>
            {/* The arrow in BRAND orange, not the mockup's #FF6B1A: an arrow is
                a graphic and needs 3:1, where the bright orange is 2.69 on the
                paper and 2.53 on the gold tint the row takes on hover. */}
            <span aria-hidden className="ml-auto shrink-0 text-[20px] font-bold leading-none text-brand">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
