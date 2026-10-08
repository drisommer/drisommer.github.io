# drisommer.github.io — Claude Notes

Hugo site. Source lives in `src/`, output in `public/`.

## Project Types (sections)

Each project has a `projectType` frontmatter field that controls which section page it appears on:

| projectType value | Section URL    | Section content dir         |
|-------------------|----------------|-----------------------------|
| `"Commercial"`    | `/commercials/`| `src/content/commercials/`  |
| `"Music Video"`   | `/music-videos/`| `src/content/music-content/`|
| `"Documentary"`   | `/documentary/`| `src/content/immersive/`    |

> Note: the Documentary section's content folder is still named `immersive/` (legacy). Its `_index.md` has `url = "/documentary/"` to override the URL.

### Changing a single project's type

Edit the `projectType` field in `src/content/projects/<ProjectName>.md`:
```toml
projectType = ["Documentary"]   # change this value
```

### Renaming a section (e.g. "Documentary" → "Doc Films")

This requires changes in several places:
1. **All projects** in that section — update `projectType` value
2. **Section list file** — `src/content/<section>/list.md` → update `filterByprojectType`
3. **Section index** — `src/content/<section>/_index.md` → update `title`
4. **Nav menu** — `src/hugo.toml` `[menu]` block → update `name`
5. **Other-projects partials** — grep for the old name: `src/content/*/other-projects.md` and `src/content/*/see-all-projects.md`

## Hiding a project without deleting it

Add `draft = true` to the project's frontmatter. Remove or set `false` to restore.

## Publishing

All changes go in `src/`. After editing, commit and push `main` — the site deploys automatically.

```bash
git -C src add <files>
git -C src commit -m "message"
git -C src push
```
