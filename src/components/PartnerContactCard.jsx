"use client";

import { Mail, Phone } from "lucide-react";
import styles from "./PartnerContactCard.module.css";

export default function PartnerContactCard() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.decorTop} aria-hidden="true"></div>
          <div className={styles.decorBottom} aria-hidden="true"></div>
          <div className={styles.contentLeft}>
            <h2 className={styles.title}>
              Organizations that partner with Devaicon achieve measurable
              business impact.
            </h2>
            <p className={styles.subtitle}>Your transformation starts here.</p>
          </div>

          <div className={styles.contentRight}>
            <div className={styles.contactBox}>
              <div className={styles.iconWrap}>
                <div className={styles.iconBg}>
                  <Mail className={styles.icon} />
                </div>
              </div>
              <div className={styles.contactText}>
                <div className={styles.contactTitle}>Send us an email</div>
                <a
                  href="mailto:contact@devaicon.com"
                  className={styles.contactInfo}
                >
                  contact@devaicon.com
                </a>
              </div>
            </div>

            <div className={styles.contactBox}>
              <div className={styles.iconWrap}>
                <div className={styles.iconBg}>
                  <Phone className={styles.icon} />
                </div>
              </div>
              <div className={styles.contactText}>
                <div className={styles.contactTitle}>Give us a call</div>
                <a href="tel:+971507001805" className={styles.contactInfo}>
                  +971 50 700 1805
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
