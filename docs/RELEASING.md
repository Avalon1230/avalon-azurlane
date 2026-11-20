# Commander-authorized release sequence

PR #36 remains **unreleased**. This procedure prepares a later authorized release; neither this document nor a passing rehearsal grants approval. Independent QA review and Commander AVALON's explicit release authorization remain separate steps.

## State contract

| Item | Unreleased branch | Finalized release |
| --- | --- | --- |
| `data/release-status.json` | `status: unreleased`; `version` newer than `releasedVersion` | `status: released`; `releasedVersion === version`; actual release date and approval-record URL |
| `package.json`, HTML version | Match `version` | Match `version` |
| README release line | Previous live version and current unreleased version | Current live version and release date; no pending-release statement |
| First CHANGELOG entry | Current version, explicitly `Unreleased;` | Current version and actual release date, explicitly `Released on ...;` |
| PROJECT_STATUS | Current active development, followed by prior current release | Current release first, with date; prior development and release records are explicitly historical |
| Generated manifest and BUILD | Matching version, `unreleased` status and fingerprint | Matching version, `released` status and regenerated fingerprint |
| Application footer | `vVERSION · Preview` | `vVERSION` |

`releasedMain` on the development branch identifies the preceding live snapshot. Finalization moves it to `previousReleasedMain`, retains `previousReleasedVersion`, and records `releaseApproval` and `releaseDate`. The future merge SHA is not known yet and must never be invented. Record the actual merge/deployment SHA after the release is observed.

## Before merging the existing PR

1. Complete independent QA. Obtain Commander authorization covering this release, finalization and merge/deployment. Read the actual authorization; do not treat a COMMENT review, a URL, or successful CI as permission. If authorization is in the conversation, preserve it in the normal version-controlled release record and use a PR comment/review link only when posting that record is authorized.
2. On the existing feature branch, use the real Manila release date and the GitHub review/comment containing Commander approval. The command defaults to a dry run:

   ```sh
   node scripts/finalize-release.mjs --date YYYY-MM-DD --approval APPROVAL_RECORD_URL
   ```

3. Once the inputs and authorized scope are verified, add `--write`. This updates the release metadata, README, current CHANGELOG and PROJECT_STATUS, then regenerates `data/deployment.json` and `src/release-data.js`. It validates the full released state and generated outputs. It does not change application, artwork, Events, storage or package version; the package must already match the release version. It never commits, merges or deploys. The approval URL is a provenance field, **not an authorization verifier**.
4. Review the diff and run:

   ```sh
   npm run check
   npm test
   node scripts/verify-release-consistency.mjs --require-released
   node scripts/release-state-smoke.mjs
   ```

5. Commit the finalized documents and **both generated artifacts** to the same PR. Wait for the complete CI pipeline on that exact commit, including source audits, Events, artwork, combat, research and release-state browser checks. Confirm the actual footer is `vVERSION` with no Preview. Have independent QA recheck the release-state correction if required by the Commander approval.
6. Only then perform the Commander-authorized merge. If approval was limited to the earlier exact SHA or excluded finalization, obtain approval for the finalized result before merging.

Pages currently deploys from `main` automatically. A failing quality job does **not** block branch-source Pages publication by itself. Therefore, do not merge an unreleased or unverified commit and expect CI to prevent publication. No Pages configuration or deployment mechanism is changed by this correction. The main-branch `--require-released` check is an additional diagnostic; the required pre-merge finalization and exact-head verification are the release barrier.

## After an authorized merge

1. Confirm the merge SHA and wait for both main CI and the Pages deployment to succeed.
2. Check out that finalized commit and run `node scripts/verify-deployment.mjs --url https://avalon1230.github.io/avalon-azurlane/ --require-released`. This checks the served hashes, release status, generated BUILD and the expected local build fingerprint. A successful deployment job alone is not proof that the browser received that build.
3. Open the live app, confirm the footer version has no Preview, and inspect the reload notice and saved-loadout behavior. Record the actual merge SHA, Pages run and observed verification results in the handoff before claiming live-release success.

## Regression evidence

The release tests explicitly reproduce the status-only flip from QA and reject stale versions, dates, documents and generated artifacts in both states. The browser suite finalizes an isolated temporary copy with a clearly synthetic approval fixture, validates the generated outputs and tests the actual app footer and saved loadouts. It also verifies that the real checkout is unchanged. The synthetic URL in tests is never real approval, and the rehearsal never serves or deploys a public release.
