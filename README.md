# Aerobridge Website

The public marketing site for [aerobridge.cl](https://aerobridge.cl).

## Source of truth

Do not edit the generated HTML pages directly. All ten pages, navigation, footer, contact settings, program copy, country-pack copy and SEO metadata are defined in `scripts/build-site.mjs`.

The generator mirrors the canonical product catalog in the sibling dashboard repo at `../aerobridge/src/lib/programs.ts` and `../aerobridge/src/lib/countryPacks.ts`. The checker fails when the current program count, Chile-only country scope, verification date or Aviation English lesson counts drift.

```sh
node scripts/build-site.mjs
node scripts/check-site.mjs
```

Shared behavior and presentation live in:

- `assets/site.css`
- `assets/site.js`

The consultation page intentionally hands a drafted request to WhatsApp. It does not claim live availability, create bookings or promise a meeting link because no booking API is currently deployed.

## Local preview

```sh
node scripts/serve.mjs
```

Open `http://127.0.0.1:8124` and check the desktop and mobile layouts before deploying.
