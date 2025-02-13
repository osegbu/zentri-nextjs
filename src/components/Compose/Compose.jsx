import styles from "./compose.module.css";
import Back from "../Back/Back";
import InputField from "../CreatePost/InputField";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/StoreContext";
import { useEffect } from "react";

const Compose = ({ children, post }) => {
  const { commentModal, editModal, composeModal } = useStore();
  const router = useRouter();

  useEffect(() => {
    const handlePopState = (e) => {
      commentModal(null);
      editModal(null);
      composeModal(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className={styles.main}>
      <section className={styles.container}>
        <section className={styles.scrollDesktop}>
          <div className={styles.mobileBack}>
            <Back value="Create Post" />
          </div>
          <div className={styles.title}>
            <button
              onClick={() => {
                router.back();
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={styles.SVG}
              >
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>
            </button>
          </div>
          <div className={styles.composeCon}>
            {children}
            <InputField post={post} />
          </div>
        </section>
      </section>
    </div>
  );
};

export default Compose;
