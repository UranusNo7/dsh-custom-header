## 2026-10-05 - Task: Restrict plugin to Codex headers for GPT models

### What was done
- Reduced the active fetch pipeline to Codex official identity headers only.
- Added LLM request model propagation through AsyncLocalStorage.
- Enabled header injection only when the model name contains `gpt` (case-insensitive).
- Ignored legacy extra headers so the plugin cannot inject non-Codex headers.

### Testing
- Validation: `npm run check` passed after installing local React development types with `--legacy-peer-deps`; the initial clean install lacked React peer packages.

### Notes
- Changed files: `src/index.ts`, `src/header-inject.ts`, `src/session-context.ts`, `src/config.ts`, `src/client/settings-tab.tsx`.
- Rollback: restore these files from version control.

## 2026-10-06 - Task: Check desktop compatibility and attempt installation

### What was done
- Identified the live desktop DSH runtime as 0.2.0-rc.2 and bundled Node as v24.21.0.
- Packed the current build using npm pack --ignore-scripts.
- Attempted installation through the official plugin manager; installation did not complete.

### Testing
- Node engine requirement is satisfied; full runtime compatibility remains unverified because activation never occurred.
- Package creation succeeded: dsh-custom-header-0.1.3.tgz.
- Plugin manager returned changed=false/application=failed: the existing desktop profile references a missing dsh-gpt-compat-0.2.4-desktop.0.tgz dependency.
- Verified the stale file dependency in the desktop profile package.json; did not edit or remove that unrelated dependency.

### Notes
- Generated artifact: dsh-custom-header-0.1.3.tgz; appended this log only, no source changes in this task.
- Rollback: no plugin activation to undo; the generated archive may be removed after verifying its exact path.

## 2026-10-06 - Task: Retry desktop installation and fix Typert compatibility

### What was done
- Retried installation after the user repaired the missing dependency.
- Fixed the plugin's strict Typert codecs to supply create() factories, per the live desktop registry contract.
- Updated the matching local type stub and bumped the package/root lock versions to 0.1.4 so the installer identifies the corrected archive unambiguously.
- Installed and enabled dsh-custom-header@0.1.4 in the desktop profile using the official plugin manager.

### Testing
- npm run check passed (typecheck, host/client builds, declaration emit).
- npm pack --ignore-scripts succeeded.
- Plugin manager returned application=restart-required; list_bundles confirmed version 0.1.4, installed=true, enabled=true.
- Activation and actual provider request behavior after desktop restart remain unverified.

### Notes
- Modified: src/contract.ts, stubs/@deepseek-ai/dsh-typert-protocol/index.d.ts, package.json, package-lock.json; added docs/desktop-compatibility.md. Rebuilt lib artifacts and local tarballs.
- No DSH core changes, version exemptions or install-script approvals.

## 2026-10-06 - Task: Remove frontend and reduce plugin to host-only behavior

### What was done
- Removed the client bundle, settings page, Typert settings endpoints, settings persistence, and legacy profile/config modules from the shipped implementation.
- Replaced the previous host entry with a small host-only plugin that registers one fetch middleware and one llm/stream model context wrapper.
- Kept only `codexVersion` host configuration; DSH plugin enable/disable controls activation.
- Removed obsolete generated client/type artifacts and repacked as dsh-custom-header@0.1.5.

### Testing
- `npm run check` passed.
- Final host bundle is about 4 kB; package tarball is 15.8 kB.
- Plugin manager installed and enabled dsh-custom-header@0.1.5; application status is `restart-required`.

### Notes
- Modified: src/host.ts, src/fetch-pipeline.ts, build.mjs, package.json, package-lock.json, tsconfig.json; removed obsolete client/settings/profile modules and generated client artifacts; updated docs/desktop-compatibility.md.
- Restart DSH Desktop to apply the new package.
- Rollback: disable dsh-custom-header in the plugin manager and restart, then reinstall 0.1.4 if needed.
- Rollback: disable dsh-custom-header in the desktop plugin manager and restart; revert only this task's source/version changes if needed.

## 2026-10-11 - Task: Upload current project to GitHub

### What was done
- Prepared the current host-only plugin source, build configuration and existing documentation for the requested repository's main branch.
- Excluded local tarball artifacts from the commit.

### Testing
- npm run check passed before submission.
- Verified origin points to UranusNo7/dsh-custom-header and remote main matches the local base commit.

### Notes
- Changed in this upload task: progress.md; submitted the existing plugin changes from the preceding task.
- The existing README still describes the older multi-profile implementation.
- Rollback: revert the upload commit with git revert and push the resulting commit.
