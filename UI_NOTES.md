# UI_NOTES.md — Cycle Price Configurator

## 1. What is the most important thing on the configurator screen?

**The grand total.** Everything else supports it. The salesperson is talking to a customer who wants one number — "how much does this cycle cost?" The total is displayed in large, bold text inside a highlighted box at the bottom of the results. It uses the ₹ symbol and Indian number formatting (e.g. ₹4,580, not ₹4580) so it matches what the salesperson is used to seeing.

The component breakdown matters too — but it's secondary. It helps the salesperson explain *why* the price is what it is ("the wheels are ₹1,180 because of the tubeless tyres").

---

## 2. How did the UI make repetitive use fast and easy?

Three decisions specifically support fast, repeated use:

**a. Checkboxes, not text input.**
The salesperson picks parts by clicking — she never has to type. There's no risk of typos producing errors.

**b. Parts are grouped by component.**
Instead of a flat list of 15 parts, parts are shown in five sections (Frame, Handle Bar & Brakes, Seating, Wheels, Chain Assembly). This matches how a salesperson thinks about a cycle — "I need a frame, then brakes, then tyres…" rather than scrolling alphabetically.

**c. Visual selected state.**
Selected parts get a highlighted border and a blue tint. The salesperson can scan at a glance which parts are selected, rather than re-reading each checkbox. A live count ("5 parts selected") also provides quick reassurance.

**d. Date defaults to empty, not today.**
Pricing is date-sensitive. Pre-filling today's date might cause the salesperson to forget to change it for a backdated quote. Requiring an explicit date choice prevents this mistake.

---

## 3. What happens for an invalid part combination?

**Specific warning: Tubeless tyre without a rim.**
If the salesperson ticks `Tubeless Tyre` but hasn't ticked `Standard Rim`, a yellow warning banner appears inline, below the parts list:

> ⚠️ Tubeless Tyre requires a Standard Rim. Please add the rim to your configuration.

The warning appears immediately on selection — no need to click Calculate first. It disappears as soon as the rim is added.

The salesperson can still click Calculate with this combination (the backend will still return a price). The warning is advisory, not blocking — in practice a salesperson might be quoting just the tyre separately, and hard-blocking would be more frustrating than helpful.

For API errors (e.g. an invalid date with no price range), the error is shown in a red banner below the part list, in plain English — not as a stack trace or JSON blob.

---

## 4. One thing to improve with more time

**Real-time price preview as parts are selected.**

Currently the salesperson must click "Calculate Price" to see the total. With more time, I'd show a live running total that updates as each checkbox is ticked — like a shopping cart. This would make the tool feel more interactive and let the salesperson quickly experiment with swapping parts (e.g. "does upgrading to disc brakes push the price over ₹6,000?") without having to re-submit each time.

This would require either debounced API calls on every selection change, or moving the pricing logic into the frontend (with the date-resolved prices pre-fetched).
