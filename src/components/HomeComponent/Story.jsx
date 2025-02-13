"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PostContent from "../PostContent/PostContent";
import styles from "./styles.module.css";
import { useStore } from "@/lib/StoreContext";
import Cookies from "js-cookie";
import axios from "axios";

const Story = ({ slug }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("sessionData");

  const { state, setPost } = useStore();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost([response.data]);
    } catch (error) {
      setLoading(false);
    }
  }, [slug, setPost, token, BASE_URL]);

  useEffect(() => {
    if (!hasFetched.current && state.auth.id) {
      if (state.post.length > 0) {
        setLoading(false);
      } else {
        fetchPost();
      }
      hasFetched.current = true;
    } else if (state.post.length > 0) {
      setLoading(false);
    }
  }, [state.auth.id, state.post, fetchPost]);

  const currentPost = state.post.find((post) => post.id == slug);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingPost}>
          <div className={styles.loader}></div>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="no-post">
        <h2>Post not found</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainPost} id="postCover">
        <PostContent post={currentPost} main={true} />
      </div>

      {currentPost.comments.map((commentPost) => (
        <div className={styles.comments} key={commentPost.id}>
          <PostContent post={commentPost} mainPost={currentPost.id} />
        </div>
      ))}
    </div>
  );
};

export default Story;
