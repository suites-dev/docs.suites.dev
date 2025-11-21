import React from 'react';
import { useLocation } from '@docusaurus/router';
import ClientOnly from '@site/src/components/ClientOnly';
import AskAIButton from '@site/src/components/AskAI';

export default function Root({children}) {
  const location = useLocation();

  // Only show the Ask AI button on documentation pages
  const isDocsPage = location.pathname.startsWith('/docs');

  return (
    <>
      {children}
      {isDocsPage && (
        <ClientOnly>
          <AskAIButton position="floating" provider="both" />
        </ClientOnly>
      )}
    </>
  );
}