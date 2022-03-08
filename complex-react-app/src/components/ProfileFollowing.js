import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import Loader from "./Loader";

const ProfileFollowing = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        const response = await Axios.get(`/profiles/${username}/following`, { cancelToken: ourRequest.token });
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
    posts.map((follower, index) => {
      return (
        <Link key={index} to={`/profiles/${follower.username}`} className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src={follower.avatar} alt="" />
          {follower.username}
        </Link>
      );
    });

  if (isLoading) return <Loader />;
  return <div className="list-group">{displayPosts}</div>;
};

export default ProfileFollowing;
