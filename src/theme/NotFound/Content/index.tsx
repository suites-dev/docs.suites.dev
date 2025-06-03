import React from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/NotFound/Content';
import styles from './404.module.css';

export default function NotFoundContent({className}: Props): JSX.Element {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorTitle}>Page Not Found</h2>
        <p className={styles.errorMessage}>
          Oops! The page you're looking for doesn't exist. 
          It might have been moved or deleted.
        </p>
        <div className={styles.suggestions}>
          <p className={styles.suggestionTitle}>Here are some helpful links:</p>
          <div className={styles.buttonGroup}>
            <Link
              className={`${styles.button} button button--primary`}
              to="/">
              Go Home
            </Link>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="/docs">
              Read Docs
            </Link>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="https://github.com/suites-dev/suites">
              GitHub
            </Link>
          </div>
        </div>
        <div className={styles.searchHint}>
          <p>💡 Tip: Try using the search bar above to find what you're looking for.</p>
        </div>
      </div>
      <div className={styles.backgroundDecoration}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>
    </div>
  );
}
