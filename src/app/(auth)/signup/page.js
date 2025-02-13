import SignUp from "@/components/Form/SignUp";
import styles from "./page.module.css";

export const metadata = {
  title: "Zentri - Signup",
  description: "Zentri Signup Page",
};

export default function Home() {
  return (
    <div className={styles.container}>
      <SignUp />
    </div>
  );
}
