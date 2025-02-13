"use client";
import { useState, useEffect, useCallback } from "react";
import Footer from "../Mobile/Footer/Footer";
import Navigation from "../Navigation/Navigation";
import Search from "../Search/Search";
import styles from "./layout.module.css";
import { useStore } from "@/lib/StoreContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Layout = ({ children, page }) => {
  const { closePageLoad } = useStore();
  const [scrollingDown, setScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      setScrollingDown(true);
      setShowLogout(false);
    } else {
      setScrollingDown(false);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    closePageLoad();
  }, [children]);

  const router = useRouter();
  const logout = () => {
    setLoading(true);
    Cookies.remove("sessionData", { path: "/" });
    router.push("/login");
  };

  return (
    <div className={styles.page}>
      {page === "Home" && (
        <div
          className={`${styles.mobileHead} ${
            scrollingDown ? styles.hidden : ""
          }`}
        >
          <div className={styles.mainTitle}>Zentri</div>

          <div className={styles.logo}>
            <b>LOGO</b>
          </div>

          <button onClick={() => setShowLogout(!showLogout)}>
            <svg viewBox="0 0 24 24" height="24" width="24">
              <title>menu</title>
              <path d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z"></path>
            </svg>
          </button>

          {showLogout && (
            <div className={styles.logButton} onClick={() => logout()}>
              <svg viewBox="0 0 24 24" className={styles.SVG}>
                <path d="M6 4C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H10C10.5523 20 11 20.4477 11 21C11 21.5523 10.5523 22 10 22H6C4.34315 22 3 20.6569 3 19V5C3 3.34315 4.34315 2 6 2H10C10.5523 2 11 2.44772 11 3C11 3.55228 10.5523 4 10 4H6ZM15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929L17.5858 13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H17.5858L15.2929 8.70711C14.9024 8.31658 14.9024 7.68342 15.2929 7.29289Z"></path>
              </svg>
              <div className={styles.text}>Log Out</div>
              {loading && <div className={styles.loading}></div>}
            </div>
          )}
        </div>
      )}

      <main className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <Navigation />
        </div>

        <div className={styles.container}>{children}</div>
        <div className={styles.rightContainer}>
          <Search />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
