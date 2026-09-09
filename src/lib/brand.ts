export const BRAND_NAME = 'Focus Advantage';
export const SUPPORT_EMAIL = 'stedeim@gmail.com';
export const SITE_URL = 'https://focusadvantage.io';
export const OPERATOR_NAME = 'Deimira Baidoo';
export const OPERATOR_LOCATION = 'Calgary, Alberta, Canada';
export const LEGAL_UPDATED = 'September 9, 2026';

export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Focus Advantage support')}`;
export const DELETE_ACCOUNT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Delete my Focus Advantage account')}`;

export const LEGAL_ROUTES = {
  privacy: '/privacy',
  terms: '/terms',
  support: '/support',
  deleteAccount: '/delete-account',
} as const;

export const LEGAL_LINKS = [
  { to: LEGAL_ROUTES.privacy, label: 'Privacy' },
  { to: LEGAL_ROUTES.terms, label: 'Terms' },
  { to: LEGAL_ROUTES.support, label: 'Support' },
  { to: LEGAL_ROUTES.deleteAccount, label: 'Delete account' },
] as const;
