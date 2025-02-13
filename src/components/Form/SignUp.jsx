"use client";
import styles from "./form.module.css";
import { useCallback, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/StoreContext";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const SignUp = () => {
  const { closePageLoad, setPageLoad } = useStore();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    user_name: "",
    hashed_password: "",
    confirm_password: "",
  });
  const passwordRef = useRef();
  const c_passwordRef = useRef();
  const [pwdType, SetPwdType] = useState("password");

  useEffect(() => {
    if (!signing) closePageLoad();
  }, [closePageLoad]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (
        !formData.full_name ||
        !formData.user_name ||
        !formData.hashed_password ||
        !formData.confirm_password
      ) {
        setMessage({ type: "error", message: "All fields are required." });
        return;
      }

      if (formData.hashed_password.length < 6) {
        setMessage({
          type: "error",
          message: "Password must be at least 6 characters long.",
        });
        return;
      }

      if (formData.hashed_password !== formData.confirm_password) {
        setMessage({ type: "error", message: "Passwords do not match." });
        return;
      }

      setLoading(true);
      setMessage("");

      axios
        .post(`${BASE_URL}/users/signup`, {
          full_name: formData.full_name,
          user_name: formData.user_name.trim(),
          hashed_password: formData.hashed_password,
        })
        .then((response) => {
          setMessage({
            type: "success",
            message: "Successful ! You will be redirected",
          });
          setLoading(false);
          Cookies.set("sessionData", response.data.access_token, {
            expires: 1,
          });
          setSigning(true);
          setPageLoad();
          window.location.replace("/");
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          setMessage({
            type: "error",
            message: error.response?.data?.detail || error.message,
          });
        });
    },
    [formData]
  );

  const changePwdType = () => {
    if (pwdType === "password") {
      SetPwdType("text");
    } else {
      SetPwdType("password");
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.loginImage}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.B_SVG}>
            <g>
              <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path>
            </g>
          </svg>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.inputCon}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
              <g>
                <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path>
              </g>
            </svg>
            <input
              type="text"
              placeholder="Full Name"
              required
              className={styles.inputText}
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputCon}>
            <div className={styles.text_icon}>@</div>
            <input
              type="text"
              placeholder="Username"
              required
              className={styles.inputText}
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputCon}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
              <g>
                <path d="M13 9.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9.14 1.77l-5.83 5.84-4-1L6.41 22H2v-4.41l5.89-5.9-1-4 5.84-5.83 7.06 2.35 2.35 7.06zm-12.03 1.04L4 18.41V20h1.59l6.1-6.11 4 1 4.17-4.16-1.65-4.94-4.94-1.65-4.16 4.17 1 4z"></path>
              </g>
            </svg>
            <input
              type={pwdType}
              placeholder="Password"
              required
              className={styles.inputText}
              ref={passwordRef}
              value={formData.hashed_password}
              name="hashed_password"
              onChange={handleChange}
            />

            <span type="button" onClick={changePwdType}>
              {pwdType === "password" ? (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={styles.SVG}
                >
                  <g>
                    <path d="M12 21c-7.605 0-10.804-8.296-10.937-8.648L.932 12l.131-.352C1.196 11.295 4.394 3 12 3s10.804 8.296 10.937 8.648l.131.352-.131.352C22.804 12.705 19.606 21 12 21zm-8.915-9c.658 1.467 3.5 7 8.915 7s8.257-5.533 8.915-7c-.658-1.467-3.5-7-8.915-7s-8.257 5.533-8.915 7zM12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                  </g>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={styles.SVG}
                >
                  <g>
                    <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path>
                  </g>
                </svg>
              )}
            </span>
          </div>

          <div className={styles.inputCon}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
              <g>
                <path d="M13 9.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9.14 1.77l-5.83 5.84-4-1L6.41 22H2v-4.41l5.89-5.9-1-4 5.84-5.83 7.06 2.35 2.35 7.06zm-12.03 1.04L4 18.41V20h1.59l6.1-6.11 4 1 4.17-4.16-1.65-4.94-4.94-1.65-4.16 4.17 1 4z"></path>
              </g>
            </svg>
            <input
              type={pwdType}
              placeholder="Confirm Password"
              required
              className={styles.inputText}
              ref={c_passwordRef}
              value={formData.confirm_password}
              name="confirm_password"
              onChange={handleChange}
            />

            <span type="button" onClick={changePwdType}>
              {pwdType === "password" ? (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={styles.SVG}
                >
                  <g>
                    <path d="M12 21c-7.605 0-10.804-8.296-10.937-8.648L.932 12l.131-.352C1.196 11.295 4.394 3 12 3s10.804 8.296 10.937 8.648l.131.352-.131.352C22.804 12.705 19.606 21 12 21zm-8.915-9c.658 1.467 3.5 7 8.915 7s8.257-5.533 8.915-7c-.658-1.467-3.5-7-8.915-7s-8.257 5.533-8.915 7zM12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                  </g>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={styles.SVG}
                >
                  <g>
                    <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path>
                  </g>
                </svg>
              )}
            </span>
          </div>
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
            disabled={loading || signing}
          >
            {loading ? (
              <div>
                Sign Up
                <div className={styles.loading}></div>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className={styles.otherOption}>
          Already have an account ? &nbsp;
          <b>
            <Link href="/login" onClick={() => setPageLoad()}>
              Login
            </Link>
          </b>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
