import { useState } from "react";
import styles from "./postContent.module.css";
import { useStore } from "@/lib/StoreContext";
import Cookies from "js-cookie";
import axios from "axios";

const Poll = ({ post_id, total_votes, poll }) => {
  const { state, updatePost } = useStore();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const token = Cookies.get("sessionData");

  const [loading, setLoading] = useState(false);

  const getVotePercent = (voteCount) => {
    if (total_votes === 0) return 0;
    const percentage = (voteCount / total_votes) * 100;
    return percentage.toFixed(0);
  };

  const castVote = async (pollKey, is_voted) => {
    if (!state.auth?.id || !pollKey || loading) {
      console.log(
        "Cannot cast vote, either user is not authenticated or pollKey is invalid."
      );
      return;
    }

    setLoading(true);
    console.log("Casting vote...");

    try {
      let response;
      if (!is_voted) {
        console.log("Voting for option...");
        response = await axios.post(
          `${BASE_URL}/vote/${post_id}/${poll.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        console.log("Removing vote...");
        response = await axios.delete(
          `${BASE_URL}/vote/${post_id}/${poll.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      console.log("Vote successful:", response.data);
      updatePost(response.data);
    } catch (error) {
      console.error("Error during voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`${styles.pollDiv} ${poll.is_voted ? styles.active : ""}`}
        onClick={(e) => {
          castVote(poll.id, poll.is_voted);
          e.stopPropagation();
        }}
      >
        <div className={styles.pollText}>
          {loading && <div className={styles.loadingPoll}></div>}
          {poll.option}
        </div>
        <div className={styles.voteCount}>
          {`${getVotePercent(poll.votes)}%`}
        </div>
        <div
          className={styles.voted}
          style={{ width: `${getVotePercent(poll.votes)}%` }}
        ></div>
      </div>
    </>
  );
};

export default Poll;
