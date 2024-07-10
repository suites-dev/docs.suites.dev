import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import Head from '@docusaurus/Head';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={'row'}>
          <h1 className={styles.title}>Suites</h1>
        </div>
        <div className={'row'}>
          <p className={styles.subtitle}>
            Suites is a meta-framework that focuses on helping developers build solid test suites, eliminates
            boilerplate code, and improves their unit testing process.
          </p>
        </div>
        <div className={'row'} style={{ maxWidth: '600px', margin: '20px auto' }}>
          <div className={'col'}>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="/docs">
              Read the Docs
            </Link>
          </div>
          <div className={'col'}>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="https://github.com/suites-dev/suites">
              Source Code
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout>
      <Head>
        <title>Suites | A Testing Meta-Framework</title>
      </Head>
      <HomepageHeader/>
    </Layout>
  );
}
