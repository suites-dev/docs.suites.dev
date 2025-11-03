import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import CodeBlock from "@theme/CodeBlock";
import styles from "./index.module.css";
import Head from "@docusaurus/Head";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.textColumn}>
            <h1 className={styles.title}>Suites</h1>
            <p className={styles.subtitle}>
              The testing framework for reliable and scalable backend TypeScript
              applications.
            </p>
            <div className={styles.buttonGroup}>
              <Link
                className={`${styles.button} ${styles.buttonPrimary} button button--primary`}
                to="/docs/overview"
              >
                Get Started
              </Link>
              <Link
                className={`${styles.button} button button--outline button--primary`}
                to="/docs/overview/why-suites"
              >
                Why Suites?
              </Link>
              <Link
                className={`${styles.button} button button--outline button--primary`}
                to="/docs/developer-guide"
              >
                Learn
              </Link>
              <Link
                className={`${styles.button} button button--outline button--primary`}
                to="https://github.com/suites-dev/suites"
              >
                View on GitHub
              </Link>
            </div>
            <div className={styles.worksWithSection}>
              <p className={styles.worksWithTitle}>Works with projects using</p>
              <div className={styles.logoGrid}>
                <div className={styles.logoItem}>
                  <img
                    src="/img/nestjs-logo.png"
                    alt="NestJS"
                    className={styles.logoImage}
                  />
                  <span className={styles.logoName}>NestJS</span>
                  <span className={styles.recommendedBadge}>Official</span>
                </div>
                <div className={styles.logoItem}>
                  <img
                    src="/img/inversify-logo.png"
                    alt="InversifyJS"
                    className={styles.logoImage}
                  />
                  <span className={styles.logoName}>InversifyJS</span>
                </div>
                <div className={styles.logoItem}>
                  <img
                    src="/img/vitest-logo.png"
                    alt="Vitest"
                    className={styles.logoImage}
                  />
                  <span className={styles.logoName}>Vitest</span>
                </div>
                <div className={styles.logoItem}>
                  <img
                    src="/img/jest-logo.png"
                    alt="Jest"
                    className={styles.logoImage}
                  />
                  <span className={styles.logoName}>Jest</span>
                </div>
                <div className={styles.logoItem}>
                  <img
                    src="/img/sinon-logo.png"
                    alt="Sinon"
                    className={styles.logoImage}
                  />
                  <span className={styles.logoName}>Sinon</span>
                </div>
                <div className={styles.logoItem}>
                  <div className={styles.plusIcon}>+</div>
                  <span className={styles.logoName}>more</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.codeColumn}>
            <CodeBlock
              language="typescript"
              className={styles.codeBlock}
              showLineNumbers={false}
            >
              {`import { TestBed, type Mocked } from '@suites/unit';

describe('User Service', () => {
  let userService: UserService; // 🧪 The unit we are testing
  let userApi: Mocked<UserApi>; // 🎭 The dependency we are mocking

  beforeAll(async () => {
    // 🚀 Create an isolated test env for the unit
    const testBed = await TestBed.solitary(UserService).compile();

    userService = testBed.unit;    
    // 🔍 Retrieve the unit's dependency mock - automatically generated
    userApi = testBed.unitRef.get(UserApi);
  });

  // ✅ Test test test
  it('should generate a random user and save to the database', async () => {
    userApi.getRandom.mockResolvedValue({id: 1, name: 'John'} as User);
    await userService.generateRandomUser();
    expect(database.saveUser).toHaveBeenCalledWith(userFixture);
  });
});`}
            </CodeBlock>
          </div>
        </div>
        <div className={styles.featuresSection}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureEmoji}>👩‍💻</div>
              <h3 className={styles.featureTitle}>Declarative</h3>
              <p className={styles.featureDescription}>
                An opinionated declarative API: wrap your unit with a single
                call and receive a correct test environment for testing the
                unit. No more manual mocking and wiring up dependencies.
              </p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureEmoji}>✅</div>
              <h3 className={styles.featureTitle}>Type-Safe</h3>
              <p className={styles.featureDescription}>
                Create type-safe mocks, bound to the implementation and allows
                calling only the correct dependency methods. No more broken
                tests after refactors and no more silent failures.
              </p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureEmoji}>🕵️‍♂️</div>
              <h3 className={styles.featureTitle}>Smart Mock Tracking</h3>
              <p className={styles.featureDescription}>
                Automatically track all dependency methods used during your
                tests and get notified if a mocked dependency method has no
                return value or missing mock implementation
              </p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureEmoji}>✨</div>
              <h3 className={styles.featureTitle}>AI Ready</h3>
              <p className={styles.featureDescription}>
                With the concise, type safe, and fail-fast format of Suites
                tests, coding agents (like Claude Code and Cursor) are able to
                write correct tests in a single pass.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.trustedBySection}>
          <p className={styles.trustedByTitle}>Trusted by</p>
          <div className={styles.trustedByGrid}>
            <div className={styles.trustedByItem}>
              <img
                src="/img/monday-logo.svg"
                alt="Monday.com"
                className={styles.trustedByLogo}
              />
            </div>
            <div className={styles.trustedByItem}>
              <img
                src="/img/lemonade-logo.svg"
                alt="Lemonade"
                className={styles.trustedByLogo}
              />
            </div>
            <div className={styles.trustedByItem}>
              <img
                src="/img/balance-logo.svg"
                alt="Balance"
                className={styles.trustedByLogo}
              />
            </div>
            <div className={styles.trustedByItem}>
              <img
                src="/img/harmonya-logo.svg"
                alt="Harmonya"
                className={styles.trustedByLogo}
              />
            </div>
          </div>
        </div>

        <section className={styles.alternatingSection}>
          <div className={styles.textColumn}>
            <h2>Zero-Setup, Automatic Mocking</h2>
            <p>
              Say goodbye to manual mocking. Suites automatically generates
              mocks for all your dependencies, letting you focus on writing
              meaningful tests, not boilerplate.
            </p>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="/docs/developer-guide/unit-tests/test-doubles"
            >
              Learn about Mocking →
            </Link>
          </div>
          <CodeBlock language="typescript" className={styles.codeBlock}>
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
        </section>

        <section className={styles.alternatingSection}>
          <div className={styles.textColumn}>
            <h2>Flexible and Scalable by Design</h2>
            <p>
              Whether you're working on a small microservice or a large-scale
              monolith, Suites' flexible architecture adapts to your needs,
              ensuring your test suites remain maintainable as your project
              grows.
            </p>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="/docs/developer-guide/unit-tests/fundamentals"
            >
              Explore Test Strategies →
            </Link>
          </div>
          <CodeBlock language="typescript" className={styles.codeBlock}>
            {`// Test a class in complete isolation
TestBed.solitary(OrderService).compile();

// Or, test how it integrates with a real dependency
TestBed.sociable(OrderService)
  .expose(PaymentProcessor) // Use the real class
  .compile();`}
          </CodeBlock>
        </section>

        <section className={styles.alternatingSection}>
          <div className={styles.textColumn}>
            <h2>An Intuitive, Fluent API</h2>
            <p>
              Suites provides a clean and semantic API that makes writing tests
              a pleasure. The intuitive design of the TestBed builder keeps your
              test code readable and maintainable.
            </p>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="/docs/developer-guide/unit-tests/suites-api"
            >
              Browse the API Reference →
            </Link>
          </div>
          <CodeBlock language="typescript" className={styles.codeBlock}>
            {`const { unit, unitRef } = await TestBed
  .solitary(ComplexService)
  .mock(Logger) // Override with a custom mock
  .final({
    // Provide custom values or configurations
    token: 'API_KEY', 
    value: 'test-api-key' 
  })
  .compile();`}
          </CodeBlock>
        </section>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout>
      <Head>
        <title>Suites | Unit Testing Framework for Dependency Injection</title>
        <meta
          name="description"
          content="Suites automates mocking and simplifies test setup for dependency injection frameworks like NestJS and InversifyJS, reducing boilerplate code."
        />
      </Head>
      <HomepageHeader />
    </Layout>
  );
}
