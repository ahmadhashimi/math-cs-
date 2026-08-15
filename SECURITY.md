# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a security problem. Report it privately
through GitHub's **Report a vulnerability** button under the Security tab, or by
contacting Fannos Academy directly.

Include what you found, how to reproduce it, and what an attacker could do with
it. You can expect an acknowledgement within a few days.

## Scope

The parts of this project worth looking at:

- **`/api/tutor` and `/api/grade`.** These are the only server-executed routes.
  They accept lesson context and learner text and forward it to the Anthropic
  API. Prompt injection through lesson content or the free-text question box,
  key leakage, and missing input bounds are all in scope.
- **The `ANTHROPIC_API_KEY`.** It is read server-side only and must never reach
  a client bundle or a response body. If you can extract it, that is a
  vulnerability.
- **Stored progress.** Learner state lives in `localStorage` under
  `mfcs-progress-v1`. It is not a security boundary, but a payload that breaks
  the app for anyone who imports it is worth reporting.

## Explicitly out of scope

The exam proctoring — the screenshot notice, tab-switch counting and copy
blocking during a live attempt — is a **deterrent, not a control**. A browser
cannot prevent a screen capture; a phone camera always works. Demonstrating
that you can screenshot, copy or otherwise capture an exam is not a
vulnerability. What the feature does, deliberately, is make it loud, counted and
visible on the result.

Likewise, progress is client-side by design. Editing `localStorage` to unlock a
track is defeating yourself, not defeating a security control.
