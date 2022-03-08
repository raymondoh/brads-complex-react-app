import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import Loader from "./Loader";
import Post from "./Post";

const ProfilePosts = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        const response = await Axios.get(`/profiles/${username}/posts`, { cancelToken: ourRequest.token });
        setPosts(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error.response.data);
      }
    };
    fetchPosts();
    return () => {
      ourRequest.cancel();
      setIsLoading(false);
    };
  }, [username]);

  const displayPosts =
    posts &&
    posts.map(post => {
      return <Post post={post} key={post._id} noAuthor={true} />;
    });

  if (isLoading) return <Loader />;
  return <div className="list-group">{displayPosts}</div>;
};

export default ProfilePosts;
