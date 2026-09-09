import React from 'react';
import { LEGAL_LINKS, SITE_URL, SUPPORT_EMAIL } from '../lib/brand';
import { AppLink } from './AppLink';

type LegalFooterProps = {
  className?: string;
};

export const LegalFooter: React.FC<LegalFooterProps> = ({ className = '' }) => {
  return (
    <footer className={`space-y-3 ${className}`}>
      <nav
        aria-label="Legal and support"
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
      >
        {LEGAL_LINKS.map((link) => (
          <AppLink
            key={link.to}
            to={link.to}
            className="text-[11px] font-bold uppercase tracking-widest text-white/35 hover:text-gold transition-colors"
          >
            {link.label}
          </AppLink>
        ))}
      </nav>
      <p className="text-center text-[11px] text-white/25 leading-relaxed">
        <a href={SITE_URL} className="hover:text-gold transition-colors" target="_blank" rel="noreferrer">
          {SITE_URL.replace('https://', '')}
        </a>
        {' · '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-gold transition-colors">
          {SUPPORT_EMAIL}
        </a>
      </p>
    </footer>
  );
};
