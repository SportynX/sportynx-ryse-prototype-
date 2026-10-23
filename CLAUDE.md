# SportynX RYSE — onboarding prototype

Live (GitHub Pages, auto-deploys on every push to `main`):
https://sportynx.github.io/sportynx-ryse-prototype-/

## Workflow — do this after EVERY change, without being asked
1. Edit `src/prototype.html` (the single source of truth; same file as the Claude artifact "RYSE Launch Screen").
2. Run `python3 build.py` to regenerate `index.html` (adds the fullscreen iPhone web-app head).
3. Commit and push to `main`. GitHub Pages redeploys automatically in ~1 minute.
4. If working in a Claude session that also has the artifact, republish the artifact from the same source.

Never ask the user to do manual deploy steps.

## Viewing on iPhone
Open the link in Safari → Share → Add to Home Screen → launch "RYSE" (fullscreen, edge to edge).

## VANTAGE (separate product, separate folder)
Live: https://sportynx.github.io/sportynx-ryse-prototype-/vantage/
- Source of truth: `vantage/src/` (style.css, data.js, app1–5.js; app4 = calendar, app5 = invite athlete to RYSEON, media.js + app6 = videos the athlete watched — view only; app7 = Progress charts + Health: injury on the 3D body from media/body3d.bin, therapy & massage schedule; app8 = athlete photos (media/ath-*.jpg) + VANTAGE user profile photo; app9 = Progress tab + overview score rings copied 1:1 from RYSEON (same helpers, data shape and CSS) — do not invent new chart styles; app10 = live Today card on Home (rotating 1/3, 2/3, 3/3 updates); app11 = Log activity, same for every role: training, therapy & massage or other, with the athletes' busy day and clash warnings; app12 = screen transitions; app13 = taken over from RYSEON 23 Oct (tab bar glass lens, anthracite background with the moving blue orb on every screen (Ivan prefers it in VANTAGE too), one-shot pulses in view, language rail + tick; loads before app12). Rendering patches the DOM in place (morph in app3 render), so nothing re-animates on a click — never go back to root.innerHTML). Never touch the RYSEON files above when working on VANTAGE.
- Build: `python3 vantage/build.py` → `vantage/index.html`, then commit and push to `main`.
- Home-screen icon: `vantage/icon-*.png` (textured gold-to-blue RY icon, Oct 2026). The logo is used only as the app icon, not inside the screens.
- Same Claude artifact: "VANTAGE" — republish it from the same source.

## Sport (RYSEON, 23 Oct 2026)
After the language comes the sport picker (`sSport`). Only Football and Tennis continue; the rest show Coming soon. `P.sport` drives everything: tennis wording comes from `RYSE_TEN_MAP` inside `rT()` (English football string → English tennis string, then translated), the tennis module is the last `<script>` in src/prototype.html (ATP ranking of 19 Oct 2026 for Find yourself, court surface screen `s11t`, tennis strengths, role models under `RYSE_PLAYERS.TEN`).
