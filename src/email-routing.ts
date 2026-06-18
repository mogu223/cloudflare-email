import { Construct } from "constructs";
import { CloudflareProvider } from "@cdktf/provider-cloudflare/lib/provider";
import { EmailRoutingSettings } from "@cdktf/provider-cloudflare/lib/email-routing-settings";
import { EmailRoutingRule } from "@cdktf/provider-cloudflare/lib/email-routing-rule";
import { EmailRoutingDns } from "@cdktf/provider-cloudflare/lib/email-routing-dns";
import { EmailRoutingCatchAll } from "@cdktf/provider-cloudflare/lib/email-routing-catch-all";

export interface EmailRoutingConfig {
  readonly apiToken: string;
  readonly zoneId: string;
  readonly catchAllAction: "drop" | "forward";
  readonly catchAllDestination?: string;
  readonly rules?: EmailRoutingRuleConfig[];
}

export interface EmailRoutingRuleConfig {
  readonly name: string;
  readonly matcherValue: string;
  readonly destinations: string[];
}

/**
 * Cloudflare Email Routing deployed as a single CDKTF construct.
 *
 * Creates: EmailRoutingSettings, CatchAll rule, individual forwarding
 * rules, and MX DNS records for email verification.
 */
export class EmailRouting extends Construct {
  constructor(scope: Construct, id: string, config: EmailRoutingConfig) {
    super(scope, id);

    // Provider: API token must have Zone.EmailRouting:Edit + Account.EmailRouting:Edit
    new CloudflareProvider(this, "cloudflare", { apiToken: config.apiToken });

    // Enable routing for this zone
    new EmailRoutingSettings(this, "routing-settings", { zoneId: config.zoneId });

    // Catch-all: drop unmatched addresses by default
    const catchAllValue = config.catchAllAction === "forward" && config.catchAllDestination
      ? [config.catchAllDestination]
      : [];
    new EmailRoutingCatchAll(this, "catch-all", {
      zoneId: config.zoneId,
      name: "catch-all",
      enabled: true,
      matchers: [{ type: "all" }],
      actions: [{ type: config.catchAllAction, value: catchAllValue }],
    });

    // Individual forwarding rules
    if (config.rules) {
      for (const rule of config.rules) {
        new EmailRoutingRule(this, `rule-${rule.name}`, {
          zoneId: config.zoneId,
          name: rule.name,
          enabled: true,
          matchers: [{ type: "literal", field: "to", value: rule.matcherValue }],
          actions: [{ type: "forward", value: rule.destinations }],
        });
      }
    }

    // MX records for email routing verification
    new EmailRoutingDns(this, "routing-dns", {
      zoneId: config.zoneId,
      name: "email-routing-dns",
    });
  }
}
