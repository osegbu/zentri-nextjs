"use client";
import styles from "./search.module.css";
import { useRouter } from "next/navigation";

const PageSearch = () => {
  const router = useRouter();
  const handleBackNavigation = () => {
    const referrer = document.referrer;
    const isSameDomain =
      referrer && new URL(referrer).origin === window.location.origin;

    router.back();
  };

  return (
    <div className={styles.mainContainer}>
      <button onClick={() => handleBackNavigation()}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.PSVG}>
          <g>
            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
          </g>
        </svg>
      </button>
      <input type="search" placeholder="Search" className={styles.inputField} />
    </div>
  );
};
export default PageSearch;
