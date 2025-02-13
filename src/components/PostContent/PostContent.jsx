"use client";
import styles from "./postContent.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import user_icon from "@/icons/user.png";
import Compose from "../Compose/Compose";
import CommentPost from "./CommentPost";
import { useStore } from "@/lib/StoreContext";
import Poll from "./Poll";
import axios from "axios";
import Cookies from "js-cookie";
import ImageViewer from "./ImageViewer";

const PostContent = ({ post, main, mainPost }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("sessionData");

  const {
    state,
    commentModal,
    editModal,
    optionsMenu,
    removePost,
    setPageLoad,
    updatePost,
  } = useStore();
  const [userLike, setUserLike] = useState();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const router = useRouter();

  const openImageViewer = (image) => {
    setActiveImage(image);
    setViewerOpen(true);
  };

  const closeImageViewer = () => {
    setViewerOpen(false);
    setActiveImage(null);
  };

  const OpenEditModal = useCallback(() => {
    if (state.commentModal !== post.id) {
      const newUrl = "";
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
    } else {
      router.back();
    }

    editModal(post.id);
  }, [state, router]);

  const OpenCommentModal = useCallback(() => {
    if (state.commentModal !== post.id) {
      const newUrl = "";
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
    } else {
      router.back();
    }

    commentModal(post.id);
  }, [state, router]);

  useEffect(() => {
    if (state.commentModal || state.editModal) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [state]);

  const timeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return `Just now`;
    }
  };

  const LikePost = async () => {
    setIsLoading(true);
    try {
      let response;
      if (!userLike) {
        response = await axios.post(
          `${BASE_URL}/like/${post.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.delete(`${BASE_URL}/like/${post.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      updatePost(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error.response?.data?.detail);
    }
  };

  const BookMarkPost = async () => {
    setLoading(true);
    try {
      let response;
      if (!post.bookmark) {
        response = await axios.post(
          `${BASE_URL}/bookmark/${post.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.delete(`${BASE_URL}/bookmark/${post.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      updatePost(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response?.data?.detail);
    }
  };

  const handleDeletePost = useCallback(() => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios
        .delete(`${BASE_URL}/posts/${post.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          removePost(post.id, mainPost);
          if (main) router.back();
        })
        .catch((error) => {});
    }
  }, [removePost, post.id]);

  useEffect(() => {
    const isLike = post.likes.some((like) => like.user_id === state.auth.id);
    setUserLike(isLike);
    setIsLoading(false);
  }, [post.likes, state.auth.id]);

  const customLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  let totalVotes = 0;
  if (post.polls.length > 0) {
    post.polls.forEach((poll) => {
      totalVotes += poll.votes;
    });
  }

  useEffect(() => {
    if (viewerOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [viewerOpen]);

  return (
    <div>
      {viewerOpen && (
        <ImageViewer
          images={post.images}
          activeImageIndex={post.images.indexOf(activeImage)}
          onClose={closeImageViewer}
        />
      )}

      {post.author.id === state.auth.id && (
        <div style={{ position: "relative" }}>
          <div className={styles.postOpt} onClick={() => optionsMenu(post.id)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
              <g>
                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
              </g>
            </svg>
          </div>
          {state.optionsMenu === post.id && (
            <div className={styles.moreOptions}>
              <li onClick={() => OpenEditModal()}>Edit Post</li>
              <li onClick={() => handleDeletePost()}>Delete Post</li>
            </div>
          )}
        </div>
      )}
      <div
        className={styles.container}
        onClick={() => {
          if (!main) {
            router.push(`/story/${post.id}`, { scroll: true });
            setPageLoad();
          }
        }}
      >
        <Link
          href={`../profile/${post.author.user_name}`}
          prefetch={false}
          title={post.author.full_name}
          className={styles.profileImage}
          onClick={(e) => {
            e.stopPropagation();
            setPageLoad();
          }}
        >
          <Image
            loader={customLoader}
            src={post.author.profile_image || user_icon}
            alt={`${post.author.full_name} profile image`}
            width={45}
            height={45}
            priority
          />
        </Link>
        <div style={{ width: "100%" }}>
          <div className={styles.postDetails}>
            <Link
              href={`../profile/${post.author.user_name}`}
              prefetch={false}
              title={post.author.full_name}
              className={styles.fullName}
              onClick={(e) => {
                e.stopPropagation();
                setPageLoad();
              }}
            >
              <b>{post.author.full_name}</b>
            </Link>
            <Link
              href={`../profile/${post.author.user_name}`}
              prefetch={false}
              title={post.author.user_name}
              className={styles.username}
              onClick={(e) => {
                e.stopPropagation();
                setPageLoad();
              }}
            >
              @{post.author.user_name}
            </Link>
            <span className={styles.dot}></span>
            <div className={styles.time}>{timeAgo(post.created_at)}</div>
          </div>

          {post.content && (
            <div
              className={styles.postBody}
              id="postBody"
              dangerouslySetInnerHTML={{
                __html: post.content.replace(/\n/g, "<br />"),
              }}
            />
          )}
          {post.images.length > 0 && (
            <div
              className={`${styles[`imageContainer`]} ${
                styles[`imageContainer${Math.min(post.images.length, 4)}`]
              }`}
            >
              {post.images.map((image, index) => (
                <div
                  className={styles.postImage}
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    openImageViewer(image);
                  }}
                >
                  <Image
                    loader={customLoader}
                    src={image}
                    alt="post image"
                    width={384}
                    height={128}
                    priority
                  />
                </div>
              ))}
            </div>
          )}

          {post.polls.length > 0 && (
            <div className={styles.pollCon}>
              {post.polls.map((poll) => {
                return (
                  <Poll
                    key={poll.id}
                    post_id={post.id}
                    total_votes={totalVotes}
                    poll={poll}
                  />
                );
              })}
              {totalVotes > 0 && (
                <div className={styles.totalVote}>{totalVotes} Votes</div>
              )}
            </div>
          )}

          <div className={styles.postAction}>
            <div
              className={`${styles.actionElement} ${styles.likeElement}`}
              onClick={(e) => {
                LikePost();
                e.stopPropagation();
              }}
            >
              <button>
                {isLoading ? (
                  <div className={styles.loading}></div>
                ) : userLike ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={styles.L_SVG}
                  >
                    <g>
                      <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                    </g>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={styles.SVG}
                  >
                    <g>
                      <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                    </g>
                  </svg>
                )}
              </button>

              {post.likes.length > 0 && (
                <div className={styles.actionText}>{post.likes.length}</div>
              )}
            </div>

            <div
              className={`${styles.actionElement} ${styles.commentElement}`}
              onClick={(e) => {
                e.stopPropagation();
                OpenCommentModal();
              }}
            >
              <button>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={styles.SVG}
                >
                  <g>
                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                  </g>
                </svg>
              </button>
              {post.comments.length > 0 && (
                <div className={styles.actionText}>{post.comments.length}</div>
              )}
            </div>

            <div
              className={`${styles.actionElement} ${styles.bookmarkElement}`}
              onClick={(e) => {
                BookMarkPost();
                e.stopPropagation();
              }}
            >
              <button>
                {loading ? (
                  <div className={styles.bkLoading}></div>
                ) : post.bookmark ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={styles.B_SVG}
                  >
                    <g>
                      <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
                    </g>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={styles.SVG}
                  >
                    <g>
                      <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v16.978a1 1 0 0 1-1.581.814L12 17.694l-6.418 4.598A1 1 0 0 1 4 21.478V4.5zm2-.5a.5.5 0 0 0-.5.5v14.688l5.418-3.888a1 1 0 0 1 1.164 0L18.5 19.688V4.5a.5.5 0 0 0-.5-.5h-11z"></path>
                    </g>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {state.commentModal === post.id && (
        <Compose>
          <CommentPost post={post} />
        </Compose>
      )}
      {state.editModal === post.id && <Compose post={post} />}
    </div>
  );
};

export default PostContent;
