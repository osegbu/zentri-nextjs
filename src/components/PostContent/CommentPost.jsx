"use client";
import styles from "./postContent.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import user_icon from "@/icons/user.png";
import { useStore } from "@/lib/StoreContext";
import Poll from "./Poll";

const CommentPost = ({ post }) => {
  const { state } = useStore();
  let totalVotes = 0;
  if (post.polls.length > 0) {
    post.polls.forEach((poll) => {
      totalVotes += poll.votes;
    });
  }
  const router = useRouter();

  function timeAgo(date) {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) {
      return `Just now`;
    }

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const formattedDate = timeAgo(post.created_at);

  return (
    <div className={styles.commentCon}>
      <Link
        href={
          state.auth.user_name === post.author.user_name
            ? "../profile"
            : `../profile/${post.author.user_name}`
        }
        title={post.author.full_name}
        className={styles.profileImage}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={post.author.profile_image || user_icon}
          alt={`${post.author.full_name} profile image`}
          width={45}
          height={45}
        />
      </Link>
      <div style={{ width: "100%" }}>
        <div className={styles.postDetails}>
          <Link
            href={
              state.auth.user_name === post.author.user_name
                ? "../profile"
                : `../profile/${post.author.user_name}`
            }
            title={post.author.full_name}
            className={styles.fullName}
            onClick={(e) => e.stopPropagation()}
          >
            <b>{post.author.full_name}</b>
          </Link>
          <Link
            href={
              state.auth.user_name === post.author.user_name
                ? "../profile"
                : `../profile/${post.author.user_name}`
            }
            title={post.author.user_name}
            className={styles.username}
            onClick={(e) => e.stopPropagation()}
          >
            @{post.author.user_name}
          </Link>
          <span className={styles.dot}></span>
          <div className={styles.time}>{formattedDate}</div>
        </div>

        {post.content && (
          <div
            className={styles.postBody}
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, "<br />"),
            }}
          />
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
          </div>
        )}

        <div className={styles.replyingTO}>
          {post.author.user_name === state.auth.user_name ? (
            "Replying Yourself"
          ) : (
            <div>
              Replying to{" "}
              <Link
                href={
                  state.auth.user_name === post.author.user_name
                    ? "../profile"
                    : `../profile/${post.author.user_name}`
                }
                title={post.author.full_name}
                className={styles.link}
              >
                @{post.author.user_name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentPost;
