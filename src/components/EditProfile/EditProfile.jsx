"use client";
import styles from "./edit.module.css";
import user_icon from "@/icons/user.png";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { uploadToS3 } from "@/lib/uploadToS3";
import { useStore } from "@/lib/StoreContext";
import axios from "axios";

const EditProfile = ({ children }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("sessionData");

  const router = useRouter();
  const { state } = useStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const [profile_image, setProfileImage] = useState(
    state.auth.profile_image || ""
  );
  const [cover_image, setCoverImage] = useState(state.auth.cover_image || "");
  const [bio, setBio] = useState(state.auth.bio || "");
  const [full_name, setFullName] = useState(state.auth.full_name || "");
  const [user_name, setUserName] = useState(state.auth.user_name || "");
  const [location, setLocation] = useState(state.auth.location || "");

  const [initialState, setInitialState] = useState({
    full_name,
    user_name,
    bio,
    location,
    profile_image,
    cover_image,
  });

  const editableRef = useRef(null);
  const fileProfileRef = useRef(null);
  const fileCoverRef = useRef(null);

  const handleInputChange = useCallback(() => {
    const content = editableRef.current.innerText.trim();
    const isEmpty = content == "";
    if (isEmpty) editableRef.current.innerHTML = "";
    setBio(content);
  }, []);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const image = URL.createObjectURL(files[0]);
      setProfileImage(image);
    }
  };

  const handleCoverChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const image = URL.createObjectURL(files[0]);
      setCoverImage(image);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!full_name || !user_name) {
      alert("Full name and User name are required");
      return;
    }

    let profileImageUrl = profile_image;
    let coverImageUrl = cover_image;

    if (fileProfileRef.current?.files[0]) {
      try {
        const result = await uploadToS3(
          "profile_image",
          fileProfileRef.current.files[0]
        );
        profileImageUrl = result;
        setProfileImage(result);
      } catch (error) {
        console.error("Error uploading profile image:", error);
        setLoading(false);
        return;
      }
    }

    if (fileCoverRef.current?.files[0]) {
      try {
        const result = await uploadToS3(
          "cover_image",
          fileCoverRef.current.files[0]
        );
        coverImageUrl = result;
        setCoverImage(result);
      } catch (error) {
        console.error("Error uploading cover image:", error);
        setLoading(false);
        return;
      }
    }

    const formData = {
      user_name: user_name,
      full_name: full_name,
      profile_image: profileImageUrl,
      cover_image: coverImageUrl,
      bio: bio,
      location: location,
    };

    axios
      .patch(
        `${BASE_URL}/users/update`,
        {
          user_name: user_name,
          full_name: full_name,
          profile_image: profileImageUrl,
          cover_image: coverImageUrl,
          bio: bio,
          location: location,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setMessage({
          type: "success",
          message: "Profile updated successfully",
        });
        setLoading(false);
        router.back();
        history.replaceState(null, "", `/profile/${user_name.toLowerCase()}`);
        window.location.reload();
      })
      .catch((error) => {
        setMessage({ type: "error", message: error.response.data.detail });
        console.log(error);
        setLoading(false);
      });
  };

  const customLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  const isFormChanged =
    full_name !== initialState.full_name ||
    user_name !== initialState.user_name ||
    bio !== initialState.bio ||
    location !== initialState.location ||
    profile_image !== initialState.profile_image ||
    cover_image !== initialState.cover_image;

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      {children}
      <main className={styles.scroll}>
        <div className={styles.coverImageCon}>
          <div className={styles.coverImage}>
            <button type="button" onClick={() => fileCoverRef.current.click()}>
              <svg viewBox="0 0 24 24" className={styles.SVG}>
                <g>
                  <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                </g>
              </svg>
            </button>
            <Image
              loader={customLoader}
              src={cover_image || user_icon}
              alt="User profile"
              width={600}
              height={200}
              priority
            />
          </div>
        </div>
        <div className={styles.profileImageCon}>
          <div className={styles.imagePreview}>
            <button
              type="button"
              onClick={() => fileProfileRef.current.click()}
            >
              <svg viewBox="0 0 24 24" className={styles.SVG}>
                <g>
                  <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                </g>
              </svg>
            </button>
            <Image
              loader={customLoader}
              src={profile_image || user_icon}
              alt="User profile"
              width={120}
              height={120}
              priority
            />
          </div>
        </div>
        <div className={styles.inputCon}>
          <input
            className={styles.input}
            name="full_name"
            placeholder="Full Name"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            className={styles.input}
            name="user_name"
            placeholder="User Name"
            style={{ textTransform: "lowercase" }}
            value={user_name}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, "");
              setUserName(value);
            }}
            required
          />
          <section
            ref={editableRef}
            onInput={handleInputChange}
            className={styles.inputDiv}
            style={{ whiteSpace: "pre-wrap" }}
            role="textbox"
            aria-multiline="true"
            contentEditable="plaintext-only"
            suppressContentEditableWarning={true}
          ></section>
          <input
            className={styles.input}
            name="address"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {message && (
            <div className={`${styles.messageBox} ${styles[message.type]}`}>
              {message.message}

              <button onClick={() => setMessage()} className={styles.removeBox}>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={styles.R_SVG}
                >
                  <g>
                    <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                  </g>
                </svg>
              </button>
            </div>
          )}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isFormChanged}
          >
            {loading ? (
              <div>
                <div className={styles.loading}></div> Edit Profile
              </div>
            ) : (
              <div>Edit Profile</div>
            )}
          </button>
        </div>
      </main>
      <input
        ref={fileProfileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <input
        ref={fileCoverRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleCoverChange}
      />
    </form>
  );
};

export default EditProfile;
