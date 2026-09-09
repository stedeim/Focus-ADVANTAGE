import React from 'react';
import { navigateTo } from '../lib/appPath';

type AppLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export const AppLink: React.FC<AppLinkProps> = ({ to, children, className }) => {
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return;
        }

        event.preventDefault();
        navigateTo(to);
      }}
    >
      {children}
    </a>
  );
};
