import React from 'react';
import { ExploreLink, HomepageFeatures } from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import CodeBlock from '@theme/CodeBlock';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';

function MainPage() {
  return (
    <div className={`container ${styles.docs}`}>
      <div className={'row'}>
        <h1>Welcome to Suites</h1>
        <p>
          <strong>
            Suites is a <a href="/docs/overview/what-is-suites#suites-as-a-meta-framework">progressive, flexible
            testing meta-framework</a> aimed at elevating the software testing experience within backend systems working
            with dependency injection (DI) frameworks.
          </strong>
        </p>
        <p>
          Suites provides a unified testing experience that combines best practices, industry standards, and a wide
          range
          of testing tools to help developers create robust, maintainable, and scalable test suites, thereby ensuring
          the
          development of high-quality software.
        </p>

        <HomepageFeatures />
      </div>

      <div className={'row'} style={{ marginTop: 50 }}>
        <h2>Supported Mocking Libraries and Dependency Injection Frameworks</h2>
        <p>
          Suites works seamlessly with popular mocking libraries and dependency injection frameworks.
          This means that you can leverage the full power of these libraries and frameworks while enjoying the
          convenience and flexibility that Suites provides.
        </p>
        <Libraries />
      </div>

      <div className={'row'} style={{ marginTop: 50 }}>
        <h2>Fluent and Convenient API for Unit Testing</h2>
        <p>
          Suites offers a fluent, convenient, and semantic API that makes writing tests a pleasure. The intuitive design
          of the API ensures that you can quickly set up your tests and focus on verifying the behavior of your
          application.
        </p>

        <div className={styles.codeBlock}>
          <CodeBlock language="typescript" title="user.service.spec.ts">
            {`import { TestBed, Mocked } from '@suites/unit';

describe('User Service Unit Spec', () => {
  let underTest: UserService; // 🧪 Declare the unit under test
  let userApi: Mocked<UserApi>; // 🎭 Declare a mocked dependency

  beforeAll(async () => {
    // 🚀 Create an isolated test env for the unit (under test) + auto generated mock objects
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();

    underTest = unit;
    
    // 🔍 Retrieve a dependency (mock) from the unit
    userApi = unitRef.get(UserApi);
  });

  // ✅ Test test test
  it('should generate a random user and save to the database', async () => {
    userApi.getRandom.mockResolvedValue({id: 1, name: 'John'} as User);
    await underTest.generateRandomUser();
    expect(database.saveUser).toHaveBeenCalledWith(userFixture);
  });
}`}
          </CodeBlock>
          <ExploreLink/>
        </div>
      </div>

      <div className={'row'} style={{ marginTop: 20 }}>
        <h2>Getting Started</h2>
        <p>
          Ready to get started with Suites? Check out the <Link to="/docs/overview/">documentation overview</Link> to
          learn more about
          Suites and how you can use it to improve your testing experience.
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Layout>
      <Head>
        <title>Welcome | Suites Documentation</title>
      </Head>
      <MainPage/>
    </Layout>
  );
}


interface LibraryItem {
  title: string;
  link: string;
  img: string;
  name: string;
}

const libraries: LibraryItem[] = [
  {
    title: 'Jest',
    link: 'https://jestjs.io/',
    img: '/img/jest-logo.png',
    name: 'Jest'
  },
  {
    title: 'Sinon',
    link: 'https://sinonjs.org/',
    img: '/img/sinon-logo.png',
    name: 'Sinon'
  },
  {
    title: 'Vitest',
    link: 'https://vitest.io/',
    img: '/img/vitest-logo.png',
    name: 'Vitest'
  },
  {
    title: 'NestJS',
    link: 'https://docs.nestjs.com',
    img: '/img/nestjs-logo.png',
    name: 'NestJS'
  },
  {
    title: 'Inversify',
    link: 'https://inversify.io/',
    img: '/img/inversify-logo.png',
    name: 'Inversify'
  },
];

function Library({title, name, img, link}: LibraryItem) {
  return (
    <Link href={link} title={name} className={styles.libraryLink}>
      <img src={img} alt={title} className={styles.libraryImage}/>
    </Link>
  );
}

function Libraries(): JSX.Element {
  return (
    <div className={`container ${styles.libraries}`}>
      <div className={'row'}>
        {libraries.map((props, idx) => (
          <div className={`col ${styles.library}`}>
            <Library key={idx} {...props} />
          </div>
        ))}
      </div>
    </div>
  );
}
