import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import Axios from "axios";
import Page from "./Page";
import Loader from "./Loader";
import NotFound from "./NotFound";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";

const ViewSinglePost = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token });
        setPost(response.data);
        setIsLoading(false);
        console.log(response.data);
      } catch (error) {
        setIsLoading(false);
        console.log(error.response.data);
      }
    };

    fetchPost();

    return () => {
      ourRequest.cancel();
      setIsLoading(false);
    };
  }, [id]);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <Loader />
      </Page>
    );
  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const deleteHandler = async () => {
    const areYouSure = window.confirm("Are you sure you want to delete this post?");
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } });
        if (response.data === "Success") {
          appDispatch({ type: "flashMessage", value: "Post deleted" });
          navigate(`/profiles/${appState.user.username}`);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username;
    }
    return false;
  }
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <ReactTooltip id="edit" className="custom-tooltip" />
            <Link to={`/posts/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="delete" className="custom-tooltip" />{" "}
            <Link
              to=""
              onClick={deleteHandler}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
              title="Delete">
              <i className="fas fa-trash"></i>
            </Link>
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profiles/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} alt="Avatar" />
        </Link>
        Posted by <Link to={`/profiles/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown
          children={post.body}
          allowedElements={["p", "br", "em", "strong", "ul", "li", "ol", "h1", "h2", "h3", "h4", "h5"]}
        />
      </div>
    </Page>
  );
};

export default ViewSinglePost;
