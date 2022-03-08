import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import DispatchContext from "../context/DispatchContext";
import StateContext from "../context/StateContext";
import img from "../logo192.png";

const HeaderLoggedIn = () => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const pic =
    appState.user.avatar.src === undefined || null
      ? "https://gravatar.com/avatar/placeholder?s=128"
      : appState.user.avatar;

  const handleLogout = () => {
    appDispatch({ type: "logout" });
    appDispatch({ type: "flashMessage", value: "You have successfully logged out" });
  };
  const handleSearchIcon = e => {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  };
  return (
    <div className="flex-row my-3 my-md-0">
      {/** search */}
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
      <Link
        to="#"
        onClick={handleSearchIcon}
        className="text-white mr-2 header-search-icon"
        data-tip="Search"
        data-for="search">
        <i className="fas fa-search"></i>
      </Link>{" "}
      {/** chat */}
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />
      <span
        onClick={() => appDispatch({ type: "toggleChat" })}
        className={`mr-2 header-chat-icon ${appState.unreadChatCount ? "text-danger" : "text-white"}`}
        data-tip="Chat"
        data-for="chat">
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? (
          <span className="chat-count-badge text-white">
            {appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}{" "}
          </span>
        ) : (
          ""
        )}
      </span>{" "}
      {/** avatar */}
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
      <Link to={`/profiles/${appState.user.username}`} className="mr-2" data-tip=" My Profile" data-for="profile">
        <img className="small-header-avatar" src={pic} alt="Avatar" />
      </Link>{" "}
      <Link to="/create-post" className="btn btn-sm btn-success mr-2">
        Create Post
      </Link>{" "}
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
};

export default HeaderLoggedIn;
