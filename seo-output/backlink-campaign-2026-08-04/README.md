# Five-site backlink campaign — 2026-08-04

## Scope

Every accessible platform is evaluated through both routes:

1. Content route: independent posts, discussions, comments, or link submissions.
2. Profile route: public user profile, author page, Website field, Bio/About text, signature, channel, or company profile.

A platform is no longer rejected merely because the example article is off-topic. It is rejected only after both routes are unavailable or the site cannot be accessed.

## Current result

- Platforms supplied: 20
- Target sites: 5
- Platform-target combinations: 100
- Published all-five batch: `prismo.fedibird.com`
- Verified clickable placements: 6 (5 Prismo stories + 1 Decidim profile link)
- Additional plain-text brand mentions: 4 on the Decidim profile
- Reopened for profile-field audit: 18 accessible platforms
- Temporarily excluded as inaccessible: 1 (`feedback.jobplanet.co.kr`, connection closed in Chrome and 403 to scripted requests)
- Permanently rejected after corrected logic: 0
- Tiba Tattoo correction: the old `.com` URL redirects to `tibatattoo.de`
- TV Worth Watching correction: HTTP opens, although HTTPS has a certificate mismatch

## Published results

- SkillSignal: https://prismo.fedibird.com/posts/a0f6ade9-a5b3-465b-9e6e-059acb62566a
- MCP Radar: https://prismo.fedibird.com/posts/30a1165d-1181-4df8-baa9-c68aa5687643
- GPT Image 2: https://prismo.fedibird.com/posts/c264eab2-cfc8-477d-ae37-5194d640d555
- Sunday Arcade: https://prismo.fedibird.com/posts/261a5063-f25d-4174-82b3-bf0629baa9aa
- Knit: https://prismo.fedibird.com/posts/9fc5f30e-057b-4e8f-8c27-5eb96fef0ecb
- MCP Radar profile link: https://decidim.u-pec.fr/profiles/colaice/timeline (`rel="nofollow noopener noreferrer ugc"`)

The same Decidim About field contains all five brand URLs, but only the dedicated Personal website field is clickable. Therefore the other four entries are recorded as brand mentions rather than backlinks.

Diario de Cuba registration was submitted with `wangknit@gmail.com` and username `wangknit`; no activation email had arrived at the verification check, so it remains unverified and no profile link is counted yet.

GeniusU registration and email verification are complete for `Knit Wang` / `wangknit@gmail.com`. Its unique password is stored in macOS Keychain under service `app.geniusu.com`. Website and About fields were saved, but the public profile at `https://www.geniusu.com/profiles/2821204` does not render those fields or any target URL, so it is not counted as a backlink.

## Profile-field rule

- Multi-link Bio/About: one account can cover all five target sites when the rendered links are clickable.
- Single Website field: one account normally covers one target site; creating extra accounts requires platform-specific approval and must comply with the site's rules.
- Comment author Website field: one contextual comment can cover one target site; comments are not posted solely to inject unrelated links.
- Plain-text URLs in a non-linking Bio count as brand mentions, not backlinks.
- CAPTCHA, OTP, Google sign-in, or account-per-site expansion is paused for user confirmation.
- A profile route is not used when registration requires a false declaration. For example, OnVaSortir explicitly requires registrants to confirm they are not joining for business or advertising, so no promotional account was created there.

## Files

- `platform-audit.csv` — corrected platform and profile-route audit.
- `platform-route-audit.csv` — route capacity and evidence for Website/Bio/comment/profile fields.
- `placement-ledger.csv` — all 100 tasks, including verified placements and pending profile work.
- `PRISMO-DRAFTS.md` — first published five-site batch.

## Account and credential rules

1. Use a unique password for every platform and store it in macOS Keychain.
2. Never copy the plaintext password from the source attachment to another service.
3. Reuse `wangknit@gmail.com` only when the user authorizes that platform registration.
4. Stop for CAPTCHA or OTP when required.
5. Record the public profile/result URL and visible target links after every update.
