import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img className={styles.logo} src="img/logo.svg" alt="Suites Logo"/>

        <h1 className={styles.title}>{siteConfig.title}</h1>
        <p className={styles.subtitle}>
          Suites is a meta-framework that focuses on helping developers build solid test suites, eliminates boilerplate code, and improves their unit testing process.
        </p>
        <div className={`${styles.buttons} container`}>
          <div className={'row'}>
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
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Suites">
      <HomepageHeader/>
    </Layout>
  );
}
