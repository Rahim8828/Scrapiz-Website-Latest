# .htaccess Redirects Quick Reference

## Service Page Redirects

All old service page URLs now redirect to `/services/` prefix:

### Scrap Collection
- `/scrap-collection-page` → `/services/scrap-collection`
- `/scrap-collection` → `/services/scrap-collection`

### Demolition Service
- `/demolition-service-page` → `/services/demolition-service`
- `/demolition-service` → `/services/demolition-service`
- `/demolition` → `/services/demolition-service`

### Dismantling
- `/dismantling-page` → `/services/dismantling`
- `/dismantling-service` → `/services/dismantling`

### Paper Shredding
- `/paper-shredding-page` → `/services/paper-shredding`
- `/paper-shredding-service` → `/services/paper-shredding`

### Society Tie-Up
- `/society-tie-up-page` → `/services/society-tie-up`
- `/society-tieup` → `/services/society-tie-up`

### Junk Removal
- `/junk-removal-service-page` → `/services/junk-removal-service`
- `/junk-removal` → `/services/junk-removal-service`

### Vehicle Scrapping
- `/vehicle-scrapping-page` → `/services/vehicle-scrapping`
- `/vehicle-scrap` → `/services/vehicle-scrapping`

## Global Rules

### HTTPS Enforcement
All HTTP traffic automatically redirected to HTTPS

### Trailing Slash Normalization
All URLs with trailing slashes (except homepage) redirect to version without trailing slash

Example:
- `/services/scrap-collection/` → `/services/scrap-collection`

## Testing

Run the test script to verify all redirects:
```bash
node scripts/gsc-fixes/test-htaccess-redirects.cjs
```

## Backup

Original .htaccess backed up with timestamp in filename.

To restore:
```bash
cp public/.htaccess.backup.[timestamp] public/.htaccess
```
