import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { isAuth } from "../utility/helpers";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
const ENDPOINT = process.env.REACT_APP_CHAT_ENDPOINT;
const socket = socketIOClient(ENDPOINT);

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    _id: "",
    name: "",
    org_email_domain: "",
  });

  const [chatUser, setChatUser] = useState({ _id: "", name: "" });
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    const { _id, name, org_email_domain } = isAuth();
    setCurrentUser({ _id, name, org_email_domain });

    // send current user
    socket.emit("user", { _id, org_email_domain });

    // listen for users from server
    socket.on("users", (socketUsers) => {
      console.log(socketUsers);
      if (socketUsers.length === 0) return;
      // filter current user
      const filteredUser = socketUsers.filter((u) => {
        return u._id !== _id;
      });
      setUsers(filteredUser);
      // if no user - default to first in users array
      if (chatUser._id === "") {
        setChatUser({ _id: filteredUser[0]._id, name: filteredUser[0].name });
        // emit message
        socket.emit("chat-with", {
          from: _id,
          to: filteredUser[0]._id,
        });
      }
    });

    // listen for new messages
    socket.on("chat-history", (history) => {
      // console.log(history);
      setConversation(history);
    });

    // listen for new messages
    socket.on("new-message", (newMessage) => {
      setConversation(newMessage);
    });

    return () => socket.disconnect();
  }, []);

  /**
   * Handle click on user chat head
   * @param {*} event
   */
  const handleUserClick = (event) => {
    let selectedUser = event.currentTarget.id;
    let selectedUserName = event.currentTarget.textContent;
    // console.log(selectedUserName);
    if (selectedUser === currentUser._id || chatUser._id === selectedUser) {
      return;
    }
    setChatUser({ _id: selectedUser, name: selectedUserName });
    // emit message
    socket.emit("chat-with", {
      from: currentUser._id,
      to: selectedUser,
    });
    setConversation([]);
  };

  const handleChatInput = (event) => {
    let chatMessage = event.target.value;
    setMessage(chatMessage);
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    // return if no message
    if (!message) return;

    // emit message
    socket.emit("chat-message", {
      from: currentUser._id,
      to: chatUser._id,
      message,
    });
    // clear input
    setMessage("");
  };

  return (
    <div className="chat-container font-sans antialiased h-screen flex border-t-2">
      <div className="bg-indigo-400 text-purple-lighter flex-none w-64 pb-6 hidden md:block">
        <div className="text-white mb-2 mt-3 px-4 flex justify-between">
          <div className="flex-auto">
            <h1 className="font-semibold text-xl leading-tight mb-1 truncate">
              {currentUser.org_email_domain}
            </h1>

            <div className="flex items-center mb-6">
              <svg
                className="h-2 w-2 fill-current text-green-600 mr-2"
                viewBox="0 0 20 20"
              >
                <circle cx="10" cy="10" r="10" />
              </svg>
              <span className="text-white opacity-50 text-sm">
                {currentUser.name}
              </span>
            </div>
          </div>
          <div>
            <svg
              className="h-6 w-6 fill-current text-white opacity-25"
              viewBox="0 0 20 20"
            >
              <path
                d="M14 8a4 4 0 1 0-8 0v7h8V8zM8.027 2.332A6.003 6.003 0 0 0 4 8v6l-3 2v1h18v-1l-3-2V8a6.003 6.003 0 0 0-4.027-5.668 2 2 0 1 0-3.945 0zM12 18a2 2 0 1 1-4 0h4z"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {/* user available for chat */}
        <div className="mb-8">
          <div className="px-4 mb-2 text-white flex justify-between items-center">
            <div className="opacity-75">Direct Messages</div>
            <div>
              <svg
                className="fill-current h-4 w-4 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
              </svg>
            </div>
          </div>
          {users.map((user) => {
            return (
              <div
                key={user._id}
                id={user._id}
                className={`chat-user flex items-center px-2 h-12 ${
                  chatUser._id === user._id ? "active" : ""
                }`}
                onClick={handleUserClick}
              >
                <svg
                  className="h-2 w-2 fill-current text-green-600 mr-2"
                  viewBox="0 0 20 20"
                >
                  <circle cx="10" cy="10" r="10" />
                </svg>
                <span className="text-white opacity-75">
                  {user.name}
                  {user.name === currentUser.name && (
                    <span className="text-grey text-sm">(you)</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
        {/* ./ends - user available for chat */}
      </div>

      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="border-b flex px-6 py-2 items-center flex-none">
          <div className="flex flex-col">
            <h3 className="text-grey-darkest mb-1 font-extrabold">
              {chatUser.name
                ? `#${chatUser.name}`
                : "No user available for chat"}
            </h3>
          </div>
          <div className="ml-auto hidden md:block">
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                className="appearance-none border border-grey rounded-lg pl-8 pr-4 py-2"
              />
              <div className="absolute pl-3 -mt-8 flex items-center justify-center self-center">
                <svg
                  className="fill-current text-grey h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-scroll">
          {/* chat messages */}

          {conversation.map((chat, index) => {
            return (
              <div key={index} className="flex items-start mb-4 text-sm">
                <img
                  src={
                    chat.from === currentUser._id ? "/user1.png" : "/user2.png"
                  }
                  className="w-10 h-10 rounded mr-3"
                />
                <div className="flex-1 overflow-hidden">
                  <div>
                    <span className="font-bold">
                      {chat.from === currentUser._id
                        ? currentUser.name
                        : chatUser.name}
                    </span>{" "}
                    <span className="text-grey text-xs">
                      {formatDistanceToNow(new Date(chat.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-black leading-normal">{chat.message}</p>
                </div>
              </div>
            );
          })}

          {/* end chat messages */}
        </div>

        {/* chat input */}
        <div className="pb-6 px-4 flex-none">
          <div className="flex rounded-lg border-2 border-grey overflow-hidden">
            <span className="text-3xl text-grey border-r-2 border-grey p-2">
              <svg
                className="fill-current h-6 w-6 block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z" />
              </svg>
            </span>
            <form className="w-full p-2" onSubmit={handleChatSubmit}>
              <input
                type="text"
                className="w-full px-4 h-8 outline-none"
                placeholder="Type your message"
                value={message}
                onChange={handleChatInput}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
