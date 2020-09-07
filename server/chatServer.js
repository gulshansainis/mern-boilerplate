const Chat = require("./models/Chat");

exports.start = (app, port) => {
  const http = require("http").createServer(app);
  const io = require("socket.io")(http);
  const User = require("./models/User");
  const connectedSockets = {};

  const getUsersByDomain = (domain) => {
    return User.find({ org_email_domain: domain })
      .then((users) => users)
      .catch((error) => console.log(error));
  };

  io.on("connection", (socket) => {
    // get current user
    socket.on("user", ({ _id, org_email_domain }) => {
      connectedSockets[_id] = socket.id;
      // console.log(`User ${_id} connected on socket ${socket.id}`);
      // console.log(`getting user for domain ${org_email_domain}`);
      // dispatch all users from organnisation
      getUsersByDomain(org_email_domain)
        .then((users) => io.to(socket.id).emit("users", users))
        .catch((error) => console.log(error));
    });

    // on chat message
    socket.on("chat-message", ({ from, to, message }) => {
      // console.log({ from, to, message });
      const uid = [from, to].sort().join("_");
      const chat = new Chat({
        uid,
        from,
        to,
        message,
      });
      chat.save((error, success) => {
        if (error) {
          console.log("Error saving chat", error);
        }
        Chat.find({ uid })
          .sort({ date: -1 })
          .limit(20)
          .exec((error, messages) => {
            if (error) {
              console.log("Error getting chat", error);
            }
            io.to(connectedSockets[from]).emit("new-message", messages);
            io.to(connectedSockets[to]).emit("new-message", messages);
          });
      });
    });

    // send chat history with user
    socket.on("chat-with", ({ from, to }) => {
      const uid = [from, to].sort().join("_");
      Chat.find({ uid })
        .sort({ date: -1 })
        .limit(20)
        .exec((error, messages) => {
          if (error) {
            console.log("Error getting chat", error);
          }
          io.to(connectedSockets[from]).emit("chat-history", messages);
          // io.to(connectedSockets[to]).emit("chat-history", messages);
        });
    });

    socket.on("disconnect", () => {
      Object.entries(connectedSockets).forEach(([key, value]) => {
        if (value === socket.id) {
          console.log(`User ${key} disconnected from socket ${socket.id}`);
        }
      });
    });
  });

  http.listen(port, () => {
    console.log(`chat server started on ${port}`);
  });
};
