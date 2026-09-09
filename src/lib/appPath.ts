import { LEGAL_ROUTES } from './brand';

export type LegalPath =
  | typeof LEGAL_ROUTES.privacy
  | typeof LEGAL_ROUTES.terms
  | typeof LEGAL_ROUTES.support
  | typeof LEGAL_ROUTES.deleteAccount;

const LEGAL_PATHS = new Set<string>(Object.values(LEGAL_ROUTES));

export const normalizePath = (pathname: string) => {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

export const isLegalPath = (pathname: string): pathname is LegalPath => {
  return LEGAL_PATHS.has(normalizePath(pathname));
};

export const navigateTo = (path: string) => {
  const next = normalizePath(path);
  const current = normalizePath(window.location.pathname);
  if (current === next && window.location.search === '') {
    window.dispatchEvent(new PopStateEvent('popstate'));
    return;
  }

  window.history.pushState({}, '', next);
  window.dispatchEvent(new PopStateEvent('popstate'));
};
