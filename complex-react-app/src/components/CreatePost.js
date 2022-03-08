import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Page from "./Page";
import Axios from "axios";
import DispatchContext from "../context/DispatchContext";
import StateContext from "../context/StateContext";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", {
        title,
        body,
        token: appState.user.token
      });
      // addFlashMessage("bitch the Post created.");
      appDispatch({ type: "flashMessage", value: "post created" });
      navigate(`/posts/${response.data}`);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={e => setTitle(e.target.value)}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={e => setBody(e.target.value)}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
};

export default CreatePost;