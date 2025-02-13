"use client";
import { useStore } from "@/lib/StoreContext";
import styles from "./back.module.css";
import { useRouter } from "next/navigation";

const Back = ({ value }) => {
  const { commentModal, editModal, composeModal } = useStore();
  const router = useRouter();

  const onBackClick = () => {
    commentModal(null);
    editModal(null);
    composeModal(false);
    router.back();
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={() => onBackClick()}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
          <g>
            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
          </g>
        </svg>
      </button>
      {value && <b className={styles.value}>{value}</b>}
    </div>
  );
};
export default Back;
