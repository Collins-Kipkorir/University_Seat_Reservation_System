import React, { useMemo } from 'react';

/**
 * Password rules — must stay identical to backend/api/auth/register.php.
 *
 * PHP equivalents:
 *   strlen($pw) >= 8               ↔  length rule
 *   preg_match('/[A-Z]/', $pw)     ↔  uppercase rule
 *   preg_match('/[^A-Za-z0-9]/', $pw) ↔ special rule
 */
export const RULES = [
  {
    key: 'length',
    label: 'At least 8 characters',
    test: (pw) => pw.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'One uppercase letter',
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    key: 'special',
    label: 'One special character (e.g. !@#$%)',
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

/**
 * PasswordChecklist
 *
 * Props:
 *   password {string}  — current password field value
 *   show     {boolean} — whether to render (false until field is first focused)
 */
export function PasswordChecklist({ password, show }) {
  const results = useMemo(
    () => RULES.map((r) => ({ ...r, passed: r.test(password) })),
    [password]
  );

  if (!show) return null;

  return (
    <ul
      style={{
        margin: '8px 0 0 0',
        padding: '10px 14px',
        listStyle: 'none',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        fontSize: '13px',
        lineHeight: '1.7',
      }}
    >
      {results.map(({ key, label, passed }) => (
        <li
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: passed ? '#16a34a' : '#6b7280',
            fontWeight: passed ? '600' : '400',
            transition: 'color 0.15s',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: passed ? '#dcfce7' : '#f1f5f9',
              border: `1.5px solid ${passed ? '#16a34a' : '#cbd5e1'}`,
              flexShrink: 0,
              fontSize: '10px',
              transition: 'all 0.15s',
            }}
          >
            {passed ? '✓' : ''}
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}
