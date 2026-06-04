# Contributing to Discover KW

Thank you for helping build the best local platform in KW. This guide covers everything you need to contribute effectively.

## Development Setup

```bash
git clone https://github.com/bamtobiloba-spec/Tobiloba.git
cd Tobiloba
npm install
npm run dev
```

## Branch Naming

| Type | Pattern | Example |
|------|---------|--------|
| Feature | `feat/short-description` | `feat/post-templates` |
| Bug fix | `fix/short-description` | `fix/calendar-drag-drop` |
| Chore | `chore/short-description` | `chore/update-deps` |
| Docs | `docs/short-description` | `docs/api-reference` |

Always branch off `main`. Never push directly to `main`.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Instagram story scheduler
fix: calendar drag not updating date on drop
chore: upgrade Recharts to v3
docs: add screenshot to README
```

## Pull Requests

- Fill in the PR template completely
- Link the related issue: `Closes #123`
- All CI checks must pass before merging
- Request review from at least one maintainer

## Code Style

- **React:** functional components, hooks only — no class components
- **State:** keep it close to where it's used; lift only when needed
- **Styling:** Tailwind utility classes — no custom CSS unless unavoidable
- **Persistence:** use the helpers in `src/utils/storage.js`; never call `localStorage` directly
- **Comments:** only when the *why* is non-obvious
- Run `npm run lint` before pushing

## Adding a New Feature Module

1. Create `src/components/<FeatureName>/<FeatureName>.jsx`
2. Add storage helpers to `src/utils/storage.js` if new data is needed
3. Add any shared constants to `src/utils/constants.js`
4. Register the page in `src/App.jsx`
5. Add the nav item to `src/components/Layout/Sidebar.jsx`
6. Update `src/components/Layout/Header.jsx` with the page title

## Reporting Bugs

Use the [Bug Report](https://github.com/bamtobiloba-spec/Tobiloba/issues/new?template=bug_report.yml) issue template.

## Requesting Features

Use the [Feature Request](https://github.com/bamtobiloba-spec/Tobiloba/issues/new?template=feature_request.yml) issue template.
