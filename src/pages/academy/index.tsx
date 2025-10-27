import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './academy.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye,
  faPlug,
  faCode,
  faShieldAlt,
  faTools,
  faRecycle,
  faComments,
  faShareAlt,
  faStar,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

interface CoreTenet {
  title: string;
  icon: IconDefinition;
  description: string;
  link: string;
  linkText: string;
}

export default function AcademyIndex(): JSX.Element {
  const pageTitle = "Suites Academy - Master the Art of Testable Code";
  const pageDescription = "Elevate your testing expertise with Suites Academy. Learn advanced concepts, design principles, and expert strategies to write highly testable Node.js applications.";
  const keywords = ["Suites Academy", "Advanced Testing", "Design for Testability", "Testable Code Node.js", "Suites Testing Principles", "Software Design Heuristics", "Unit Testing Best Practices"];

  const coreTenets: CoreTenet[] = [
    {
      title: "Unit Clarity & Responsibility",
      icon: faBullseye,
      description: "Unlock the secrets to crafting focused, maintainable units. Master SRP, encapsulation, and how to design away 'private method testing' dilemmas by refactoring for true clarity.",
      link: "/academy/unit-clarity-responsibility",
      linkText: "Explore Unit Clarity"
    },
    {
      title: "Dependencies & Side Effects",
      icon: faPlug,
      description: "Embrace the 'Inject Everything' mantra! Learn to master dependency injection, manage side effects, limit constructor work, and effectively use mocks, inspired by challenges like the 'geo-location' testability problem.",
      link: "/academy/dependencies-side-effects",
      linkText: "Master Dependencies"
    },
    {
      title: "Code Structure & Simplicity",
      icon: faCode,
      description: "Simplify complex logic and tame messy branching. Leverage composition, pure functions, and strategies to reduce cyclomatic complexity, making your code inherently testable and a joy to work with.",
      link: "/academy/code-structure-simplicity",
      linkText: "Simplify Your Code"
    },
    {
      title: "Boundaries & Interactions",
      icon: faShieldAlt,
      description: "Master the art of isolating I/O and external system calls. Design clear, testable boundaries using Adapters and Gateways for predictable and reliable unit tests.",
      link: "/academy/boundaries-interactions",
      linkText: "Define Boundaries"
    },
    {
      title: "Defensive Coding & Test Maintenance",
      icon: faTools,
      description: "Build resilient code and maintainable tests. Ensure robust inputs, effective error handling, clear test organization, and avoid common pitfalls like test-only conditionals or exposing internals.",
      link: "/academy/defensive-coding-maintenance",
      linkText: "Build Resilient Tests"
    },
    {
      title: "Refactoring for Testability",
      icon: faRecycle,
      description: "Turn hard-to-test code into a shining example of testability. Explore practical refactoring techniques, conquer 'impossible branches,' and discover how Suites supercharges well-designed, testable code.",
      link: "/academy/refactoring-for-testability",
      linkText: "Refactor with Suites"
    }
  ];

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        {keywords.map(kw => <meta name="keywords" content={kw} key={kw} />)}
      </Head>
      <main className={styles.academyMainContent}>
      <div className={clsx("container", styles.academyPageContainer, 'hero hero--primary', styles.heroBanner)}>
        <div className={styles.heroInner}>
          <h1 className={clsx('hero__title', styles.heroTitle)}>Master Suites: The Advanced Learning Hub</h1>
          <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
            Welcome to Suites Academy – your dedicated learning hub for mastering unit testing and writing highly testable code. Whether you're looking to deepen your understanding of testing principles or unlock advanced Suites features, you're in the right place.
          </p>
        </div>
      </div>
      
        <div className="container">
          <section className={styles.sectionWhyAcademy}>
            <div className="alert alert--info" style={{backgroundColor: 'rgba(239, 71, 121, 0.08)', borderLeftColor: '#ef4779', borderLeftWidth: '4px'}}>
              <div className="alert__heading" style={{color: '#ef4779', fontWeight: 'bold'}}>WHY SUITES ACADEMY?</div>
              <p style={{color: '#d1d5db', fontSize: '1.125rem'}}>
                While our main documentation covers the "what" and "how," the Academy reveals the "why" and "when." Dive deep into design principles, architectural patterns, and expert strategies that will transform how you think about testing.
              </p>
            </div>
          </section>

          <section className={styles.sectionDiscover}>
            <h2>What You'll Discover</h2>
            <div className="cards-container">
              {coreTenets.map((tenet) => (
                <div key={tenet.title} className={clsx('card', styles.tenetCard)}>
                  <div className="card__header">
                    <h3>
                      <FontAwesomeIcon icon={tenet.icon} />
                      <span className={styles.cardTitleText}>{tenet.title}</span>
                    </h3>
                  </div>
                  <div className="card__body">
                    <p>{tenet.description}</p>
                  </div>
                  <div className="card__footer">
                    <Link
                      className={clsx('button button--primary button--outline', styles.cardButton)}
                      to={tenet.link}>
                      {tenet.linkText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.sectionWhyTestability}>
            <h2>Why Design for Testability Matters</h2>
            <p>
              Writing testable code isn't just about making tests easier – it's about building better software. When your code is designed with testability in mind:
            </p>
            <ul>
              <li>Tests become simpler – Less setup, fewer mocks, clearer assertions</li>
              <li>Bugs surface faster – Isolated units reveal issues immediately</li>
              <li>Refactoring is safer – Well-tested code gives confidence to improve</li>
              <li>Teams move faster – Clear, testable code is easier to understand and modify</li>
            </ul>
          </section>

          <section className={styles.sectionHowSuitesHelps}>
            <h2>How Suites Amplifies Good Design</h2>
            <p>
              Suites is designed to work seamlessly with well-structured code. When you follow testability principles:
            </p>
            <ul>
              <li>Automatic mocking just works – Clear dependencies are detected and mocked instantly</li>
              <li>Zero boilerplate – Good design eliminates complex test setup</li>
              <li>Faster test execution – Isolated units test in milliseconds</li>
              <li>Better test coverage – Testable code naturally leads to comprehensive tests</li>
            </ul>
          </section>

          <section className={styles.sectionReady}>
             <div className="alert alert--info" style={{backgroundColor: 'rgba(239, 71, 121, 0.08)', borderLeftColor: '#ef4779', borderLeftWidth: '4px'}}>
              <div className="alert__heading" style={{color: '#ef4779', fontWeight: 'bold'}}>READY TO BEGIN?</div>
              <p style={{color: '#d1d5db', fontSize: '1.125rem'}}>
                Start with <Link to="/academy/unit-clarity-responsibility">Unit Clarity & Responsibility</Link> to build a strong foundation, or jump to any topic that interests you. Each module is designed to be self-contained while building on core principles.
              </p>
            </div>
          </section>

          <section className={styles.sectionCommunity}>
            <h2>Join the Community</h2>
            <p>
              Have questions or insights to share? Join our growing community of developers who are passionate about testing excellence:
            </p>
            <div className={styles.communityLinks}>
              <Link className="button button--secondary button--outline" href="https://discord.gg/suites">
                <FontAwesomeIcon icon={faComments} style={{marginRight: '0.5rem'}} />
                Discord Community
              </Link>
              <Link className="button button--secondary button--outline" href="https://twitter.com/suitesdev">
                <FontAwesomeIcon icon={faShareAlt} style={{marginRight: '0.5rem'}} />
                Follow us on Twitter
              </Link>
              <Link className="button button--secondary button--outline" href="https://github.com/suites-dev/suites">
                <FontAwesomeIcon icon={faStar} style={{marginRight: '0.5rem'}} />
                Star us on GitHub
              </Link>
            </div>
          </section>
          
          <hr style={{marginTop: '3rem', marginBottom: '1rem'}} />
          <p style={{textAlign: 'center', fontStyle: 'italic', color: '#d1d5db'}}>
            Remember: Great tests start with great design. Let's build something amazing together.
          </p>
        </div>
      </main>
    </Layout>
  );
} 