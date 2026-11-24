'use client'

import { useState } from 'react'
import { COPY } from '@/constants/copy'
import { useToast } from '@/components/ToastProvider'
import { isValidEmail } from '@/lib/email'

/**
 * `compact` means NO INTRO — the field and the button alone, without the title
 * and subtitle the component otherwise prints above them.
 *
 * Both of this site's capture points are compact: the band above the footer
 * already carries an <h2> and its line, and the header has room for a field
 * and nothing else. Letting the form print its own pair on the band would
 * publish both twice, once as a heading and once as a paragraph. The
 * accessible name still carries the copy either way (`aria-label` on the form).
 *
 * It does NOT mean "small": every mode is 48px, over the 44px tap target.
 *
 * `tone` is which GROUND the form is standing on, and it exists because this
 * site has two, one DARK and one light:
 *
 *   'bar'  — the NAVY top bar, this site's primary capture point, present at
 *            every width. The mockup's `.hsub`: a field in a DEEPER NAVY
 *            (#1B2B5C) beside a gold key. The field's own fill is what makes
 *            it findable on a dark bar — an outline alone on near-black is a
 *            rectangle of nothing — and its border is lifted off the mockup's
 *            #33426F, which is 1.39:1 against that fill and effectively
 *            invisible, to `night-control` #6676A8 at 3.05:1.
 *   'band' — the GOLD-TINT block above the footer. A WHITE field under the
 *            same control-weight hairline, with the deep-orange key.
 *
 * A boolean would have been enough today and wrong tomorrow: the next ground
 * this form lands on gets its own name here rather than a second flag.
 */
