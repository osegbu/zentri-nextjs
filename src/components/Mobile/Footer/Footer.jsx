"use client";
import Compose from "@/components/Compose/Compose";
import { useEffect, useCallback } from "react";
import styles from "./footer.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import user_icon from "@/icons/user.png";
import { useStore } from "@/lib/StoreContext";

const Footer = () => {
  const { state, composeModal, setPageLoad } = useStore();
  const pathname = usePathname();

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

  const links = [
    {
      title: "Home",
      href: "/",
      active: pathname === "/",
      icon:
        pathname === "/" ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
            <g>
              <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
            </g>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
            <g>
              <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path>
            </g>
          </svg>
        ),
    },
    {
      title: "Search",
      href: "/search",
      active: pathname.includes("search"),
      icon: pathname.includes("search") ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z"></path>
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
          </g>
        </svg>
      ),
    },
    {
      title: "Add Post",
      onClick: OpenCompose,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"></path>
          </g>
        </svg>
      ),
    },
    {
      title: "Bookmarks",
      href: "/bookmarks",
      active: pathname.includes("bookmarks"),
      icon: pathname.includes("bookmarks") ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
          </g>
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {state.composeModal && <Compose />}
      {links.map((link, index) => (
        <div key={index} className={styles.linkList}>
          {link.onClick ? (
            <button
              className={`${styles.linkButton} ${styles.addPost}  ${
                link.active ? styles.active : ""
              }`}
              onClick={link.onClick}
            >
              {link.icon}
            </button>
          ) : (
            <Link href={link.href} onClick={() => setPageLoad()}>
              <button
                className={`${styles.linkButton} ${
                  link.active ? styles.active : ""
                }`}
              >
                {link.icon}
              </button>
            </Link>
          )}
        </div>
      ))}

      <Link
        className={`${styles.linkList} ${
          pathname.includes("profile") && styles.active
        }`}
        prefetch={false}
        title="Profile"
        href={`/profile/${state.auth.user_name}`}
        onClick={() => setPageLoad()}
      >
        <button className={styles.profileImage}>
          <Image
            src={state.auth.profile_image || user_icon}
            alt={`${state.auth.full_name} profile image`}
            width={45}
            height={45}
          />
        </button>
      </Link>
    </div>
  );
};

export default Footer;
