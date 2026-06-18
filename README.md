# cloudflare-email

Cloudflare Email Routing via CDKTF (TypeScript). Deploy email forwarding rules to a
Cloudflare zone as infrastructure-as-code — no clicking through dashboards.

## Quick start

```bash
npm install              # install cdktf + cloudflare provider
cp .env.example .env     # add your CLOUDFLARE_API_TOKEN
# Edit src/main.ts: replace ZONE_ID and RULES with your domain + forwards
npx cdktf synth          # preview the Terraform plan
npx cdktf deploy         # deploy to Cloudflare
```

## How it works

`src/email-routing.ts` maps to Cloudflare Email Routing API:

| CDKTF resource | Cloudflare API | What it does |
|---|---|---|
| `EmailRoutingSettings` | Zone Email Routing toggle | Enable/disable routing for a zone |
| `EmailRoutingCatchAll` | Catch-all rule | Drop or forward unmatched addresses |
| `EmailRoutingRule` | Individual rule | Forward `hello@...` → `real@...` |
| `EmailRoutingDns` | DNS records | MX records for email verification |

## Requirements

- Node.js >= 18
- Cloudflare API token with `Zone > Email Routing > Edit` permission
- Domain already added to Cloudflare (zone active)
