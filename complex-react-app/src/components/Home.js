import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import Axios from "axios";
import Page from "./Page";
import StateContext from "../context/StateContext";
import Loader from "./Loader";
import Post from "./Post";

const Home = () => {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: []
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    const fetchData = async () => {
      try {
        const response = await Axios.post(
          "getHomeFeed",
          { token: appState.user.token },
          { cancelToken: ourRequest.token }
        );
        setState(draft => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchData();

    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (state.isLoading) {
    return <Loader />;
  }
  return (
    <Page title="Your feed">
      {state.feed.length > 0 && (
        <React.Fragment>
          <h2 className="text-center mb-4">The latest from those you follow</h2>
          <div className="list-group">
            {state.feed.map(post => {
              return <Post post={post} key={post._id} />;
            })}
          </div>
        </React.Fragment>
      )}
      {state.feed.length === 0 && (
        <React.Fragment>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to
            follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content
            written by people with similar interests and then follow them.
          </p>
        </React.Fragment>
      )}
    </Page>
  );
};

export default Home;
