import React from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAreaChart,
  faArrowRight,
  faArrowUpWideShort,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

type FeatureItem = {
  title: string;
  description: JSX.Element;
  icon: IconDefinition;
  link: {
    ref: string;
    text: string;
  };
};

const FeatureList: FeatureItem[] = [
  {
    title: "Zero-Setup, Automatic Mocking",
    description: (
      <>
        <p className={styles.description}>
          Automatically generate mock objects, eliminate manual setup and reduce
          boilerplate code of your unit tests
        </p>
      </>
    ),
    icon: faAreaChart,
    link: {
      ref: "/docs/guides/",
      text: "Developer Guide",
    },
  },
  {
    title: "Scale Your Test Suites",
    description: (
      <>
        <p className={styles.description}>
          Suites' flexible architecture supports projects of all sizes, from
          small microservices to large monoliths
        </p>
      </>
    ),
    icon: faArrowUpWideShort,
    link: {
      ref: "/docs/get-started/",
      text: "Getting Started",
    },
  },
];

function Feature({ title, description, icon, link }: FeatureItem) {
  return (
    <div>
      <div className={styles.heading}>
        <FontAwesomeIcon icon={icon} className={styles.icon} />
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
      <div className={styles.buttons}>
        <a
          className={`${styles.button} button button--primary button--outline`}
          href={link.ref}
        >
          {link.text} &nbsp;
          <FontAwesomeIcon icon={faArrowRight} />
        </a>
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
            <div className={`col ${styles.feature}`} key={idx}>
              {" "}
              {/* Ensure class matches your CSS */}
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
      &nbsp;&nbsp;
      <a
        href="/docs/get-started/quickstart"
        className="button button--outline button--primary"
      >
        Quick Start &nbsp;
        <FontAwesomeIcon icon={faArrowRight} />
      </a>
    </div>
  );
}
