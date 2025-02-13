"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CreatePost from "../CreatePost/CreatePost";
import PostContent from "../PostContent/PostContent";
import { useStore } from "@/lib/StoreContext";
import styles from "./styles.module.css";
import Cookies from "js-cookie";
import axios from "axios";

const HomeComponent = () => {
  const { state, setPost, setCurrentPage, setHasMore, setIsFetching } =
    useStore();
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const scrollTimeout = useRef(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("sessionData");

  const fetchPosts = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/posts/?offset=${state.page * 10}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPost([...state.post, ...response.data]);
      setCurrentPage(state.page + 1);
      setHasMore(response.data.length > 0);
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, [
    state.page,
    state.post,
    setPost,
    setCurrentPage,
    setHasMore,
    setIsFetching,
    token,
    BASE_URL,
  ]);

  useEffect(() => {
    if (
      !state.isFetching &&
      state.page === 0 &&
      state.auth.id &&
      !hasFetched.current
    ) {
      fetchPosts();
      hasFetched.current = true;
    } else if (state.page) {
      setLoading(false);
    }
  }, [state.auth.id, state.isFetching, state.page, fetchPosts]);

  const handleScroll = useCallback(
    (e) => {
      if (loading || state.isFetching || !state.hasMore) return;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } =
          e.target.scrollingElement;
        if (scrollTop + clientHeight >= scrollHeight - clientHeight) {
          fetchPosts();
        }
      }, 1000);
    },
    [loading, state.isFetching, state.hasMore, fetchPosts]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingPost}>
          <div className={styles.loader}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CreatePost />
      {state.post.length > 0 ? (
        <div className={styles.home}>
          {state.post
            .filter((post) => !post.post_id)
            .map((post) => (
              <PostContent key={post.id} post={post} />
            ))}

          {state.hasMore && state.isFetching && (
            <div className={styles.loadingPost}>
              <div className={styles.loader}></div>
            </div>
          )}
        </div>
      ) : (
        <div className="no-post">
          <h2>No Post Found</h2>
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
