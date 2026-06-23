# voidultr4 Portfolio

A fast, GitHub Pages-friendly portfolio for `voidultr4`, built with plain HTML, CSS, and vanilla JavaScript.

## Files

- `index.html` controls the page structure and main content sections.
- `styles.css` contains the dark void-blue visual system, responsive layout, and animations.
- `script.js` contains editable project data, project search/filter behavior, the mobile navbar, and the live Discord widget.
- `icon.svg` is the browser tab/app icon.

## Customize

### Projects

Edit the `projects` array near the top of `script.js`.

Each project supports:

- `title`
- `category`: `web`, `tools`, or `other`
- `description`
- `tags`
- `url`
- `source`
- `keywords`
- `icon` or `iconType`

### Discord Presence

The Discord card uses the public Lanyard API:

```js
const DISCORD_USER_ID = "1375722019039084554";
```

To use a different account, replace that value in `script.js` with the numeric Discord user ID. The account must be available through Lanyard for live status data to appear.

### Contact Links

Edit the GitHub, email, Discord, guns.lol, Instagram, and YouTube links in `index.html` under the Contact section and footer.

## Local Preview

Open `index.html` directly in a browser, or run any simple static server from this folder.

Example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

Push these files to the GitHub repository used for GitHub Pages. For a user site, the repository is usually named:

```text
voidultr4.github.io
```

GitHub Pages will serve the site automatically from the repository root when Pages is enabled.
