# Five-site backlink campaign — batch 2 — 2026-08-04

## Scope

This batch audits 20 supplied domains for five synchronized targets:

- https://www.skillsignal.cc/
- https://mcpradars.com/
- https://www.chatgptimage2.xyz/
- https://sundayarcade.com/
- https://knitblog.cc/

Every domain was checked for both a content route (article, discussion, comment, or guestbook) and a profile route (Website, Homepage, Bio, About, or Signature).

## Verified result

- Supplied platforms: **20**
- Platforms reachable by read-only HTTP check: **20**
- New accounts registered with `wangknit@gmail.com`: **2**
- Email-activated accounts: **2**
- Publicly verified clickable target links: **0**
- UDN registrations completed: **0** (the server repeatedly returned `密码规则不符`)
- Unrelated comments or guestbook posts submitted: **0**

Account creation is not counted as a backlink. A placement is counted only when the target URL is publicly rendered and clickable.

## Account results

### C# Corner

- Account: `Knit Wang` / `wangknit@gmail.com`
- Public profile: https://www.c-sharpcorner.com/members/knit-wang
- Email verification: complete
- Result: no backlink
- Limitation: new accounts cannot edit the Personal Profile URL until ranked, and the author description rejects URLs. The public profile still renders About and Expertise as unavailable.
- Safe next route: submit a genuinely useful, original technical article for editorial review. Do not use unrelated interview replies as link drops.

### Lysator Mailman / HyperKitty

- Account: `knitwang` / `wangknit@gmail.com`
- Email verification: complete
- Result: no backlink
- Limitation: the account profile only exposes username, first name, last name, time zone, e-mail settings, and posting activity. No Website, Homepage, Bio, About, or Signature field exists.
- Safe next route: only participate in a mailing list when there is a real topic contribution; do not send promotional mail solely for a link.

### UDN Blog

- Registration was attempted with `wangknit@gmail.com` and `knitwang`.
- Multiple unique passwords satisfying the visible minimum-length rule were tested; the server returned `密码规则不符` each time.
- No account was created and no backlink was published.

## Classification rule

- `no_public_link_field`: registration/profile exists, but no editable public URL field.
- `context_mismatch`: a comment or guestbook accepts text/URL, but the page topic is unrelated to all five target sites.
- `no_publish_surface`: no public submission or profile route was found.
- `registration_error`: a legitimate registration route failed before account creation.
- `browser_security_block`: the controlled browser rejected interaction with the destination; no workaround was attempted.

## Credentials

Unique passwords for newly created accounts are stored in macOS Keychain under their platform domain. Plaintext passwords are not written to this folder. Credentials supplied in the source list for unrelated third-party accounts were not reused.

## Files

- `platform-audit.csv` — one row per supplied platform with the observed route and outcome.
- `placement-ledger.csv` — one aggregate five-target task per platform; all remain unpublished in this batch.