export default function NewsletterForm({
  compact = false,
  tone = 'band',
  className = '',
}: {
  compact?: boolean
  tone?: 'band' | 'bar'
  className?: string
}) {
  const onBar = tone === 'bar'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [website, setWebsite] = useState('')
  // A domain-typo correction from SendGrid, e.g. user@gmial.com -> gmail.com.
  // The ONLY validation detail ever shown to a visitor: it is about their own
  // address, and it turns a dead form into a corrected signup.
  const [suggestedEmail, setSuggestedEmail] = useState<string | null>(null)
  const toast = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (!isValidEmail(email)) {
      toast('Please enter a valid email address.', 'error')
      return
    }
    setLoading(true)
    setSuggestedEmail(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      })
      if (!res.ok) {
        // Surface backend validation (e.g. 422 "You are already subscribed.").
        const data = (await res.json().catch(() => ({}))) as {
          message?: string
          errors?: { email?: string[] }
          suggested_email?: string | null
        }

        setSuggestedEmail(data.suggested_email ?? null)
        toast(data.errors?.email?.[0] ?? data.message ?? COPY.newsletter.error, 'error')
        return
      }
      // The API reports whether a verification email is actually going out
      // (`email_sent` mirrors the site's newsletter_emails_enabled switch).
      // Telling someone to watch their inbox — and dig through spam — for mail
      // this site is not sending would be a worse failure than not collecting
      // the address at all.
      const { email_sent: emailSent } = (await res.json().catch(() => ({}))) as { email_sent?: boolean }

      // Keep the form in place; confirm via a top-corner toast.
      toast(emailSent === false ? COPY.newsletter.successNoEmail : COPY.newsletter.success, 'success')
      setEmail('')
    } catch {
      toast(COPY.newsletter.error, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={compact ? `min-w-0 ${className}`.trim() : `flex flex-wrap items-center justify-between gap-4 ${className}`.trim()}>
      {/* The strip's introduction. The compact form drops it: see above. */}
      {!compact && (
        <div className="min-w-0 flex-[1_1_360px]">
          <p className="font-display text-[20px] leading-tight text-ink">{COPY.newsletter.title}</p>
          {/* 14px on a phone, 13px from `sm` up. Below `lg` this strip is the
            ONLY subscribe path on the site (the header pill drops its form),
            so the line that explains what you get has to clear the project's
            14px phone readability floor — which the globals.css rule only
            raises for `.text-xs`, not for a literal size. */}
        <p className="mt-1 text-sm text-ink-soft sm:text-[13.5px]">{COPY.newsletter.subtitle}</p>
        </div>
      )}

      <div className={compact ? 'w-full min-w-0' : 'w-full min-w-0 flex-[0_1_420px]'}>
        {/* Field and button share one row at every width, as in the mockup;
            `min-w-0` lets the field give way so the button never wraps. */}
        <form
          onSubmit={onSubmit}
          // The bar mode draws ONE pill around both controls — the mockup's
          // `.hsub` — and lights its border red while anything inside has
          // focus. The band mode keeps them as two separate shapes.
          // THE BAR FORM IS A ROW AT EVERY WIDTH, where the band's stacks on a
          // phone. The bar sits at the very top of every page, so stacking it
          // spends ~56px of the first screen on a signup nobody arrived for —
          // and it does not need the height: the field gives way (`min-w-0`
          // plus `flex-1`) and the key tightens its padding, which is exactly
          // what the mockup does at 440px rather than breaking the row. The
          // band has a whole section to itself and can stack.
          className={
            onBar
              ? 'relative flex flex-row gap-2'
              : 'relative flex flex-col gap-2.5 min-[26rem]:flex-row'
          }
          aria-label={`${COPY.newsletter.title} ${COPY.newsletter.subtitle}`}
        >

          {/* HONEYPOT. Never shown, never focusable, never autofilled — a human
              cannot reach it, a naive bot fills every field it finds. The server
              rejects any request that carries a value, before the site is
              touched and long before a paid validation credit could be spent.
              Positioned off-screen rather than display:none, which some bots
              skip. */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            // Hidden by an INLINE STYLE, deliberately not by a Tailwind class.
            // The class was a real bug: utility CSS can load late, fail, or be
            // purged, and for as long as it is missing this renders as an
            // ordinary focusable text input sitting in the middle of the
            // subscribe form. A person who types into it gets their signup
            // rejected as a bot — an anti-bot measure silently turning away the
            // humans it exists to protect. An inline style travels inside the
            // HTML, so it cannot desync from the markup that carries it.
            //
            // Still off-screen rather than display:none or the hidden
            // attribute: a honeypot only works while a bot believes the field
            // is real, and the obvious ways of hiding it are the ways a bot
            // checks for. pointer-events:none means that even a rendering
            // accident cannot let a human click into it.
            style={{
              position: 'absolute',
              left: '-9999px',
              width: 1,
              height: 1,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={COPY.newsletter.placeholder}
            aria-label={COPY.newsletter.placeholder}
            autoComplete="email"
            // 48px in BOTH tones. `compact` means "no intro", not "small":
            // the sibling sites shrink the field to 42px for a header pill,
            // and 42px is under the 44px tap target.
            // `flex-1` IS BREAKPOINT-PREFIXED, and that is load-bearing.
            // The band form is `flex-col` on a phone and only becomes a row
            // further up. `flex-1` is `flex: 1 1 0%`, and flex-basis applies
            // to the MAIN axis — so in column mode it zeroed the field's
            // HEIGHT, and the `h-12` beside it lost: the subscribe field
            // shipped 22.5px tall on a phone, half its size and half the tap
            // target. In row mode it is still needed, or `w-full` takes the
            // whole line and pushes the key out. So it applies only from the
            // width the form actually becomes a row.
            //
            // The focus ring is an OUTLINE rather than a border-colour change:
            // every control on this page rests on a 1px hairline, and swapping
            // that hairline's colour is the smallest possible change to make
            // on focus. The mockup does the same — 2px gold on the bar
            // (`.hsub input:focus{outline:2px solid var(--gold)}`), blue on
            // the page (`.country select:focus`) — and the ring takes the
            // colour that is visible on each ground: gold is 10.20:1 on the
            // navy and 1.46:1 on the band, so the band's ring is the brand
            // orange at 5.48:1 instead.
            //
            // 10px corners, not a pill. The mockup's `.hsub input` is
            // `border-radius: 10px`, and a pill here would be the third
            // unrelated use of the shape that carries the offer capsules.
            className={
              onBar
                ? 'h-12 w-full min-w-0 flex-1 rounded-[10px] border border-night-control bg-navy-2 px-[14px] text-[14.5px] text-paper placeholder:text-night-faint focus:outline-2 focus:outline-offset-1 focus:outline-accent'
                : 'h-12 w-full min-w-0 min-[26rem]:flex-1 rounded-[10px] border border-line-strong bg-paper px-[14px] text-[15px] text-ink placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand'
            }
          />
          <button
            type="submit"
            disabled={loading}
            // GOLD on the navy bar (the mockup's own `.btn-gold` there), the
            // deep orange on the band. Ink on gold is 10.20:1, which is the
            // strongest pair in the palette and the reason the bar can carry
            // the loudest control on the site without shouting; on the gold
            // TINT of the band that same gold would be 1.06:1 against its
            // ground, so there the key is the orange instead.
            //
            // `btn-r10` gives 10px corners to match the field beside it: a
            // 14px key beside a 10px field at the same height is a mismatch
            // you can see even when you cannot name it. It is an UNLAYERED
            // class and not `rounded-[10px]` on the element, because the
            // button classes are unlayered too and a Tailwind utility loses to
            // them silently — which is exactly what the utility here did.
            className={
              onBar
                ? 'btn-on-dark btn-r10 h-12 shrink-0 whitespace-nowrap px-3 text-[14.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 min-[27.5rem]:px-[18px]'
                : 'btn-or btn-r10 h-12 shrink-0 whitespace-nowrap px-[18px] text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60'
            }
          >
            {loading ? COPY.newsletter.checking : COPY.newsletter.button}
          </button>
        </form>

        {/* One click swaps the address in and resubmits. The corrected address
            is a DIFFERENT cache key upstream, so it gets its own validation
            call rather than reusing the typo's verdict. */}
        {suggestedEmail && (
          <p className="mt-2 text-sm text-ink-soft">
            Did you mean{' '}
            <button
              type="button"
              onClick={() => { setEmail(suggestedEmail); setSuggestedEmail(null) }}
              className="font-semibold underline underline-offset-2"
            >
              {suggestedEmail}
            </button>
            ?
          </p>
        )}
      </div>
    </div>
  )
}
