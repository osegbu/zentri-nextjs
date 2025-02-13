"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const initialState = {
  auth: {},
  post: [],
  composeModal: false,
  commentModal: null,
  editModal: null,
  optionsMenu: null,
  pageLoad: false,
  page: 0,
  hasMore: true,
  isFetching: false,
  notification: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "AUTH":
      return { ...state, auth: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, page: action.payload };
    case "SET_HAS_MORE":
      return { ...state, hasMore: action.payload };
    case "SET_IS_FETCHING":
      return { ...state, isFetching: action.payload };
    case "SET_PAGE_LOAD":
      return { ...state, pageLoad: action.payload };
    case "SET_POST":
      return { ...state, post: action.payload };
    case "COMPOSE_MODAL":
      return { ...state, composeModal: action.payload };
    case "COMMENT_MODAL":
      return { ...state, commentModal: action.payload };
    case "EDIT_MODAL":
      return { ...state, editModal: action.payload };
    case "OPTIONS_MENU":
      return {
        ...state,
        optionsMenu:
          state.optionsMenu === action.payload ? null : action.payload,
      };
    case "SET_NOTIFICATION":
      return { ...state, notification: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const StoreContext = createContext();

export const StoreProvider = ({ children, authUser }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    if (authUser) {
      dispatch({ type: "AUTH", payload: authUser });
    }
  }, [authUser]);

  const setCurrentPage = useCallback(
    (value) => dispatch({ type: "SET_CURRENT_PAGE", payload: value }),
    [dispatch]
  );

  const setHasMore = useCallback(
    (value) => dispatch({ type: "SET_HAS_MORE", payload: value }),
    [dispatch]
  );

  const setIsFetching = useCallback(
    (value) => dispatch({ type: "SET_IS_FETCHING", payload: value }),
    [dispatch]
  );

  const setPost = useCallback(
    (newPosts) => {
      const uniquePosts = newPosts.filter(
        (newPost) => !state.post.some((post) => post.id === newPost.id)
      );
      if (uniquePosts.length > 0) {
        const updatedPosts = [...state.post, ...uniquePosts].sort(
          (a, b) => b.id - a.id
        );
        dispatch({ type: "SET_POST", payload: updatedPosts });
      }
    },
    [state.post, dispatch]
  );

  const updatePost = useCallback(
    (newPost) => {
      const postExists = state.post.find((post) => post.id === newPost.id);
      let updatedPosts;

      if (postExists) {
        updatedPosts = state.post.map((post) =>
          post.id === postExists.id ? { ...post, ...newPost } : post
        );
      } else if (newPost.post_id) {
        updatedPosts = state.post.map((post) => {
          if (post.id === newPost.post_id) {
            const commentExists = post.comments?.find(
              (comment) => comment.id === newPost.id
            );

            const updatedComments = commentExists
              ? post.comments.map((comment) =>
                  comment.id === newPost.id
                    ? { ...comment, ...newPost }
                    : comment
                )
              : [...(post.comments || []), newPost];

            return {
              ...post,
              comments: updatedComments,
            };
          }
          return post;
        });
      } else {
        updatedPosts = [newPost, ...state.post];
      }

      dispatch({
        type: "SET_POST",
        payload: updatedPosts.sort((a, b) => b.id - a.id),
      });
    },
    [state.post, dispatch]
  );

  const removePost = useCallback(
    (postId, main) => {
      let updatedPosts;

      if (main) {
        updatedPosts = state.post.map((post) =>
          post.id === main
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== postId
                ),
              }
            : post
        );
      } else {
        updatedPosts = state.post.filter((post) => post.id !== postId);
      }

      dispatch({ type: "SET_POST", payload: updatedPosts });
    },
    [state.post, dispatch]
  );

  const composeModal = useCallback(
    (value) => dispatch({ type: "COMPOSE_MODAL", payload: value }),
    [dispatch]
  );

  const commentModal = useCallback(
    (value) => dispatch({ type: "COMMENT_MODAL", payload: value }),
    [dispatch]
  );

  const editModal = useCallback(
    (value) => dispatch({ type: "EDIT_MODAL", payload: value }),
    [dispatch]
  );

  const optionsMenu = useCallback(
    (value) => dispatch({ type: "OPTIONS_MENU", payload: value }),
    [dispatch]
  );

  const setDuration = () => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 50) return prev + 2;
        if (prev < 70) return prev + 1.5;
        if (prev < 85) return prev + 1;
        if (prev < 97) return prev + 0.5;
        clearInterval(progressInterval);
        return prev;
      });
    }, 100);
  };

  const setPageLoad = useCallback(() => {
    if (state.pageLoad) {
      setProgress(5);
      dispatch({ type: "SET_PAGE_LOAD", payload: false });
    }

    setDuration();
    dispatch({ type: "SET_PAGE_LOAD", payload: true });
  }, [state.pageLoad]);

  const completeLoading = useCallback(() => setProgress(100), []);

  const closePageLoad = useCallback(() => {
    if (state.pageLoad) {
      completeLoading();
      setTimeout(() => {
        dispatch({ type: "SET_PAGE_LOAD", payload: false });
        setProgress(5);
      }, 400);
    }
  }, [state.pageLoad]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (state.optionsMenu && !e.target.closest(".optionsMenu")) {
        dispatch({ type: "OPTIONS_MENU", payload: null });
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [state.optionsMenu]);

  const SetNotification = useCallback(
    (value) => {
      if (value) {
        dispatch({ type: "SET_NOTIFICATION", payload: value });
        setTimeout(() => {
          dispatch({ type: "SET_NOTIFICATION", payload: null });
        }, 3000);
      }
    },
    [dispatch]
  );

  const resetState = useCallback(() => dispatch({ type: "RESET" }), [dispatch]);

  return (
    <StoreContext.Provider
      value={{
        state,
        setPost,
        updatePost,
        composeModal,
        commentModal,
        editModal,
        optionsMenu,
        removePost,
        setPageLoad,
        closePageLoad,
        setCurrentPage,
        setHasMore,
        setIsFetching,
        SetNotification,
        resetState,
      }}
    >
      {state.pageLoad && (
        <div className="loadingindicator">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <div className="spinner"></div>
        </div>
      )}

      {state.notification && (
        <div className="notification">{state.notification}</div>
      )}

      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
