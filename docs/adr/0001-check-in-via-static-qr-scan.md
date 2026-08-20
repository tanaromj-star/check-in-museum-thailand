# Check-in via static QR scan

Visitors check in by scanning a static, unique QR code posted at each Museum's entrance, rather than via GPS geofence, a manual button, or staff validation.

## Why

QR is the best integrity-to-effort trade-off for v1. It requires physical presence (you can't scan a code you can't see), needs no staff beyond a one-time print-and-post, and works for tourists without Thai phone numbers. GPS geofence is flaky indoors and spoofable; a manual button is trivially gameable and turns the passport into a self-reported log; staff validation needs adoption at every site, which is infeasible to launch with.

The QR is **static** (does not rotate) to keep staff burden at zero — a museum prints it once and is done. Rotating codes would resist screenshot-from-home sharing but add operational cost and break offline-queued check-ins. We accept that risk for v1.

## Consequences

- A GPS reading is captured at scan time as a **soft** anti-fraud signal: if the device is >1km from the Museum, the Check-in is flagged but still accepted. Hard rejection is out of scope for v1 to avoid false negatives at museums with poor indoor GPS.
- A later "verified check-in" tier (staff-scan of the visitor's QR, or a rotating TOTP code) can layer on top of this model without a redesign — it would add a `verified` flag to Check-in, not replace the mechanism.
- Repeat visits to the same Museum are logged but do not re-earn the Stamp; dedup is keyed on Museum+Visitor.
