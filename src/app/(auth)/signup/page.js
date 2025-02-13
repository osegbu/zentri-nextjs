import SignUp from "@/components/Form/SignUp";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <SignUp />
    </div>
  );
}
