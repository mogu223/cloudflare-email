# cloudflare-email

Cloudflare Email Routing deployed via CDKTF (TypeScript + Terraform).
Infrastructure-as-code for domain email forwarding rules on Cloudflare.

## Architecture

- `src/email-routing.ts` — CDKTF construct: Settings, Rules, CatchAll, DNS
- `src/main.ts` — Stack: mogudomain.com zone configuration
- `cdktf.json` — CDKTF 0.21 + Cloudflare provider 5.x

## Deployment

```bash
cd /Users/mogu/cloudflare-email
source .env                    # CLOUDFLARE_API_TOKEN=<token>
npx cdktf-cli@0.21 deploy --auto-approve
```

Required API token permissions:
- Zone > Email Routing Rules > Edit
- Account > Email Routing > Edit
- Zone > Zone > Read

## Resources

Zone: mogudomain.com (5a8eee7bc3608dac0d0a48a50e3dea2c)

| Resource | Config |
|---|---|
| `cloudflare_email_routing_settings` | Enable email routing |
| `cloudflare_email_routing_rule` (hello) | hello@mogudomain.com → mogu0369@gmail.com |
| `cloudflare_email_routing_rule` (support) | support@mogudomain.com → mogu0369@gmail.com |
| `cloudflare_email_routing_catch_all` | Drop unmatched |
| `cloudflare_email_routing_dns` | MX records |

## Current Status

- Email forwarding: active and verified
- Terraform state: desynchronized (resources created via dashboard; pending `terraform import`)
- Repository: github.com/mogu223/cloudflare-email

## State Sync (pending)

```bash
cd cdktf.out/stacks/cloudflare-email
terraform import 'cloudflare_email_routing_rule...' <zone-id>/<rule-id>
terraform import 'cloudflare_email_routing_catch_all...' <zone-id>
terraform import 'cloudflare_email_routing_dns...' <zone-id>
terraform import 'cloudflare_email_routing_settings...' <zone-id>
```

## Notes

- `.env` is gitignored — contains API credentials
- `.gen/` is gitignored — auto-generated provider bindings
- Provider: `@cdktf/provider-cloudflare` v12.5.0 (maps to terraform cloudflare 5.5.0)
- CDKTF 0.21.0, TypeScript 5.x, Node >= 18
