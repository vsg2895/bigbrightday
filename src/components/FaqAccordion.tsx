type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ, from sites/bigbrightday.html (`.faq` / `.fq`): NO CARDS. A
 * numbered list under a 1.5px ink rule, divided by hairlines, each row a
 * three-column grid — the number, the question, and a round plus mark that
 * rotates 45° into a cross and fills GOLD while its answer is open.
 *
 * The absence of cards is the point and it is the mockup's own. Everything
 * above this section is a panel of some kind — arches, capsules, picks — and
 * the FAQ is the one part of the page meant to be READ rather than scanned.
 * Taking the boxes away leaves the text and the rules between it, which is
 * what a page of prose looks like.
 *
 * The NUMBER does the work a card edge would. It is set in the display face at
 * 15px, sits in its own 44px column so every question starts at the same
 * x-position however long the numbers get, and turns brand orange while its
 * answer is open — the one state signal that is still visible when the fold
 * itself has scrolled off.
 *
 * The question is set in INSTRUMENT SANS at 700, not the display face. Syne is
 * a geometric display type with very tight tracking: it carries a four-word
 * heading and defeats a nine-word question, and the mockup makes the same
 * exception here (`.fq summary h3{font-family:var(--body)}`).
 *
 * The answer is INDENTED to the question's column rather than to the number's,
 * so the number hangs in the margin of its own answer — the mockup's
 * `padding: 0 56px 26px 60px`. It drops to a flat 48px below `sm`, where the
 * number column itself narrows to 32px.
 *
 * The mark is drawn from two pseudo-elements rather than a "+" character.
 * A glyph's cross-bar sits off-centre in most faces, which is invisible until
 * it rotates 45° and the × comes out lopsided. The rotation and the fill are
 * `.pm` in globals.css, driven by `details[open]`.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 * `[&::-webkit-details-marker]:hidden` and `list-none` drop the browser's own
 * triangle so only this mark shows.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details key={item.question} open={i === 0} className="fq group">
          <summary className="grid cursor-pointer list-none grid-cols-[32px_minmax(0,1fr)_40px] items-center gap-4 py-6 [&::-webkit-details-marker]:hidden sm:grid-cols-[44px_minmax(0,1fr)_40px]">
            {/* The ordinal. `aria-hidden` because it numbers the list rather
                than naming the question, and a screen reader reading "zero
                one" before every question learns nothing. */}
            <span aria-hidden className="font-display text-[15px] text-muted tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="fq-q text-[18px] font-bold leading-[1.3] tracking-normal text-ink transition-colors [overflow-wrap:anywhere] sm:text-[20px]">
              {item.question}
            </h3>
            {/* Decoration: the <summary> already announces its own state. */}
            <span
              aria-hidden
              className="pm relative grid h-10 w-10 flex-none place-items-center text-ink
                before:absolute before:h-[2px] before:w-4 before:rounded-sm before:bg-current before:content-['']
                after:absolute after:h-[2px] after:w-4 after:rotate-90 after:rounded-sm after:bg-current after:content-['']"
            />
          </summary>
          <p className="pb-[26px] pl-12 pr-0 text-[16.5px] leading-[1.7] text-ink-soft sm:pl-[60px] sm:pr-14 sm:text-[17px]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
