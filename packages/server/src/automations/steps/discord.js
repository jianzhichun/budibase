const fetch = require("node-fetch")
const { getFetchResponse } = require("./utils")

const DEFAULT_USERNAME = "Budibase Automate"
const DEFAULT_AVATAR_URL = "https://i.imgur.com/a1cmTKM.png"

exports.definition = {
  name: "Discord Message",
  tagline: "Send a message to a Discord server",
  description: "Send a message to a Discord server",
  icon: "ri-discord-line",
  stepId: "discord",
  type: "ACTION",
  internal: false,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: "string",
          title: "Discord Webhook URL",
        },
        username: {
          type: "string",
          title: "Bot Name",
        },
        avatar_url: {
          type: "string",
          title: "Bot Avatar URL",
        },
        content: {
          type: "string",
          title: "Message",
        },
      },
      required: ["url", "content"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: "number",
          description: "The HTTP status code of the request",
        },
        response: {
          type: "string",
          description: "The response from the Discord Webhook",
        },
        success: {
          type: "boolean",
          description: "Whether the message sent successfully",
        },
      },
    },
  },
}

exports.run = async function ({ inputs }) {
  let { url, username, avatar_url, content } = inputs
  if (!username) {
    username = DEFAULT_USERNAME
  }
  if (!avatar_url) {
    avatar_url = DEFAULT_AVATAR_URL
  }
  const response = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      username,
      avatar_url,
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  const { status, message } = await getFetchResponse(response)
  return {
    httpStatus: status,
    success: status === 200,
    response: message,
  }
}
