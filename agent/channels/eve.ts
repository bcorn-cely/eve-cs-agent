import { eveChannel } from "eve/channels/eve";
import { localDev, placeholderAuth, vercelOidc } from "eve/channels/auth";

// Mounts the /eve/v1/session* routes. Auth strategies run in order; the first match wins.
export default eveChannel({
  auth: [
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
    // Lets the eve TUI and your Vercel deployments reach the deployed agent.
    vercelOidc(),
    // Fails closed in production. Swap in your real auth (Clerk, Auth.js, or
    // your own OIDC/JWT/API-key verifier) before real traffic.
    placeholderAuth(),
  ],
});
