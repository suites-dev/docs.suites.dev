import React from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import NotFoundContent from '@theme/NotFound/Content';

export default function Index(): JSX.Element {
  return (
    <>
      <PageMetadata 
        title="404 - Page Not Found | Suites" 
        description="The page you are looking for could not be found." 
      />
      <Layout>
        <NotFoundContent />
      </Layout>
    </>
  );
}
