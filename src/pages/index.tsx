import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import styles from "./index.module.css";
import Head from "@docusaurus/Head";
import { FaGithub } from "react-icons/fa";
import { trackButtonClick } from "../utils/analytics";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.textColumn}>
            <h1 className={styles.title}>Suites</h1>
            <p className={styles.subtitle}>
              <strong>
                A unit-testing framework for TypeScript backends working with
                inversion of control and dependency injection
              </strong>
            </p>
            <div className={styles.buttonGroup}>
              <Link
                className={`${styles.button} ${styles.buttonPrimary} button button--primary`}
                to="/docs/get-started/"
                onClick={() => trackButtonClick("get_started", "homepage_hero")}
              >
                Get Started
              </Link>
              <Link
                className={`${styles.button} button button--outline button--primary`}
                to="/docs/get-started/why-suites"
                onClick={() => trackButtonClick("why_suites", "homepage_hero")}
              >
                Why Suites?
              </Link>
              <Link
                className={`${styles.button} button button--outline button--primary`}
                to="/docs/guides/"
                onClick={() => trackButtonClick("guides", "homepage_hero")}
              >
                Guides
              </Link>
              <Link
                className={`${styles.button} button button--outline button--primary`}
                to="https://github.com/suites-dev/suites"
                onClick={() => trackButtonClick("github", "homepage_hero")}
              >
                <FaGithub
                  style={{
                    marginRight: "8px",
                    verticalAlign: "middle",
                    position: "relative",
                    top: "-1px",
                  }}
                />
                GitHub
              </Link>
            </div>
            <div className={styles.worksWithSection}>
              <p className={styles.worksWithTitle}>Works with projects using</p>
              <div className={styles.logoGrid}>
                <a
                  href="https://docs.nestjs.com/recipes/suites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.logoItem}
                >
                  <img
                    src="/img/nestjs-logo.png"
                    alt="NestJS"
                    className={styles.logoImage}
                  />
                  <span className={styles.logoName}>NestJS</span>
                  <span className={styles.recommendedBadge}>Official</span>
                </a>
                <a
                  href="https://inversify.io/docs/ecosystem/suites/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.logoItem}
                >
                  <img
                    src="/img/inversify-logo.png"
                    alt="InversifyJS"
                    className={styles.logoImage}
                  />
                  <span className={styles.logoName}>InversifyJS</span>
                  <span className={styles.recommendedBadge}>Official</span>
                </a>
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
            <Tabs defaultValue="with-suites" groupId="suites-comparison">
              <TabItem value="with-suites" label="With Suites">
                <CodeBlock
                  language="typescript"
                  className={styles.codeBlock}
                  showLineNumbers={false}
                >
                  {`import { TestBed, type Mocked } from '@suites/unit';

describe('User Service', () => {
  let userService: UserService; // The unit we are testing
  let userApi: Mocked<UserApi>; // The dependencies we are mocking
  let database: Mocked<Database>;

  beforeAll(async () => {
    // Create an isolated test env for the unit
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();

    userService = unit;    
    // Retrieve the unit's dependency mocks - automatically generated
    userApi = unitRef.get(UserApi);
    database = unitRef.get(Database);
  });

  // ✅ Test test test
  it('should generate a random user and save to the database', async () => {
    userApi.getRandom.mockResolvedValue({id: 1, name: 'John'} as User);
    await userService.generateRandomUser();
    expect(database.saveUser).toHaveBeenCalledWith(userFixture);
  });
});`}
                </CodeBlock>
              </TabItem>
              <TabItem value="without-suites" label="Without Suites">
                <CodeBlock
                  language="typescript"
                  className={styles.codeBlock}
                  showLineNumbers={false}
                >
                  {`// THE MANUAL WAY
// (Similar complexity exists in NestJS, InversifyJS, etc.)

import { UserService } from './user-service';
import { UserApi } from './user-api';
import { Database } from './database';

describe('User Service', () => {
  let userService: UserService;
  let userApi: any; // ❌ Lost type safety!
  let database: any;

  beforeAll(async () => {
    // 🔧 Manually create mocks for each dependency
    userApi = {
      getRandom: jest.fn(),
      // Missing methods? Who knows? No compile-time checks!
    };

    database = {
      saveUser: jest.fn(),
      // What other methods exist? ¯\\_(ツ)_/¯
    };

    // Manual wiring - boilerplate for every test
    userService = new UserService(userApi, database);
  });

  it('should generate a random user and save to the database', async () => {
    userApi.getRandom.mockResolvedValue({id: 1, name: 'John'} as User);
    await userService.generateRandomUser();
    expect(database.saveUser).toHaveBeenCalledWith(userFixture);
  });
}`}
                </CodeBlock>
              </TabItem>
            </Tabs>
          </div>
        </div>
        <div className={styles.featuresSection}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureEmoji}>👩‍💻</div>
              <h3 className={styles.featureTitle}>Declarative</h3>
              <p className={styles.featureDescription}>
                One function call creates fully-typed, isolated test
                environments. Suites auto-generates all mocks and wires
                dependencies automatically. No manual setup, no type casts, no
                boilerplate.
              </p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureEmoji}>✅</div>
              <h3 className={styles.featureTitle}>Type-Safe</h3>
              <p className={styles.featureDescription}>
                Generate type-safe mocks bound to implementations. Eliminate
                broken tests after refactors, silent runtime failures, and
                manual type casting.
              </p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureEmoji}>🔄</div>
              <h3 className={styles.featureTitle}>Refactoring Confidence</h3>
              <p className={styles.featureDescription}>
                Change constructors, add dependencies, refactor classes - tests
                adapt automatically. Skip manual mock updates. Catch breaking
                changes at compile time, not runtime.
              </p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureEmoji}>✨</div>
              <h3 className={styles.featureTitle}>AI Ready</h3>
              <p className={styles.featureDescription}>
                One canonical pattern teaches AI agents the entire API. Coding
                agents like Claude Code and Cursor write correct tests in a
                single pass with 95% less context consumption compared to manual
                mocking patterns.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.trustedBySection}>
          <p className={styles.trustedByTitle}>Used by</p>
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
            <div className={styles.trustedByItem}>
              <img
                src="/img/vetric.svg"
                alt="Vetric"
                className={styles.trustedByLogo}
              />
            </div>
          </div>
          <p className={styles.shareExperience}>
            Using Suites?{" "}
            <a
              href="https://github.com/suites-dev/suites/discussions/655"
              target="_blank"
              rel="noopener noreferrer"
            >
              Share your experience
            </a>{" "}
            and help us shape the future of Suites
          </p>
        </div>

        <section className={styles.alternatingSection}>
          <div className={styles.textColumn}>
            <h2>One Testing Pattern for Entire Organization</h2>
            <p>
              Stop relearning test patterns on every project. Suites provides a
              consistent, standardized approach that works identically across
              NestJS, InversifyJS, and any DI framework, giving teams a unified
              testing experience.
            </p>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="/docs/get-started/why-suites#3-inconsistent-patterns-across-teams"
            >
              See Framework Support →
            </Link>
          </div>
          <CodeBlock language="typescript" className={styles.codeBlock}>
            {`// Same pattern works everywhere
// NestJS, InversifyJS, TSyringe...

TestBed.solitary(OrderService).compile();

// Or test with real dependencies
TestBed.sociable(OrderService)
  .expose(PaymentProcessor)
  .compile();`}
          </CodeBlock>
        </section>

        <section className={styles.alternatingSection}>
          <div className={styles.textColumn}>
            <h2>Tests That Reveal Intent, Not Boilerplate</h2>
            <p>
              Suites' declarative API removes 90% of test setup code. No more
              scrolling through mock wiring, logic is front and center. New team
              members write tests on day one, not day ten.
            </p>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="/docs/get-started/quickstart"
            >
              See Quick Start →
            </Link>
          </div>
          <CodeBlock language="typescript" className={styles.codeBlock}>
            {`// One line creates the entire test environment
const { unit, unitRef } = await TestBed
  .solitary(UserService)
  .compile();

// Just test the logic
const userApi = unitRef.get(UserApi);
userApi.getRandom.mockResolvedValue(user);
await unit.generateRandomUser();`}
          </CodeBlock>
        </section>

        <section className={styles.alternatingSection}>
          <div className={styles.textColumn}>
            <h2>Type-Safe, Automatic Mocking</h2>
            <p>
              No more debugging broken mocks. Suites automatically generates
              fully-typed mocks bound to implementation. Catch errors at compile
              time, not runtime. Refactor with confidence while mocks stay valid
              when dependencies change.
            </p>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="/docs/guides/test-doubles"
            >
              Learn about Mocking →
            </Link>
          </div>
          <CodeBlock language="typescript" className={styles.codeBlock}>
            {`// No manual mocks needed!
const { unit, unitRef } = await TestBed
  .solitary(UserService)
  .compile();

// Fully-typed mocks, automatically generated
const userApi = unitRef.get(UserApi);

userApi.get.mockResolvedValue({ name: 'John' });`}
          </CodeBlock>
        </section>

        <section className={styles.alternatingSection}>
          <div className={styles.textColumn}>
            <h2>Built for AI-First Development</h2>
            <p>
              Manual mocking forces AI agents to hold 40+ lines of boilerplate
              per test in context. Suites provides one canonical pattern that
              reduces token consumption by 95%. AI coding assistants like Claude
              Code, Cursor, and GitHub Copilot generate accurate tests in a
              single pass without burning tokens on repetitive setup code.
            </p>
            <Link
              className={`${styles.button} button button--outline button--primary`}
              to="/docs/get-started/why-suites#2-excessive-boilerplate-obscures-test-intent-and-confuses-llms"
            >
              Suites and AI →
            </Link>
          </div>
          <CodeBlock language="typescript" className={styles.codeBlock}>
            {`// Manual: 40+ lines per test in AI context
// class MockUserApi { getRandom = jest.fn(); ... }
// class MockDatabase { saveUser = jest.fn(); ... }
// const userService = new UserService(mockUserApi, mockDb);

// Suites: Single canonical pattern
const { unit, unitRef } = await TestBed
  .solitary(UserService)
  .compile();

// AI agents learn the entire API from one example`}
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
