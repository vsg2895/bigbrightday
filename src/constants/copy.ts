/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are deliberately unique to this site. That is not decoration: the
 * brands are separate domains serving the same catalogue, and if they shipped
 * the same titles, descriptions and headings, Google would treat them as
 * duplicate content and suppress all but one. Every string that reaches a
 * <title>, a meta description, an <h1>/<h2> or a JSON-LD field must therefore
 * read differently here than on the sibling sites.
 *
 * bigbrightday's angle: CAN YOU READ IT IN ONE GO? Not whether the terms are
 * hidden, and not what they cost — whether one person can read an operator's
 * bonus terms once, straight through, and come away knowing what they agreed
 * to. That is a property of the WRITING, and it is the one thing nobody
 * ranks: a 35x wagering requirement stated plainly on the page carrying the
 * offer is better news than a 20x spread across four documents, a footnote and
 * a figure that contradicts the banner above it. An operator that needs you to
 * cross-reference three pages to find its multiplier scores badly here even
 * when the multiplier itself is generous.
 *
 * Its siblings answer the neighbouring questions — affliliate decodes an offer
 * in MONEY, slottering reads the SLOT rules, bettingbetway ranks CASINOS on
 * their terms, bonanzasmile names the CATCH, gladjackpot asks how the money
 * gets OUT, luckycatsmile argues LUCK IS THE WRONG WORD, spinsunny moves the
 * small print INTO DAYLIGHT, starspinly puts every operator on ONE SCALE,
 * rollofjoy counts what an offer costs you in EVENINGS — and none of them may
 * be echoed. Every one of those is about what the terms SAY. This one is about
 * whether they can be read at all, which is the only question none of them
 * asks.
 *
 * Note how close spinsunny sits and how different it is: spinsunny's claim is
 * that the small print should be brought OUT of the dark, which is about where
 * a figure is PUT. This site's claim is that a figure you can find is still no
 * use if understanding it takes four documents and a second reading. One is
 * about disclosure; this one is about legibility. The wording must never drift
 * into "nothing hidden" territory, which is spinsunny's sentence.
 *
 * ── Three lines this file does not cross ────────────────────────────────────
 * 1. The mockup's lead says "we sign up, deposit, play and cash out at every
 *    casino we list", its chip says "reviewed in broad daylight, every week",
 *    its offers section promises "terms you can read in one go" as a fact
 *    about the offers themselves, and its FAQ promises "the times we
 *    observed". NONE OF IT SHIPS, in any wording: nothing in this project
 *    records a funded account, a played bonus or a timed withdrawal, and a
 *    review site inventing its own test results is the one failure that cannot
 *    be walked back. Legibility is read from PUBLISHED PAGES — how many of
 *    them, how they are written, whether they agree with each other — which
 *    needs no account and is checkable by anyone. That is what the copy says,
 *    and it is why this angle can be honest where the mockup's cannot.
 * 2. The mockup also sells "casinos and sportsbooks". The API serves casinos,
 *    so every line here says casinos.
 * 3. The mockup prints a "Min. deposit" and an "Avg. payout time" per casino,
 *    per picks row and in the review glance. There is no column for any of
 *    them, so no wording promises one; those slots carry the rating and the
 *    regions, which are real.
 */
