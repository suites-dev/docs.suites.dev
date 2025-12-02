import React from "react";
import Link from "@docusaurus/Link";
import { FaGithub } from "react-icons/fa";
import styles from "./styles.module.css";

export default function Footer(): JSX.Element {
  return (
    <footer className={styles.pageFooter}>
      <div className="container">
        <div className={styles.socialWrapper}>
          <Link
            href="https://github.com/suites-dev/suites"
            target="_blank"
            className={styles.icon}
          >
            <FaGithub />
          </Link>
        </div>
        <p>
          Released under the MIT License
          <br />
          Copyright © 2025 -{" "}
          <Link href="http://omermorad.me/" target="_blank">
            Omer Morad
          </Link>
        </p>
      </div>
    </footer>
  );
}
