"use client";

import { useEffect, useRef, useState } from "react";
import PostContent from "../PostContent/PostContent";
import { useStore } from "@/lib/StoreContext";
import styles from "./styles.module.css";
import axios from "axios";
import Cookies from "js-cookie";

const BookmarkComponent = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("sessionData");

  const { state, setPost } = useStore();
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef();

  useEffect(() => {
    const FetchPost = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/bookmark`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetched.current && state.auth.id) {
      hasFetched.current = true;
      FetchPost();
    }
  }, [state.auth.id, setPost, token]);

  return (
    <div className={styles.container}>
      {!loading ? (
        <div className={styles.profile}>
          {state.post.length > 0 ? (
            state.post
              .filter((post) => post.bookmark)
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

export default BookmarkComponent;
