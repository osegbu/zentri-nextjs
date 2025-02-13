import Login from "@/components/Form/Login";
import styles from "./page.module.css";

export const metadata = {
  title: "Zentri - Login",
  description: "Zentri Login Page",
};

export default function Home() {
  return (
    <div className={styles.container}>
      <Login />
    </div>
  );
}
