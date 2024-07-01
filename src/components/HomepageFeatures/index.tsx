import React from 'react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🚀 Zero-Setup Mocking',
    description: (
      <>
        <strong>Dive straight into testing without the hassle.</strong> Automatically generate mock
        objects, eliminate manual setup and reduce boilerplate code.
      </>
    ),
  },
  {
    title: '🌟 Seamless Integration',
    description: (
      <>
        <strong>Suites seamlessly integrates with popular DI frameworks like NestJS and InversifyJS.</strong>
        This ensures that you can start using Suites immediately with your existing projects.
      </>
    ),
  },
  {
    title: '⚡ Optimized Performance',
    description: (
      <>
        <strong>By bypassing the DI container load, Suites ensures your unit tests run significantly
          faster.</strong> This lets you focus on development without unnecessary waits.
      </>
    ),
  },
  {
    title: '📄 Consistent Test Suites Structure',
    description: (
      <>
        <strong>Achieve a uniform approach to unit testing</strong>
        Test suites will follow a consistent syntax and structure, making them easier to
        read and maintain.
      </>
    ),
  }
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={styles.feature}>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <div className={'col col--6'} key={idx}> {/* Ensure class matches your CSS */}
              <Feature {...props} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExploreLink(): JSX.Element {
  return (
    <div className={styles.buttons}>
      <a href="/docs/getting-started" className="button button--outline button--primary">
        Explore Suites API 📚
      </a>
      &nbsp;&nbsp;
      <a href="/docs/getting-started" className="button button--outline button--primary">
        See Developer Guide 🚀
      </a>
    </div>
  )
}