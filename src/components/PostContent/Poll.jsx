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
    return ((voteCount / total_votes) * 100).toFixed(0);
  };

  const castVote = async (pollKey, is_voted) => {
    if (!state.auth?.id || !pollKey || loading) return;

    setLoading(true);

    const url = `${BASE_URL}/vote/${post_id}/${poll.id}`;
    const headers = { Authorization: `Bearer ${token}` };

    const request = !is_voted
      ? axios.post(url, {}, { headers })
      : axios.delete(url, { headers });

    request
      .then((response) => {
        updatePost(response.data);
      })
      .catch((error) => {
        console.error("Voting error:", error.response?.data || error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className={`${styles.pollDiv} ${poll.is_voted ? styles.active : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        castVote(poll.id, poll.is_voted);
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
