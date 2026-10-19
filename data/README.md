# XtraSpain data files

This folder is the single source of truth for all visa requirements, consulate data, and product URLs on xtraspain.com.

**Never hard-code visa requirements, income thresholds, or consulate details directly in HTML.** All of that lives here so it can be updated in one place.

---

## Files

| File | What it contains |
|---|---|
| `requirements.json` | Visa requirements (DNV, NLV), consulate list, city arrival info |
| `site-config.json` | Product URLs, form IDs, legal info, analytics config |
| `affiliates.json` | Affiliate partner data |

---

## How to update a visa requirement

1. Open `requirements.json` in any text editor.
2. Find the field you want to update (e.g. `visas.dnv.incomeMonthlyEUR.value`).
3. Change the value.
4. **Important:** update `"lastReviewed"` at the top to today's date (format: `YYYY-MM-DD`).
5. Change `"status": "TODO-VERIFY"` to `"status": "verified"` on the field you just confirmed.
6. Save the file.
7. Run `npm run generate` in your terminal (from the root of the repo).
8. Check the generated pages look right, then commit and push.

## How to add a consulate

1. Copy an existing consulate entry in `requirements.json` > `consulates`.
2. Fill in the fields. Leave anything you're unsure about as `""` and set `"status": "TODO-VERIFY"`.
3. Run `npm run generate`.
4. The new consulate pages will be created automatically. Pages with `TODO-VERIFY` status get `noindex` until you mark them verified.

## How to run the generator

```bash
npm run generate
```

This runs `scripts/generate.mjs` and:
- Creates/updates all pages under `requirements/` and `arrival/`
- Regenerates `sitemap.xml`
- Creates `llms.txt`

Requires Node.js 18+. Run once after any change to `requirements.json`.

## Status values

- `"verified"` — Alisa has confirmed this is correct and current.
- `"TODO-VERIFY"` — placeholder, not yet confirmed. Pages using only unverified data get `noindex` and are excluded from the sitemap.

## Placeholder URLs

All product and affiliate URLs in `site-config.json` and `affiliates.json` are marked `TODO-PLACEHOLDER`. Replace them before launch. Do not share these files publicly if this repository is public.
