# Zuno website

Static site for Zuno (no build step; fonts and Lenis smooth scroll load from CDNs): home, support, privacy policy, terms of use, the
"email confirmed" page that sign-up confirmation links land on, and a 404 page.
Colours match the app (`Zuno/DesignSystem.swift`). Support email: support@zunolanguages.com (Namecheap forwarding to Gmail).

The privacy policy and terms are generated from the app's own text (`Zuno_ios/Zuno/Legal.swift`), so
the website and the app always say the same thing. Change the text there first, then update
`privacy.html` / `terms.html` to match.

## Where it lives

Live at **https://zunolanguages.com** (custom domain since 2026-10-23, file `CNAME`; Namecheap DNS: 4 `A` records for `@` to GitHub Pages + `CNAME www`; the old https://zuno-language.github.io redirects) — GitHub organization `Zuno-language`, public repository
`zuno-language.github.io`, Settings → Pages: deploy from branch `main`, folder `/ (root)`.
Publish a change: commit, then `git push` (GitHub updates the site within a minute or two).

- App: `Legal.webPrivacyURL` / `webTermsURL` / `supportURL` (Zuno_ios/Zuno/Legal.swift) point here.
- App Store Connect: Privacy Policy URL = `/privacy.html`, Support URL = `/support.html`.
- Supabase → Authentication → URL Configuration: Site URL = `https://zunolanguages.com/confirmed.html`.
- Later, with your own domain: add a `CNAME` file containing the domain and point the domain's DNS at GitHub
  Pages (Settings → Pages → Custom domain).
