"use client";
import { useState, useCallback, useEffect } from "react";
import styles from "./profilecard.module.css";
import Back from "../Back/Back";
import EditProfile from "../EditProfile/EditProfile";
import { useRouter } from "next/navigation";
import user_icon from "@/icons/user.png";
import Image from "next/image";
import { useStore } from "@/lib/StoreContext";
import axios from "axios";

const ProfileCard = ({ user }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const { state } = useStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [following, setFollowing] = useState(user.following.length);
  const [follower, setFollower] = useState(user.followers.length);

  const [isFollowing, setIsFollowing] = useState();

  useEffect(() => {
    if (user.followers && state.auth.id) {
      setIsFollowing(
        user.followers.some((follower) => follower.id === state.auth.id)
      );
    }
  }, [user.followers, state.auth.id]);
  const [openEdit, setOpenEdit] = useState(false);

  const followUser = useCallback(async () => {
    setIsLoading(true);
    axios
      .post(`${BASE_URL}/follow/${state.auth.id}/${user.id}`)
      .then((response) => {
        setIsFollowing(true);
        setIsLoading(false);
        setFollower((prevFollower) => prevFollower + 1);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [state.auth.id, user.id]);

  const unFollowUser = useCallback(async () => {
    setIsLoading(true);
    axios
      .delete(`${BASE_URL}/follow/${state.auth.id}/${user.id}`)
      .then((response) => {
        setIsFollowing(false);
        setIsLoading(false);
        setFollower((prevFollower) => Math.max(prevFollower - 1, 0));
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [state.auth.id, user.id]);

  const OpenEditProfile = useCallback(() => {
    if (!openEdit) {
      const newUrl = "";
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
    } else {
      router.back();
    }

    setOpenEdit(!openEdit);
  }, [openEdit]);

  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      setOpenEdit(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (openEdit) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [openEdit]);

  const formattedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const customLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  return (
    <div className={styles.container}>
      {openEdit && (
        <div className={styles.editCover}>
          <EditProfile>
            <div className={styles.mobileBack}>
              <Back value="Edit Profile" />
            </div>
            <button
              type="button"
              className={styles.desktopBack}
              onClick={() => {
                OpenEditProfile();
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={styles.Edit_SVG}
              >
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>
            </button>
          </EditProfile>
        </div>
      )}
      <div className={styles.coverImageCon}>
        <div className={styles.coverImage}>
          <Image
            loader={customLoader}
            src={user.cover_image || user_icon}
            alt={`${user.full_name} Cover Image`}
            width={600}
            height={200}
            priority
          />
        </div>
      </div>
      <div className={styles.profileImageCover}>
        <div className={styles.profileImage}>
          <Image
            loader={customLoader}
            src={user.profile_image || user_icon}
            alt={`${user.full_name} Profile Image`}
            width={120}
            height={120}
            priority
          />
        </div>
        {state.auth.id && (
          <div>
            {state.auth.id === user.id ? (
              <button className={styles.editProfile} onClick={OpenEditProfile}>
                <b>Edit Profile</b>
              </button>
            ) : (
              <>
                {isFollowing ? (
                  <button
                    onClick={unFollowUser}
                    className={styles.followingBtn}
                  >
                    {isLoading && <div className={styles.loading}></div>}
                    <b>Unfollow</b>
                  </button>
                ) : (
                  <button onClick={followUser} className={styles.followBtn}>
                    {isLoading && <div className={styles.loading}></div>}
                    <b>Follow</b>
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <div className={styles.fullName}>
          <b>{user.full_name}</b>
        </div>
        <div className={styles.username}>@{user.user_name}</div>
        <div className={styles.headline}>{user?.bio}</div>
        <div className={styles.othersCon}>
          <div className={styles.others}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
              <g>
                <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
              </g>
            </svg>
            <div>Joined {formattedDate}</div>
          </div>
          {user.location && (
            <div className={styles.others}>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={styles.SVG}
              >
                <g>
                  <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
                </g>
              </svg>
              <div>{user?.location}</div>
            </div>
          )}
        </div>
        <div className={styles.followings}>
          <div className={styles.inner}>
            <b>{following}</b>
            <div className={styles.text}>Following</div>
          </div>
          <div className={styles.inner}>
            <b>{follower}</b>
            <div className={styles.text}>Followers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
