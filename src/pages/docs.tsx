import React from 'react';
import { ExploreLink, HomepageFeatures } from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import CodeBlock from '@theme/CodeBlock';

function MainPage() {
  return (
    <div className={`container ${styles.docs}`}>
      <h1>Welcome to Suites</h1>
      <p>
        <strong>
          Suites is an opinionated, <a href="/docs/overview/what-is-suites#suites-as-a-meta-framework">flexible
          testing meta-framework</a> aimed at elevating the software testing experience within backend systems working
          with dependency injection (DI) frameworks.
        </strong>
      </p>
      <p>
        Suites provides a unified testing experience that combines best practices, industry standards, and a wide range
        of testing tools to help developers create robust, maintainable, and scalable test suites, thereby ensuring the
        development of high-quality software.
      </p>

      <HomepageFeatures/>

      <br/>

      <div className={styles.supported}>
        <h2>Supported Mocking Libraries and Dependency Injection Frameworks</h2>
        <p>
          Suites works seamlessly with popular mocking libraries and dependency injection frameworks.
          This means that you can leverage the full power of these libraries and frameworks while enjoying the
          convenience and flexibility that Suites provides.
        </p>
        <Libraries/>
      </div>

      <br/>

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

    // ✅ Test test test
    it('should generate a random user and save to the database', async () => {
      userApi.getRandom.mockResolvedValue({id: 1, name: 'John'} as User);
      await underTest.generateRandomUser();
      expect(database.saveUser).toHaveBeenCalledWith(userFixture);
    });
  });
}`}
        </CodeBlock>
        <ExploreLink/>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Layout>
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
    img: 'img/jest-logo.png',
    name: 'Jest'
  },
  {
    title: 'Sinon',
    link: 'https://sinonjs.org/',
    img: 'img/sinon-logo.png',
    name: 'Sinon'
  },
  {
    title: 'Vitest',
    link: 'https://vitest.io/',
    img: 'img/vitest-logo.png',
    name: 'Vitest'
  },
  {
    title: 'NestJS',
    link: 'https://vitest.io/',
    img: 'img/nestjs-logo.png',
    name: 'Vitest'
  },
  {
    title: 'Inversify',
    link: 'https://vitest.io/',
    img: 'img/inversify-logo.png',
    name: 'Vitest'
  },
];

function Library({title, name, img, link}: LibraryItem) {
  return (
    <div className={styles.library}>
      <a href={link} title={name}>
        <img src={img} alt={title}/>
      </a>
    </div>
  );
}

function Libraries(): JSX.Element {
  return (
    <section className={styles.libraries}>
      {libraries.map((props, idx) => (
        <div key={idx}> {/* Ensure class matches your CSS */}
          <Library {...props} />
        </div>
      ))}
    </section>
  );
}