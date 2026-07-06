import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { telegramMessageInputSchema, sendTelegramMessage } from "sendkit-core";

const server = new McpServer({
  name: "sendkit-local",
  version: "0.0.0",
});

function getTelegramBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN; // does not need env file to run

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is required. Configure it in your MPC client environment.");
  }

  return token;
}

server.registerTool(
  "telegram", // tool name
  {
    title: "Telegram",
    description: "Send a Telegram message.",
    inputSchema: telegramMessageInputSchema,
  },
  async (input) => {
    const result = await sendTelegramMessage({
      ...input,
      botToken: getTelegramBotToken(),
    });

    return {
      // format of data agent responses to user
      content: [
        {
          type: "text",
          text: `Send Telegram message ${result.messageId} to chat ${result.chatId}`,
        },
      ],
      structuredContent: result,
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport); // connecting standard input output like you connect to a database
