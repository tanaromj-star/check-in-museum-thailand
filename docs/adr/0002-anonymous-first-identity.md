# Anonymous-first visitor identity with optional cloud backup

A Visitor gets a local, device-bound account on first launch with no login prompt. Linking an email or a Line/Google account to back up the Passport across devices is opt-in, available later from settings.

## Why

Forcing auth at the museum door kills conversion — tourists won't create an account to scan a QR. Anonymous-first lets the app work instantly, and the opt-in backup preserves the passport without making it the price of entry. This mirrors how physical stamp-rally booklets already work: you get the booklet for free, and only later might you care about not losing it.

## Consequences

- The local account is the source of truth until a cloud identity is linked; if a Visitor uninstalls before linking, their Passport is lost. The UI should nudge toward backup after the first few Stamps, not before.
- A Visitor who links a cloud identity keeps the same Visitor record; the merge is by local-account → cloud-account, not a new account. This means the data model keys Check-ins and Stamps on a stable Visitor id, not on the auth provider id.
- Row-level security on the backend must allow the device-bound account to read/write its own rows before any cloud identity exists — i.e. the Visitor id is the auth principal, and linked providers are attributes of it.
