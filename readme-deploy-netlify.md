# Deploy this site to Netlify

This folder contains a static website (Mobirise HTML/CSS/JS). You can deploy it to Netlify directly from VS Code using the Netlify extension or the Netlify CLI.

## Option A — VS Code Netlify extension (easiest)

1) Open this folder in VS Code: `/Users/sebu/Desktop/AeroBridge/Websites`
2) Open the Netlify panel (Activity Bar) and sign in when prompted.
3) Click "Create a new site" (or "Link to existing" if you already created one on netlify.com).
4) For "Site folder" select this folder (the one that contains `index.html`).
5) Deploy: use the Deploy action in the Netlify panel. The `netlify.toml` already sets the publish directory to `.`

Notes:
- Subsequent deploys will publish everything inside this folder.
- Static assets in `/assets/*` are cached aggressively via headers set in `netlify.toml`.

## Option B — Netlify CLI (local terminal)

If you prefer the CLI:

- Install CLI (one-time):
  - macOS (Homebrew): `brew install netlify-cli`
  - or Node.js/npm: `npm install -g netlify-cli`
- In a terminal at this folder, run:
  - `netlify login` (opens a browser for auth)
  - `netlify init` (create or link a site; publish directory = `.`)
  - `netlify deploy --prod` (production deploy)

## Option C — Git-based Continuous Deployment

1) Initialize a git repo in this folder and push to GitHub/GitLab/Bitbucket.
2) In Netlify, create a new site from your repo and choose the root as the publish directory `.`
3) Every push to the main branch will deploy automatically.

### Recommended files
- `netlify.toml` — points Netlify to the correct publish folder and sets cache headers.

### Troubleshooting
- 404s after deploy: ensure `publish = "."` in `netlify.toml` and that `index.html` is at the root.
- Mixed content/HTTPS errors: make sure all asset URLs are relative or https.
- Large images slow: consider optimizing assets in `/assets/images`.
