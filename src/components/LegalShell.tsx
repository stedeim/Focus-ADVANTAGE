import React, { useEffect } from 'react';
import { BRAND_NAME } from '../lib/brand';
import { AppLink } from './AppLink';
import { LegalFooter } from './LegalFooter';

type LegalShellProps = {
  title: string;
  updated?: string;
  children: React.ReactNode;
};

export const LegalShell: React.FC<LegalShellProps> = ({ title, updated, children }) => {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · ${BRAND_NAME}`;
    return () => {
      document.title = previous || BRAND_NAME;
    };
  }, [title]);

  return (
    <div className="min-h-screen bg-navy-dark text-white relative overflow-hidden">
      <div className="atmosphere" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10 md:py-16 space-y-8">
        <div className="space-y-4">
          <AppLink
            to="/"
            className="inline-flex text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-gold transition-colors"
          >
            ← Back to app
          </AppLink>
          <p className="text-3xl font-serif italic text-gold tracking-tight">{BRAND_NAME}</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{title}</h1>
            {updated && <p className="text-xs uppercase tracking-[0.25em] text-white/35">Last updated {updated}</p>}
          </div>
        </div>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 space-y-6 text-sm text-white/65 leading-relaxed">
          {children}
        </article>

        <LegalFooter />
      </div>
    </div>
  );
};

export const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <section className="space-y-2">
      <h2 className="text-base font-bold text-white">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
};
