# v0.8.10 - META rarity background correction

Implementation: `4e541d10493dd1b92288b504812f0e424d8d139d`.
Baseline: `a0f60302b840484cf33c8aac20771abc208bf8ea`.
[Independent QA finding](https://github.com/Avalon1230/avalon-azurlane/pull/33#pullrequestreview-5908517822).

Elite META now uses violet/charcoal backgrounds and purple exterior highlights; Super Rare META uses dark gold/amber backgrounds and gold highlights. Broad nameplates, footers, portrait backing and hero backgrounds carry the verified rarity palette. The blackened silhouette, top names, full-size artwork and static finish are preserved.

## Refreshed application screenshots

[Download the CI screenshot archive](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43667176559/artifacts/14142951757).

For each filename below, use both `390` (mobile) and `1280` (desktop). Compare `before-` with `live-`:

| Subject | Roster | Hero |
| --- | --- | --- |
| Hunter META / Elite | `live-meta-elite-{width}-roster.png` | `live-meta-elite-{width}-hero.png` |
| Hiryuu META / Super Rare | `live-meta-{width}-roster.png` | `live-meta-{width}-hero.png` |
| PR / Neptune | `live-pr-{width}-roster.png` | `live-pr-{width}-hero.png` |
| DR / Drake | `live-dr-{width}-roster.png` | `live-dr-{width}-hero.png` |
| Ordinary / Enterprise | `live-ordinary-{width}-roster.png` | `live-ordinary-{width}-hero.png` |

Mixed comparisons: `before-mixed-{width}.png` and `live-mixed-{width}.png`. These use the existing labeled harness arranging unchanged live application tiles in the production grid. Full application captures are also included. Artwork and tile styles are not retouched.

Archive digest reported by GitHub: `a5dec0090090122b0c0dc547d9b7c059a84c447c992d515a8e8ce34956db4375`.

## Verified results and remaining review

[Implementation CI 43667176559 passed](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43667176559): 281 Node tests, syntax/generated-data and pinned-source checks, 63 responsive cases, ten combat sessions, four research interaction sessions, ten current and ten baseline live-art sessions. Browser assertions verify rarity-specific backing and exterior colors, at least 4.5:1 name/footer contrast, full-card frame clearance, artwork size, common nameplate order/geometry, wrapping, overflow and no animation.

Only META CSS colors changed at runtime. PR/DR/ordinary CSS, hero structure, research calculations, saved loadouts, acquisition tracking and combat modules are unchanged.

**Visual inspection and decoded before/after pixel comparison remain pending.** The local execution environment became unavailable after successful CI and artifact capture, before the screenshots could be downloaded, inspected and composed into comparison sheets. Do not interpret passing color assertions as visual acceptance, or claim PR/DR/ordinary pixel equality for this correction until the archive is compared.

Next: inspect Hunter/Hiryuu at actual mobile size and their desktop/mobile heroes; compare PR/DR/ordinary pixels; publish reviewed comparison sheets. The prepared local helper is `.audit/meta-evidence.cjs` in the v0810 worktree, but the GitHub artifact above is the durable source. Independent QA and Commander merge authorization remain outstanding. **Do not merge.**
