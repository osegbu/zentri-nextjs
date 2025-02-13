"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./navigation.module.css";
import { useCallback, useEffect, useState } from "react";
import Compose from "../Compose/Compose";
import Image from "next/image";
import user_icon from "@/icons/user.png";
import { useStore } from "@/lib/StoreContext";
import Cookies from "js-cookie";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { state, composeModal, setPageLoad } = useStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const OpenCompose = useCallback(() => {
    if (!state.composeModal) {
      const newUrl = "";
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
    } else {
      router.back();
    }

    composeModal(true);
  }, [state.composeModal]);

  useEffect(() => {
    if (state.composeModal) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [state.composeModal]);

  const navigationLinks = [
    {
      title: "Home",
      href: "/",
      active: pathname === "/",
      activeIcon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
          </g>
        </svg>
      ),
      inactiveIcon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path>
          </g>
        </svg>
      ),
    },
    {
      title: "Profile",
      href: `/profile/${state.auth.user_name}`,
      active: pathname === `/profile/${state.auth.user_name}`,
      activeIcon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path>
          </g>
        </svg>
      ),
      inactiveIcon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
          </g>
        </svg>
      ),
    },
    {
      title: "Search",
      href: "/search",
      active: pathname.includes("search"),
      activeIcon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z"></path>
          </g>
        </svg>
      ),
      inactiveIcon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
          </g>
        </svg>
      ),
    },
    {
      title: "Bookmarks",
      href: "/bookmarks",
      active: pathname.includes("bookmarks"),
      activeIcon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
          </g>
        </svg>
      ),
      inactiveIcon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
          </g>
        </svg>
      ),
    },
  ];
  const logout = () => {
    setLoading(true);
    Cookies.remove("sessionData", { path: "/" });
    router.push("/login");
  };

  const customLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.logo} onClick={() => router.push("/")}>
          <b>Zentri</b>
        </div>
      </div>

      <div className={styles.topPart}>
        {navigationLinks.map((link, index) => (
          <Link
            key={index}
            prefetch={false}
            className={`${styles.linkList} ${link.active && styles.active}`}
            title={link.title}
            href={link.href}
            onClick={() => setPageLoad()}
          >
            <button className={styles.linkButton}>
              {link.active ? link.activeIcon : link.inactiveIcon}
              <div className={styles.linkText}>{link.title}</div>
            </button>
          </Link>
        ))}

        <div className={styles.createPost} onClick={() => OpenCompose()}>
          <button className={styles.composeButton}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
              <g>
                <path d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"></path>
              </g>
            </svg>
          </button>

          <b>Post</b>
        </div>
      </div>

      <div className={styles.bottomProfile}>
        {open && (
          <div className={styles.options} onClick={() => logout()}>
            <div className={styles.optionsEl}>
              <svg viewBox="0 0 24 24" className={styles.SVG}>
                <path d="M6 4C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H10C10.5523 20 11 20.4477 11 21C11 21.5523 10.5523 22 10 22H6C4.34315 22 3 20.6569 3 19V5C3 3.34315 4.34315 2 6 2H10C10.5523 2 11 2.44772 11 3C11 3.55228 10.5523 4 10 4H6ZM15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929L17.5858 13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H17.5858L15.2929 8.70711C14.9024 8.31658 14.9024 7.68342 15.2929 7.29289Z"></path>
              </svg>
              <div className={styles.text}>Log Out</div>
              {loading && <div className={styles.loading}></div>}
            </div>
          </div>
        )}

        <div className={styles.userProfile} onClick={() => setOpen(!open)}>
          <div className={styles.profileImage}>
            <Image
              loader={customLoader}
              src={state.auth.profile_image || user_icon}
              alt={`${state.auth.full_name} profile image`}
              width={45}
              height={45}
              priority
            />
          </div>
          <div className={styles.username}>{state.auth.full_name}</div>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={styles.threeDots}
          >
            <g>
              <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
            </g>
          </svg>
        </div>
      </div>
      {state.composeModal && <Compose />}
    </div>
  );
};
export default Navigation;
