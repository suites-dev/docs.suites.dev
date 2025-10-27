import React from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBolt, faLayerGroup, faCode } from '@fortawesome/free-solid-svg-icons';
import styles from './docs.module.css';

const libraries = [
  { name: 'Jest', logo: '/img/jest-logo.png', url: 'https://jestjs.io/' },
  { name: 'Sinon', logo: '/img/sinon-logo.png', url: 'https://sinonjs.org/' },
  { name: 'Vitest', logo: '/img/vitest-logo.png', url: 'https://vitest.dev/' },
  { name: 'NestJS', logo: '/img/nestjs-logo.png', url: 'https://nestjs.com/' },
  { name: 'Inversify', logo: '/img/inversify-logo.png', url: 'https://inversify.io/' },
];

export default function DocsPage() {
  return (
    <Layout wrapperClassName={styles.pageWithGradient}>
      <Head>
        <title>Documentation | Suites</title>
        <meta name="description" content="Explore the official documentation for Suites, a progressive unit-testing framework for dependency injection." />
      </Head>
      <main className={styles.docsPage}>
        <header className={styles.header}>
          <h1>A Modern Approach to Unit Testing</h1>
          <p>
            Suites is a progressive framework that elevates the testing experience 
            by automating mocks and simplifying setup for dependency injection systems.
          </p>
        </header>

        <section className={styles.alternatingSection}>
          <div className={styles.textColumn}>
            <div className={styles.eyebrow}>Productivity</div>
            <h2>Zero-Setup, Automatic Mocking</h2>
            <p>
              Say goodbye to manual mocking. Suites automatically generates mocks 
              for all your dependencies, letting you focus on writing meaningful tests, 
              not boilerplate.
            </p>
            <Link className={styles.ctaCard} to="/docs/overview/quickstart">
              <FontAwesomeIcon icon={faBolt} className={styles.ctaIcon} />
              <div className={styles.ctaText}>
                <strong>Learn about Mocking</strong>
                <span>Learn more →</span>
              </div>
            </Link>
          </div>
          <div className={styles.visualColumn}>
            <CodeBlock language="typescript" title="user.service.spec.ts" className={styles.codeBlock}>
{`// No manual mocks needed!
// Just compile the testbed for your class.
const { unit, unitRef } = await TestBed
  .solitary(UserService)
  .compile();

// Retrieve any dependency as a fully-typed mock.
const userApi = unitRef.get(UserApi);

// Focus on the test logic.
userApi.get.mockResolvedValue({ name: 'John' });`}
            </CodeBlock>
          </div>
        </section>
        
        <section className={styles.alternatingSection}>
          <div className={styles.textColumn}>
            <div className={styles.eyebrow}>Flexibility</div>
            <h2>Flexible and Scalable by Design</h2>
            <p>
              Whether you're working on a small microservice or a large-scale 
              monolith, Suites' flexible architecture adapts to your needs, 
              ensuring your test suites remain maintainable as your project grows.
            </p>
            <Link className={styles.ctaCard} to="/docs/developer-guide/unit-tests/sociable">
               <FontAwesomeIcon icon={faLayerGroup} className={styles.ctaIcon} />
               <div className={styles.ctaText}>
                <strong>Explore Test Strategies</strong>
                <span>Learn more →</span>
              </div>
            </Link>
          </div>
          <div className={styles.visualColumn}>
             <CodeBlock language="typescript" title="Test different scenarios" className={styles.codeBlock}>
{`// Test a class in complete isolation
TestBed.solitary(OrderService).compile();

// Or, test how it integrates with a real dependency
TestBed.sociable(OrderService)
  .expose(PaymentProcessor) // Use the real class
  .compile();`}
            </CodeBlock>
          </div>
        </section>

        <section className={styles.alternatingSection}>
          <div className={styles.textColumn}>
            <div className={styles.eyebrow}>API Design</div>
            <h2>An Intuitive, Fluent API</h2>
            <p>
              Suites provides a clean and semantic API that makes writing tests a pleasure. 
              The intuitive design of the TestBed builder keeps your test code readable and maintainable.
            </p>
            <Link className={styles.ctaCard} to="/docs/developer-guide/unit-tests/suites-api">
               <FontAwesomeIcon icon={faCode} className={styles.ctaIcon} />
              <div className={styles.ctaText}>
                <strong>Browse the API Reference</strong>
                <span>Learn more →</span>
              </div>
            </Link>
          </div>
          <div className={styles.visualColumn}>
             <CodeBlock language="typescript" title="Readable test setup" className={styles.codeBlock}>
{`const { unit, unitRef } = await TestBed
  .solitary(ComplexService)
  .mock(Logger) // Override with a custom mock
  .provide({
    // Provide custom values or configurations
    token: 'API_KEY', 
    value: 'test-api-key' 
  })
  .compile();`}
            </CodeBlock>
          </div>
        </section>

        <section className={styles.librariesSection}>
          <h2>Seamless Integration</h2>
          <p>Works with the tools you already know and love.</p>
          <div className={styles.libraries}>
            {libraries.map((lib) => (
              <Link href={lib.url} title={lib.name} key={lib.name}>
                <img src={lib.logo} alt={lib.name} className={styles.libraryLogo} />
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.finalCta}>
            <h2>Ready to Dive In?</h2>
            <p>Explore our quick start guide and begin writing better tests in minutes.</p>
            <Link className={'button button--primary button--lg'} to="/docs/overview/quickstart" style={{marginTop: '1rem'}}>
                <FontAwesomeIcon icon={faBook} style={{marginRight: '0.75rem'}}/> Get Started
            </Link>
        </section>
      </main>
    </Layout>
  );
}
