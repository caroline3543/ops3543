# Project Rules

## General

- Read the entire relevant file before making changes.
- Never rewrite the entire application unless explicitly requested.
- Prefer small targeted edits over large refactors.
- Preserve all existing functionality unless specifically asked to remove it.
- Explain which files will be modified before making changes.

## UI / UX

- Mobile-first design is required.
- Preserve the existing visual design language.
- Maintain strong accessibility and contrast.
- All text must remain readable in both light and dark mode.
- Do not reduce font sizes below accessibility standards.
- Do not introduce clutter or visual noise.
- Prefer elegant, minimal, modern interfaces.

## Popups & Modals

- All modal content must be scrollable.
- Prevent content from being cut off on mobile devices.
- Ensure modal layouts work on small screens.

## Lists & Data

- Preserve existing user data structures.
- Never delete existing fields unless requested.
- Editable items should support edit and delete actions.
- Destructive actions should require confirmation.

## Code Changes

- Make the smallest possible change that solves the problem.
- Avoid creating duplicate components.
- Avoid unnecessary dependencies.
- Avoid rewriting large files when a targeted edit is possible.

## Before Finishing

Explain:
- What changed
- Which files changed
- Why the change was made
- Possible side effects
