# Zuno website

Static site for Zuno (no build step): home, support, privacy policy, terms of use, the
"email confirmed" page that sign-up confirmation links land on, and a 404 page.
Colours match the app (`Zuno/DesignSystem.swift`). Support email: clee80609@gmail.com.

The privacy policy and terms are generated from the app's own text (`Zuno_ios/Zuno/Legal.swift`), so
the website and the app always say the same thing. Change the text there first, then update
`privacy.html` / `terms.html` to match.

## Publish on GitHub Pages (free)

1. On github.com, create a free organization (e.g. `zuno-app`). Its site will live at
   `https://zuno-app.github.io`, separate from christopherbiguet.com.
2. In that organization, create a **public** repository named exactly `zuno-app.github.io`
   (organization name + `.github.io`). Public is required for free Pages. Only these website files go here,
   never the app's code.
3. Push this folder:
   ```bash
   git remote add origin https://github.com/zuno-app/zuno-app.github.io.git
   git push -u origin main
   ```
4. Repository → Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
5. After a few minutes, check `https://zuno-app.github.io/privacy.html`.

## After publishing

- App: set `Legal.webPrivacyURL` (Zuno_ios/Zuno/Legal.swift) to the privacy page address.
- App Store Connect: Privacy Policy URL = `/privacy.html`, Support URL = `/support.html`.
- Supabase → Authentication → URL Configuration: Site URL = `https://zuno-app.github.io/confirmed.html`.
- Later, with your own domain: add a `CNAME` file containing the domain and point the domain's DNS at GitHub
  Pages (Settings → Pages → Custom domain).
