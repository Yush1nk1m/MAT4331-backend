"use strict";

const io = require("socket.io-client");

function generateRandomString(length) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

module.exports = {
  afterWebSocketTest: async function (context, events, done) {
    const axios = require("axios");

    const accessToken = context.vars.accessToken;

    await axios.delete(
      `${context.config.target}/v1/members`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return done();
  },

  emitJoinroom: function (context, events, done) {},

  getRandomPause: function (userContext, events, done) {
    userContext.vars.pause = Math.floor(Math.random() * 8) + 2;
    return done();
  },
};
