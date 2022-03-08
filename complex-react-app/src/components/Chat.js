import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import io from "socket.io-client";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
const img = "../logo192.png";

const socket = io("/");

const Chat = () => {
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: []
  });

  // const pic =
  //   appState.user.avatar.src === undefined || null
  //     ? "https://gravatar.com/avatar/placeholder?s=128"
  //     : appState.user.avatar || null;

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    socket.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message);
      });
    });
  }, []);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.chatMessages.length && !appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" });
    }
  }, [state.chatMessages]);
  // useEffect(() => {
  //   console.log(appState.user.avatar);
  // }, []);

  const handleFormSubmit = e => {
    e.preventDefault();
    // send msg to chat server
    socket.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token });

    setState(draft => {
      //add msg to state collection of msgs
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: appState.user.username,
        avatar: appState.user.avatar
      });
      draft.fieldValue = "";
    });
  };
  const handleFieldChange = e => {
    const value = e.target.value;
    setState(draft => {
      draft.fieldValue = value;
    });
  };
  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (appState.isChatOpen ? "chat-wrapper--is-visible" : "")
      }>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username === appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src="" alt="" />
              </div>
            );
          }
          return (
            <div key={index} className="chat-other">
              <Link to={`/profiles/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} alt="" />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profiles/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleFormSubmit} id="chatForm" className="chat-form border-top">
        <input
          onChange={handleFieldChange}
          value={state.fieldValue}
          ref={chatField}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default Chat;
