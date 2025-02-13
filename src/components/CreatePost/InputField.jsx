import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./createpost.module.css";
import Image from "next/image";
import user_icon from "@/icons/user.png";
import { uploadToS3 } from "@/lib/uploadToS3";
import { useStore } from "@/lib/StoreContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

const InputField = ({ post }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("sessionData");

  const router = useRouter();
  const {
    state,
    updatePost,
    commentModal,
    composeModal,
    editModal,
    SetNotification,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [pollOptions, setPollOptions] = useState([]);

  const editableRef = useRef(null);
  const fileInputRef = useRef(null);

  const initialMessage = useRef("");
  const initialPollOptions = useRef([]);
  const initialSelectedImages = useRef([]);

  useEffect(() => {
    if (post) {
      setMessage(post.content || "");
      initialMessage.current = post.content || "";
      if (editableRef.current) {
        editableRef.current.innerText = post.content || "";
      }

      if (post.polls.length) {
        let polls = [];
        post.polls.map((poll) => {
          polls.push(poll.option);
        });
        setPollOptions(polls);
        initialPollOptions.current = polls;
        setIsOpen(true);
        setDone(polls.length === 4);
      } else {
        setPollOptions([]);
        initialPollOptions.current = [];
      }

      if (post.images && post.images.length) {
        const existingImages = post.images.map((url) => ({ url }));
        setSelectedImages(existingImages);
        initialSelectedImages.current = existingImages;
      } else {
        setSelectedImages([]);
        initialSelectedImages.current = [];
      }
    }
  }, [post]);

  const isUnchanged = useMemo(() => {
    if (!post) return false;

    const imagesUnchanged =
      selectedImages.length === initialSelectedImages.current.length &&
      selectedImages.every((img, index) => {
        return (
          !img.file && img.url === initialSelectedImages.current[index].url
        );
      });

    return (
      message === initialMessage.current &&
      JSON.stringify(pollOptions) ===
        JSON.stringify(initialPollOptions.current) &&
      imagesUnchanged
    );
  }, [message, pollOptions, selectedImages, post]);

  const handleInputChange = useCallback(() => {
    const content = editableRef.current.innerText.trim();
    if (content === "") editableRef.current.innerHTML = "";
    setMessage(content);
  }, []);

  const handleImageChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file) => /image/.test(file.type));
      const newImages = validFiles
        .slice(0, 4 - selectedImages.length)
        .map((file) => ({
          url: URL.createObjectURL(file),
          file: file,
        }));
      setSelectedImages((prev) => [...prev, ...newImages]);
      fileInputRef.current.value = null;
    },
    [selectedImages]
  );

  const handleRemoveImage = useCallback((index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }, []);

  const handlePhotoClick = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const addOption = useCallback(() => {
    if (pollOptions.length < 4) {
      setPollOptions((prevOptions) => [...prevOptions, ""]);
      if (pollOptions.length === 3) setDone(true);
    }
  }, [pollOptions]);

  const handlePollChange = useCallback((index, value) => {
    setPollOptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const submitPost = useCallback(async () => {
    setIsSending(true);
    const formData = {};
    const image = [];

    formData.content = editableRef.current.innerText.trim();

    if (pollOptions.length > 0) formData.poll = pollOptions;

    if (state.commentModal) formData.post_id = state.commentModal;

    try {
      if (selectedImages.length > 0) {
        const imageUploadPromises = selectedImages.map((imageFile) => {
          if (imageFile.file) {
            return uploadToS3("post_image", imageFile.file);
          } else {
            return Promise.resolve(imageFile.url);
          }
        });
        const uploadedImageUrls = await Promise.all(imageUploadPromises);
        uploadedImageUrls.forEach((url) => {
          image.push(url);
        });
        formData.image = image;
      }

      let response;
      if (!post) {
        response = await axios.post(
          `${BASE_URL}/posts/create`,
          {
            content: formData.content,
            post_id: formData.post_id,
            image: formData.image,
            poll: formData.poll,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.patch(
          `${BASE_URL}/posts/${post.id}`,
          {
            content: formData.content,
            image: formData.image,
            poll: formData.poll,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      updatePost(response.data);

      SetNotification(<div className="successMsg">Your post was sent</div>);
      if (state.editModal || state.commentModal || state.composeModal)
        router.back();

      editModal(null);
      commentModal(null);
      composeModal(false);

      setMessage("");
      setSelectedImages([]);
      setIsOpen(false);
      setPollOptions([]);
      editableRef.current.innerHTML = "";
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSending(false);
    }
  }, [
    pollOptions,
    state,
    selectedImages,
    post,
    router,
    updatePost,
    editModal,
    commentModal,
    composeModal,
  ]);

  const customLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.profileImage}>
        <Image
          loader={customLoader}
          src={state.auth.profile_image || user_icon}
          alt={`${state.auth.full_name} profile image`}
          width={45}
          height={45}
          priority
        />
      </div>
      <div className={styles.textArea}>
        <section
          ref={editableRef}
          onInput={handleInputChange}
          className={styles.inputDiv}
          style={{ whiteSpace: "pre-wrap" }}
          role="textbox"
          aria-multiline="true"
          contentEditable="plaintext-only"
        ></section>
        {selectedImages.length > 0 && (
          <div className={styles.imagePreview}>
            {selectedImages.map((media, index) => (
              <div
                key={index}
                className={
                  selectedImages.length === 1
                    ? styles.oneImageContainer
                    : styles.imageContainer
                }
              >
                <img src={media.url} alt={`Selected ${index}`} />
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveImage(index)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={styles.Remove_SVG}
                  >
                    <g>
                      <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                    </g>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        {isOpen && (
          <div className={styles.pollContainer}>
            <div className={styles.optionsDiv}>
              {pollOptions.map((option, index) => (
                <input
                  key={index}
                  className={styles.options}
                  placeholder={`Choice ${index + 1} ${
                    index > 1 ? "(optional)" : ""
                  }`}
                  value={option}
                  onChange={(e) => handlePollChange(index, e.target.value)}
                />
              ))}
            </div>
            <div className={styles.actionSide}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setIsOpen(false);
                  setPollOptions([]);
                  setDone(false);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={styles.Poll_SVG}
                >
                  <g>
                    <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                  </g>
                </svg>
              </button>
              {!done && (
                <button onClick={addOption} className={styles.addButton}>
                  <svg viewBox="0 0 40 40" className={styles.Poll_SVG}>
                    <rect x="19" y="9" width="4" height="24" />
                    <rect x="9" y="19" width="24" height="4" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        <div className={styles.others}>
          <button
            title="Media Upload"
            onClick={handlePhotoClick}
            disabled={isOpen || selectedImages.length >= 4}
          >
            <div>
              <svg viewBox="0 0 64 64" className={styles.SVG}>
                <rect
                  x="0"
                  y="0"
                  width="64"
                  height="64"
                  rx="8"
                  fill="#e0ecff"
                />
                <circle cx="44" cy="20" r="6" fill="#4a8dff" />
                <polygon points="8,56 32,24 56,56" fill="#4da6ff" />
                <polygon points="8,56 20,38 56,56" fill="#3579f6" />
              </svg>
              <div className={styles.text}>Photo</div>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <button
            title="Poll"
            onClick={() => {
              setIsOpen(true);
              setPollOptions(["", ""]);
            }}
            disabled={selectedImages.length > 0}
          >
            <div>
              <svg viewBox="0 0 64 64" className={styles.SVG}>
                <rect
                  x="8"
                  y="20"
                  width="12"
                  height="36"
                  rx="6"
                  fill="#1a6bb5"
                />
                <rect
                  x="26"
                  y="8"
                  width="12"
                  height="48"
                  rx="6"
                  fill="#4aa3df"
                />
                <rect
                  x="44"
                  y="36"
                  width="12"
                  height="20"
                  rx="6"
                  fill="#338bd5"
                />
              </svg>
              <div className={styles.text}>Poll</div>
            </div>
          </button>

          <span></span>
          <button
            className={styles.sendButton}
            disabled={
              (!selectedImages.length && !message) ||
              isSending ||
              (post && isUnchanged)
            }
            onClick={submitPost}
          >
            <b>{isSending ? <div className={styles.loading}></div> : "Send"}</b>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputField;
