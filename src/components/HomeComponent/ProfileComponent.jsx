"use client";

import { useEffect, useRef, useState } from "react";
import PostContent from "../PostContent/PostContent";
import { useStore } from "@/lib/StoreContext";
import styles from "./styles.module.css";

const ProfileComponent = ({ posts, user_id }) => {
  const { state, setPost } = useStore();
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef();

  useEffect(() => {
    const FetchPost = async () => {
      try {
        if (posts) {
          setPost(posts);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    if (!hasFetched.current && state.auth.id) {
      hasFetched.current = true;
      FetchPost();
    }
  }, [state.auth.id, state.post]);

  return (
    <div>
      {!loading ? (
        <div className={styles.profile}>
          {state.post.length > 0 ? (
            state.post
              .filter((post) => post.author.id === user_id && !post.post_id)
              .map((post) => <PostContent key={post.id} post={post} />)
          ) : (
            <div className="no-post">
              <h2>No Post Found</h2>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.loadingPost}>
          <div className={styles.loader}></div>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
