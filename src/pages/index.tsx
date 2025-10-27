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
            Master unit testing for dependency injection. Suites automates mocking and simplifies test setup, 
            so you can build reliable and comprehensive test suites, faster.
          </p>
        </div>
        <div className={styles.buttons}>
            <Link
            className={`button button--outline button--primary ${styles.button}`}
              to="/docs">
            <i className="fas fa-book-open"></i> Read the Docs
            </Link>
            <Link
            className={`button button--outline button--primary ${styles.button}`}
              to="https://github.com/suites-dev/suites">
            <i className="fas fa-code"></i> Source Code
            </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <div className={styles.homePage}>
      <Layout 
        wrapperClassName={styles.homeWrapper}
        noFooter={true}>
      <Head>
        <title>Suites | Unit Testing Framework for Dependency Injection</title>
        <meta name="description" content="Suites automates mocking and simplifies test setup for dependency injection frameworks like NestJS and InversifyJS, reducing boilerplate code." />
      </Head>
      <HomepageHeader/>
    </Layout>
    </div>
  );
}
