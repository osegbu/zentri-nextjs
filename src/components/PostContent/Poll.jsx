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

  const vote = async (poll_id) => {
    if (!state.auth?.id || !token) {
      console.error("User not authenticated or token missing");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/vote/${post_id}/${poll_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updatePost(response.data);
    } catch (error) {
      console.error(
        "Error casting vote:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const remove_vote = async (poll_id) => {
    if (!state.auth?.id || !token) {
      console.error("User not authenticated or token missing");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.delete(
        `${BASE_URL}/vote/${post_id}/${poll_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updatePost(response.data);
    } catch (error) {
      console.error(
        "Error removing vote:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${styles.pollDiv} ${poll.is_voted ? styles.active : ""}`}
      onClick={(e) => {
        if (loading) return;
        if (poll.is_voted) {
          remove_vote(poll.id);
        } else {
          vote(poll.id);
        }
        e.stopPropagation();
      }}
    >
      <div className={styles.pollText}>
        {loading && <div className={styles.loadingPoll}></div>}
        {poll.option}
      </div>
      <div className={styles.voteCount}>{`${getVotePercent(poll.votes)}%`}</div>
      <div
        className={styles.voted}
        style={{ width: `${getVotePercent(poll.votes)}%` }}
      ></div>
    </div>
  );
};

export default Poll;
