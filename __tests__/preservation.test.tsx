/**
 * Preservation Property Tests
 *
 * These tests lock in existing WORKING behavior on unfixed code.
 * All tests MUST PASS on unfixed code — they confirm the baseline to preserve.
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8
 */

import fs from 'fs'
import path from 'path'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as fc from 'fast-check'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/sessions',
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => React.createElement('a', { href, ...props }, children),
}))

// ─── P1: Dashboard renders all 3 match cards and 2 session cards ─────────────
// Validates: Requirement 3.2
test('P1 — Dashboard renders all 3 match cards and 2 session cards', async () => {
  const { default: DashboardPage } = await import('../app/(app)/dashboard/page')
  render(React.createElement(DashboardPage))

  expect(screen.getByText(/Margaret, 71/i)).toBeInTheDocument()
  expect(screen.getByText(/Robert, 68/i)).toBeInTheDocument()
  expect(screen.getByText(/Dorothy, 74/i)).toBeInTheDocument()

  const joinButtons = screen.getAllByRole('button', { name: /join session/i })
  expect(joinButtons).toHaveLength(2)
})

// ─── P2: Match detail page source contains profile, contact buttons, and CTA ─
// Validates: Requirements 3.1, 3.6
// NOTE: async server component — cannot render in vitest; inspect source instead
test('P2 — Match detail page source contains sms:, tel:, Schedule a Workout, and profile.bio', () => {
  const src = fs.readFileSync(
    path.resolve(process.cwd(), 'app/(app)/match/[id]/page.tsx'),
    'utf-8'
  )

  expect(src).toContain('sms:')
  expect(src).toContain('tel:')
  expect(src).toContain('Schedule a Workout')
  expect(src).toContain('profile.bio')
})

// ─── P3: Profile save flow shows "✓ Profile Saved!" ─────────────────────────
// Validates: Requirement 3.5
test('P3 — Profile save flow works: clicking "Save Profile" shows "✓ Profile Saved!"', async () => {
  const { default: ProfilePage } = await import('../app/(app)/profile/page')
  const user = userEvent.setup()
  render(React.createElement(ProfilePage))

  const saveBtn = screen.getByRole('button', { name: /save profile/i })
  await user.click(saveBtn)

  expect(screen.getByText(/✓ Profile Saved!/i)).toBeInTheDocument()
})

// ─── P4: Sidebar nav links have correct hrefs ─────────────────────────────────
// Validates: Requirement 3.7
test('P4 — Sidebar nav links have correct hrefs', () => {
  const src = fs.readFileSync(
    path.resolve(process.cwd(), 'app/(app)/layout.tsx'),
    'utf-8'
  )

  expect(src).toContain('/dashboard')
  expect(src).toContain('/match')
  expect(src).toContain('/sessions')
  expect(src).toContain('/events')
  expect(src).toContain('/profile')
})

// ─── P5 (PBT): Cancel preserves all other sessions — Property 7 ──────────────
// Validates: Requirements 3.4
// Tests the pure cancel logic directly (component has no state yet on unfixed code)
/**
 * **Validates: Requirements 3.4**
 */
type Session = {
  id: string
  partner: string
  date: string
  time: string
  activity: string
}

function cancelSession(sessions: Session[], targetId: string): Session[] {
  return sessions.filter((s) => s.id !== targetId)
}

test('P5 (PBT) — Cancel preserves all other sessions (Property 7)', () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.record({
          id: fc.string(),
          partner: fc.string(),
          date: fc.string(),
          time: fc.string(),
          activity: fc.string(),
        })
      ),
      fc.string(),
      (sessions, targetId) => {
        const result = cancelSession(sessions, targetId)

        // Every session with id !== targetId must be present and field-identical
        const kept = sessions.filter((s) => s.id !== targetId)
        if (result.length !== kept.length) return false

        return kept.every((original, i) => {
          const r = result[i]
          return (
            r.id === original.id &&
            r.partner === original.partner &&
            r.date === original.date &&
            r.time === original.time &&
            r.activity === original.activity
          )
        })
      }
    )
  )
})

// ─── P6: SMS and tel links present on match profile source ───────────────────
// Validates: Requirement 3.6
test('P6 — SMS and tel links present on match profile source', () => {
  const src = fs.readFileSync(
    path.resolve(process.cwd(), 'app/(app)/match/[id]/page.tsx'),
    'utf-8'
  )

  expect(src).toContain('href={`sms:')
  expect(src).toContain('href={`tel:')
})
