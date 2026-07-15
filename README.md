# adams.land
[![Netlify Status](https://api.netlify.com/api/v1/badges/5d4e7ace-10f1-4c75-a62c-dd06bf947090/deploy-status)](https://app.netlify.com/sites/adamsland/deploys)

Welcome to Adams Land! This site is quickly becoming what I've always wanted this website to become. I hope you enjoy visiting!

Visit: [Adams Land](https://adams.land)

![proudly-under-construction-since](https://user-images.githubusercontent.com/68540487/133911402-15c9f2fe-7e04-4465-ad8b-d75132b3ea7c.gif)

## Dev

```bash
npm install
npm run dev
```

Astro serves the site locally (usually `http://localhost:4321`).

```bash
npm run build    # writes production output to dist/
npm run preview  # serve the production build locally
```

For Netlify functions and dashboard env vars locally:

```bash
netlify dev
```

That runs on `localhost:8888` and uses the Netlify build/publish settings in `netlify.toml`.

### Toy Box images JSON

When you add image folders for the Toy Box, regenerate `public/images.json` from the repo root:

```bash
python3 img-json.py \
  public/img/tiny-pixels \
  public/img/medium-pixels \
  public/img/animals \
  public/img/collection \
  public/img/plants \
  public/img/stamps \
  public/img/banners-dividers \
  public/img/blinkies
```

Add any new folders you want included to that command.

### Other scripts

```bash
npm run osu:poll
npm run osu:grid
```
