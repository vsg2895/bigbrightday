/**
 * Frequently asked questions for this site.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data from
 * this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. Here they
 * argue one thing — that a bonus figure you cannot find, or cannot read the
 * same way twice, is not an offer but a puzzle, so the thing worth ranking is
 * how legibly an operator writes its own terms. Its siblings answer the
 * neighbouring questions (affliliate: what an offer is worth in money;
 * slottering: the slot rules; bettingbetway: which casino to trust;
 * bonanzasmile: the catch in a bonus; gladjackpot: how the money gets out;
 * luckycatsmile: that luck is the wrong word; spinsunny: when you get to read
 * the small print; starspinly: one scale for every operator; rollofjoy: what an
 * offer costs you in evenings) and none of them may be echoed.
 *
 * The closest sibling is spinsunny and the difference is the whole point:
 * spinsunny asks whether a figure is DISCLOSED, this one asks whether a
 * disclosed figure can be UNDERSTOOD. Never write "nothing hidden" here.
 *
 * NOTHING BELOW CLAIMS A FIGURE THIS SITE CANNOT SHOW. The mockup's FAQ opens
 * with "we open real accounts, deposit, claim the bonus and request a
 * withdrawal" and closes with "we publish the times we observed". Neither
 * ships, in any wording: nothing in this project records a funded account or a
 * timed payment. The second question below is asked precisely so the answer can
 * say so outright, and the last-but-one answers the payout question honestly,
 * by naming whose commitment the figure actually is.
 */
export const FAQ_ITEMS = [
  {
    question: 'How do you rank casinos?',
    answer:
      'On how readable the operator’s own bonus terms are. Three questions decide it, asked of every casino in the same order: how far the deciding figure sits from the offer advertising it — on the promo page, behind a link, or buried in a general terms document covering every promotion the site has run; whether one reading is enough — does the multiplier say what it applies to, are the excluded games listed or merely described, is the maximum stake a figure or a phrase; and whether the operator’s own pages agree with each other and with the banner. A casino whose terms read straight ranks above one with a louder number.',
  },
  {
    question: 'Do you actually play at these casinos?',
    answer:
      'No, and we will not print a figure we did not read somewhere you can read it too. Everything here comes from what the operator publishes — the promo page, the terms, the cashier page, the licence register — and is quoted so it can be checked against the source. That is not a limitation of this approach, it is the approach: a site that claims its own deposits and withdrawals is asking to be believed about the one thing nobody can verify, and readability is the rare thing anyone can check for themselves in about five minutes.',
  },
  {
    question: 'Why rank on how the terms are written rather than what they say?',
    answer:
      'Because what they say is only useful once you have found it and understood it, and most people never get that far. A 35x requirement stated plainly on the page carrying the offer is better news than a 20x spread over four documents, a footnote and a figure that contradicts the banner above it: with the first you know what you agreed to, with the second you find out on the day you try to withdraw. The number is what the offer costs. The writing is whether you knew.',
  },
  {
    question: 'What makes one set of bonus terms harder to read than another?',
    answer:
      'Distance, ambiguity and disagreement. Distance is how many clicks separate the wagering figure from the banner. Ambiguity is any clause two careful readers could take two ways — "30x wagering" without saying whether that is the bonus or the deposit plus the bonus is the common one, and it is the difference between two obligations. Disagreement is when the promo page, the general terms and the cashier page do not say the same thing, which also tells you which one was last updated. Any of the three is enough to cost a casino its place here.',
  },
  {
    question: 'Are the bonuses really worth it?',
    answer:
      'Sometimes, and you can only tell once the terms are legible — which is the argument of this whole site. What we can do is put the figure that decides it next to the offer, quoted from where the operator published it: the multiplier and what it applies to, the cap, and how long you have. Read those three before you claim anything. If an operator makes that hard, treat the difficulty itself as information about the offer.',
  },
  {
    question: 'How quickly can I withdraw a win?',
    answer:
      'That depends on your method and your verification status, and we do not publish timings of our own because we have not measured any. What we do publish is what the operator commits to in writing on its own cashier page, and whether the promo terms and the cashier agree about it — because a withdrawal window stated in two places with two different numbers is the clearest signal there is that neither has been checked lately.',
  },
  {
    question: 'Which casinos are licensed?',
    answer:
      'Every casino listed here holds a gaming licence, and each review names the regulator so the claim can be checked on that authority’s own register rather than taken on trust. A licence matters most for the thing this site is about: licensed operators are required to publish their terms and to apply them as written, and in most jurisdictions there is a free dispute service that can rule on whether they did.',
  },
  {
    question: 'Do you earn money from these links?',
    answer:
      'Yes. We may earn a commission when someone signs up through a link on this site, and that is how it is funded. It does not buy a position: every operator is read the same three ways, and a casino that rewrites its terms into something murkier slides down the list whether or not it pays us.',
  },
] as const
