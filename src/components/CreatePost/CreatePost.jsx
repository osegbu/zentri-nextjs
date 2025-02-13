"use client";
import { useStore } from "@/lib/StoreContext";
import styles from "./createpost.module.css";
import InputField from "./InputField";

const CreatePost = () => {
  const { state } = useStore();

  return (
    <section className={styles.container}>
      <InputField />
    </section>
  );
};
export default CreatePost;
