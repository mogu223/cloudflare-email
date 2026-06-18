# cloudflare-email

Cloudflare Email Routing via CDKTF (TypeScript).

## Deploy
```bash
cd /Users/mogu/cloudflare-email
source .env
npx cdktf-cli@0.21 deploy --auto-approve
```

## Files
- `src/email-routing.ts` — EmailRouting CDKTF construct
- `src/main.ts` — Stack entry point
- `.env` — CLOUDFLARE_API_TOKEN
- `cdktf.json` — CDKTF config (typescript, cloudflare provider)

## Current State
- Email forwarding: hello@mogudomain.com and support@mogudomain.com → mogu0369@gmail.com
- Catch-all: drop
- Zone: mogudomain.com (5a8eee7bc3608dac0d0a48a50e3dea2c)
- Terraform state: needs `terraform import` to sync