export const COPY = {
  // SEO identity. These three reach the <title>, the meta description and the
  // keywords tag on EVERY page that does not set its own — which is most of
  // them — so they are the strings most likely to be read as duplicate content
  // if a sibling domain ships the same words.
  site: {
    titleTail: 'Bright Casinos, Clear Bonuses',
    description:
      'ranks casinos on how readable their bonus terms are — how many pages it takes to find the wagering, whether the figures agree with the banner, and whether one reading is enough.',
    keywords: [
      'casino bonus terms explained',
      'clear casino bonus terms',
      'casino wagering requirements compared',
      'casinos with readable terms',
      'licensed online casinos reviewed',
    ],
  },
  nav: {
    casinos: 'Casinos',
    // The page lists every visible bonus, flat and ungrouped, so the menu says
    // what is behind it. winpalack keeps "Special Offers": its page is the
    // grouped bonus-area view and is a different thing.
    specialOffers: 'Bonuses',
    categories: 'Categories',
    // First row inside the header and footer dropdowns: the parent's own page.
    allCasinos: 'All Casinos',
    allOffers: 'All Offers',
  },
  home: {
    // TWO WORDS, deliberately. `SectionHead` colours a heading's last word, so
    // a one-word heading goes entirely orange — 60px of solid #B53C00, which
    // out-shouts the hero. The mockup's own heading here is "Bright Bonuses".
    bonus: 'Bright Bonuses',
    // The line under the Bonuses heading. The mockup's is "offers with terms
    // you can read in one go", which is a promise about offers this site does
    // not write — so the line says what is actually on the card: the figure,
    // and where it was read from.
    bonusesSubtitle: 'Each one with the figure that decides it, quoted from the page it was published on.',
    seeMore: 'See more',
    seeAllBonuses: 'See All Bonuses',
    /**
     * The VISIBLE heading over the bonus-type row.
     *
     * The row used to carry no heading at all — the chips were taken to
     * speak for themselves. They do not: arriving mid-page at a band of
     * unlabelled buttons between the hero and the casino list, there is
     * nothing saying what the set IS, and nothing a screen reader can
     * announce for the landmark beyond a generic label nobody wrote for
     * this page.
     *
     * Worded differently on every domain, like every other <h2> here:
     * eleven sites serve one catalogue, and a shared heading is
     * duplicate content.
     */
    bonusTypesTitle: 'Browse by bonus type',
    // The mockup's eyebrow is "Reviewed in broad daylight, every week". The
    // review half is not ours to claim, so this keeps the half that is: the
    // published terms are re-read on a weekly pass, and that is what the dot
    // beside it stands for.
    heroEyebrow: 'Terms re-read every week',
    // Split in three so the JSX can colour the middle phrase — the mockup's
    // own `Make it a <span class="s">big bright</span> day.`, which is why the
    // tail carries the full stop and the highlight does not.
    heroHeadline: 'Make it a',
    heroHighlight: 'big bright',
    heroHeadlineTail: 'day.',
    heroSubtitle:
      'A 35x wagering requirement printed on the page carrying the offer is better news than a 20x spread over four documents and a footnote. So we rank casinos on whether their bonus terms can be read once, straight through — how many pages it takes to find the figure that decides an offer, and whether those pages agree with each other and with the banner.',
    // The head of the picks card, and the line under it. The mockup's own
    // "Today's top 3", with the badge beside it carrying the live dot.
    podiumBadge: 'Updated weekly',
    podiumTitle: 'Today’s top 3',
    // The mockup's own line is "☀ Updated", which claims a freshness this page
    // cannot date. This says what the list IS instead: the top of the current
    // ranking.
    podiumSubtitle: 'The three highest-placed casinos in this week’s ranking.',
    // The label over the picks card's right-hand column. The mockup's is
    // "Min. deposit"; nothing in the API holds one, so the slot carries the
    // rating.
    podiumRatingLabel: 'Rating',
    podiumAll: 'See the whole ranking',
    topCasinosTitle: 'Casinos you can read in one go',
    topCasinosSubtitle: 'Ranked on how legible each operator’s own bonus terms are — where the deciding figure sits, and whether its pages agree. Filter by category.',
    featuredCasinos: 'See top casinos',
    specialOffers: 'Browse bonuses',
    viewAll: 'View all',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Online Casinos Ranked On How Clearly They Write Their Bonus Terms',
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'What we read, what we will not claim, and how a casino earns a bright day.',
    metaDescription:
      'Online casinos ranked on the readability of their own bonus terms — how many pages it takes to find the wagering figure, and whether the terms, the cashier and the banner agree.',
    // ── The "How a casino earns its place" band ───────────────────────────
    // Three steps, numbered, because they ARE a sequence: each one happens
    // after the one before it. Numbering a set that is not ordered is
    // decoration; numbering this one is information.
    methodTitle: 'How a casino earns a bright day',
    methodSubtitle: 'Three questions, asked of every operator’s published pages in the same order.',
    methodSteps: [
      {
        no: '01',
        verb: 'Find it',
        title: 'How far away the deciding figure is',
        body:
          'Every bonus turns on one number — the wagering multiplier and what it applies to. So the first question is simply how many clicks separate that number from the banner advertising the offer. On the promo page itself is one. Behind a "full terms apply" link is two. In a general terms document that covers every promotion the site has ever run is worse than three, because then you also have to work out which clause is yours.',
      },
      {
        no: '02',
        verb: 'Read it',
        title: 'Whether one reading is enough',
        body:
          'Then the sentence itself. Does the multiplier apply to the bonus, the deposit, or both — and does it say so, or does it leave you to infer it? Are the excluded games listed, or described? Is the maximum stake while clearing a figure or a phrase? Any clause that two careful readers could take two different ways counts against an operator here, whatever the number inside it turns out to be.',
      },
      {
        no: '03',
        verb: 'Check it',
        title: 'Whether its own pages agree',
        body:
          'Last, the cross-check: the banner against the promo terms, the promo terms against the general terms, and all three against what the cashier page says about withdrawals and verification. Where they disagree, the operator is told something is wrong before it is ranked — and where they disagree about the figure a reader would act on, nothing else about the offer makes up for it.',
      },
    ],
    methodLabel: 'How it works',
    // Under the three stages: the cycle closes back on the first.
    methodLoop: 'And round again whenever an operator rewrites a page',
    // ── The hero monitor: what one pass covers ──────────────────────────
    // The same things the FAQ and the method name — no figure this site does
    // not hold. Kept in the shared key structure though this design has no
    // monitor panel; see the file header.
    monitorTitle: 'What each pass covers',
    monitorStatus: 'Weekly',
    monitorReads: [
      { label: '01 · Find it', text: 'How far the wagering figure sits from the offer' },
      { label: '02 · Read it', text: 'Whether the clause can be taken two ways' },
      { label: '03 · Check it', text: 'Whether the terms, cashier and banner agree' },
    ],
    monitorNote: 'Lapsed bonuses come off the list. A casino moves when its own pages move.',
    rankingLabel: 'The daily ranking',
    bonusTypesKicker: 'Pick your perk',
    bonusesLabel: 'Day passes',
    faqLabel: 'Clear answers',
  },
  casinos: {
    pageTitle: 'Every Casino We Read',
    pageDescription:
      'The full list, each casino shown with the bonus it is running and where it lands once the readability of its own terms is counted.',
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Bonuses Running Here',
    // Tail of the summary-panel H2: `{casino.name} at a glance`.
    glanceHeadingTail: 'at a glance',
    moreHeading: 'Other bright days',
    reviewTitleTail: 'Bonus Terms, Wagering And Licence',
    reviewSignature: 'Every figure here quoted from this operator’s own terms and cashier pages.',
    reviewSummary: 'with the figures a reader would act on — the wagering and what it applies to, the withdrawal window, the caps and the regulator — quoted from the operator’s own pages rather than its banner.',
    // The ribbon on the leading casino card. A WORD, not a numeral: the list
    // order already is the ranking, and a "1" on every card invites reading it
    // as a score. The mockup's own "Brightest pick".
    topPick: 'Brightest pick',
    visitCasino: 'Open Casino',
    readReview: 'Review',
    rating: 'Bright score',
    noResults: 'No casinos match this filter yet. Try another category.',
  },
  /**
   * The page behind one bonus type (/bonuses/[slug]).
   *
   * `metaSuffix` is appended to the type's name when the admin wrote no
   * description, so the meta line is still specific to the page rather than
   * boilerplate shared by eight of them.
   */
  bonusCategory: {
    metaSuffix: 'every bonus of this kind running right now, with whose offer it is and the figure that decides it, read from the page it was published on.',
    countOne: 'offer',
    countMany: 'offers',
  },

  specialOffers: {
    pageTitle: 'Bright Bonuses',
    pageDescription:
      'Every bonus in one place, each with the casino behind it and the figure that decides it — the wagering, the cap and the expiry, wherever the operator states them.',
    // Appended to an offer's (shared) bonus text so the sibling sites do not
    // ship an identical meta description for the same offer.
    offerMetaSuffix: 'Read from the operator’s own terms page before it went on the list.',
    claim: 'Claim Bonus',
    noResults: 'No bonuses to show right now.',
  },
  categories: {
    pageTitle: 'Casinos By Category',
    pageDescription: 'The same three questions behind every list — pick the category you came for.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the nine sites distinct there.
    categoryMetaSuffix: 'ordered on how clearly each operator writes its own bonus terms — where the deciding figure sits, how it is worded, and whether its pages agree.',
    noResults: 'Nothing to show here yet.',
  },
  newsletter: {
    title: 'Morning Brief.',
    subtitle: 'One email a week: which casinos moved, and whose terms moved under them.',
    placeholder: 'Your email address',
    button: 'Subscribe',
    // The two halves of the line beside the TOP BAR's field — the mockup's
    // own "Morning Brief: new casinos and bright bonuses, every Monday."
    // Split so the lead can take the gold while the rest stays readable.
    barLead: 'Morning Brief:',
    barTail: 'new casinos and bright bonuses, every Monday.',
    // The gold-tint band above the footer — the site's second capture point,
    // so its heading is a real <h2> rather than the form's own label.
    bandTitle: 'A brief every Monday.',
    bandSubtitle: 'New reviews, the bonuses whose terms actually read straight, and every change we found in an operator’s small print — one short email, no filler.',
    // Shown while the address is being checked. The subscribe request waits on
    // a live address-validation call, so the button has to say so rather than
    // just dimming for a second or two.
    checking: 'Checking…',
    // The spam line is NOT optional wording. This is a double opt-in list: an
    // unconfirmed subscriber never receives anything again, and the verify mail
    // is the single most likely message to be filtered — new sender, one link,
    // no history. Telling people where to look is the difference between a
    // signup and a dead row.
    success:
      'Nearly there — check your inbox and confirm your address to finish. '
      + 'If nothing arrives, it may be sitting in spam or junk.',
    // Shown when the API reports email_sent=false — the site is still
    // collecting addresses but its sending is switched off in the admin.
    // Promising an inbox (and a spam folder to search) for mail that will
    // never arrive is worse than not collecting the address at all.
    successNoEmail:
      'You’re on the list. We are not sending confirmation emails from this site at the moment.',
    error: 'That did not send. Please try again.',
  },
  footer: {
    // Short brand blurb in the footer's first column. The mockup gives that
    // column 1.6fr of a four-track grid — roughly 360px — so this runs to two
    // or three lines there by design, unlike the two-column siblings where the
    // same string had to stay on one.
    tagline:
      'Independent casino reviews and rankings, measured on how clearly each operator writes its own bonus terms rather than on the size of the offer. We may earn a commission from links on this site; it never changes a score or a position.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    //
    // Supplied 2026-11-23, and written to this site's `registered_address`
    // in the same change (`php artisan sites:set-legal-identity <slug>
    // --address=...`). THE TWO MUST STAY IDENTICAL: that column is what the
    // legal pages and the email templates print, and two different addresses
    // for one brand is a compliance problem, not a typo. The footer omits the
    // whole <address> element while this is blank.
    postalAddress: '8 Willowbrook Road, Bath, BA1 5TN, United Kingdom',
    disclaimer:
      'Gambling is for adults aged 18 or over and carries real financial risk. Set deposit limits, never chase losses, and only stake what you can afford to lose.',
  },
  errors: {
    notFound: 'That page is not here.',
    apiError: 'Could not load this content. Please try again in a moment.',
  },
  reviews: {
    heading: 'What Players Report',
    empty: 'No reports yet — be the first to say how it read.',
    formTitle: 'Add Your Report',
    formIntro: 'Your report appears on this page as soon as you post it.',
    nameLabel: 'Your name',
    emailLabel: 'Email (optional, never published)',
    ratingLabel: 'Rating',
    titleLabel: 'Headline (optional)',
    bodyLabel: 'Your report',
    namePlaceholder: 'First name or nickname',
    emailPlaceholder: 'you@example.com',
    titlePlaceholder: 'One line on whether the terms held up',
    bodyPlaceholder: 'What did the terms say, and did the site stick to them?',
    submit: 'Post Report',
    // Two outcomes, because the site can run pre- or post-moderation
    // (Sites -> Publish reviews immediately). The API reports which one
    // applied; promising the wrong one is a promise the page then breaks.
    success: 'Thanks — your report is now live. Scroll up to see it.',
    successPending: 'Thanks — your report has been submitted and will appear once approved.',
    error: 'That did not send. Please check the form and try again.',
    ratingSummary: (avg: number, total: number) =>
      `${avg.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'report' : 'reports'}`,
  },
  // Labels on the phone-only hide / show toggle above each chip list.
  collapse: {
    casinoCategories: 'Casino categories',
    bonusTypes: 'Bonus types',
  },
} as const
