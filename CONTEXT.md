# Check-in Museum Thailand

A mobile-first web app that lets visitors check in at museums across Thailand by scanning a QR code at each site, collecting stamps into a personal "museum passport," and earning badges for collection milestones. Built for tourists and locals; museum staff participate only by posting a QR code.

## Language

**Visitor**:
A person who uses the app to visit museums and collect stamps. Owns a Passport.
_Avoid_: User, account, customer, tourist

**Museum**:
A physical site in Thailand listed in the app where a Visitor can check in. Has a name (Thai and English), location, province, category, and a unique QR code posted on-site.
_Avoid_: Venue, site, location (use for coordinates), attraction

**Check-in**:
A record proving a Visitor was present at a Museum, created by scanning that Museum's QR code in-app. Carries a timestamp and an optional GPS proximity reading. One per Visitor per Museum earns the Stamp; later visits are logged but do not re-earn it.
_Avoid_: Visit (use for the physical act), scan, entry

**Stamp**:
A per-Museum visual mark placed into a Visitor's Passport on their first Check-in at that Museum. Each Museum has its own Stamp design; it is earned exactly once.
_Avoid_: Badge (use for cross-Museum achievements), reward, sticker

**Badge**:
A cross-Museum achievement awarded for completing a collection goal (e.g. "All museums in Bangkok", "10 museums visited"). Distinct from a Stamp, which is per-Museum.
_Avoid_: Achievement, reward, stamp

**Passport**:
A Visitor's collection of Stamps, viewable as a passport page and shareable. The primary artifact the Visitor builds over time.
_Avoid_: Collection, wallet, profile

**QR code**:
A static, unique code posted at a Museum's entrance that a Visitor scans to create a Check-in. One per Museum, does not rotate.
_Avoid_: Barcode, token, code

**Province**:
The Thai administrative region a Museum belongs to. Used to group Museums for Badges and browsing.
_Avoid_: Region, area, zone

**Pending check-in**:
A Check-in captured while the device is offline, stored locally and synced to the backend later. Sync is idempotent — a Museum+Visitor pair is deduplicated on arrival.
_Avoid_: Queued check-in, draft, cached check-in
