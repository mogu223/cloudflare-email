import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { EmailRouting } from "./email-routing";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const ZONE_ID = "5a8eee7bc3608dac0d0a48a50e3dea2c";
const CATCH_ALL = "drop" as const;

const RULES = [
  { name: "hello",   matcherValue: "hello@mogudomain.com",   destinations: ["mogu0369@gmail.com"] },
  { name: "support", matcherValue: "support@mogudomain.com", destinations: ["mogu0369@gmail.com"] },
];

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------
class EmailRoutingStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new EmailRouting(this, "email-routing", {
      apiToken: process.env.CLOUDFLARE_API_TOKEN!,
      zoneId: ZONE_ID,
      catchAllAction: CATCH_ALL,
      rules: RULES,
    });
  }
}

const app = new App();
new EmailRoutingStack(app, "cloudflare-email");
app.synth();
