# Desktop compatibility

The plugin is host-only as of `dsh-custom-header@0.1.5` for DSH `0.2.0-rc.2`.

The package no longer declares a client contribution, ships no client bundle, registers no Typert settings endpoints, and has no settings UI or persisted settings store. It registers one fetch middleware and one `llm/stream` context wrapper. The middleware sets Codex `User-Agent` and `Originator` only when the current model name contains `gpt` (case-insensitive). Codex version is controlled by the host config `codexVersion`, defaulting to `0.147.0`; enabling/disabling is handled by DSH's plugin manager.

Validation: `npm run check` passed. The final package is 15.8 kB and the host bundle is about 4 kB. The official plugin manager installed and enabled version 0.1.5 and returned `restart-required`. Fully quit and reopen DSH Desktop to apply it.
