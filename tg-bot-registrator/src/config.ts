import { config as envConfig } from "dotenv";
envConfig();

const BOT_ID = process.env.BOT_ID;
const BOT_HASH = process.env.BOT_HASH;
const BOT_TOKEN = `${BOT_ID}:${BOT_HASH}`;
const TG_API = "https://api.telegram.org";

const config = {
    BOT_ID,
    BOT_HASH,
    BOT_TOKEN,
    TG_API,
    TG_BOT_API: `${TG_API}/bot${BOT_TOKEN}`,
    CHAT_ID: +(process.env.CHAT_ID || "0"),
    COLLECTION_ADDRESS: process.env.COLLECTION_ADDRESS || "",
    OWNER_ADDRESS: process.env.OWNER_ADDRESS || "",
    ADMIN_CHAT_ID: process.env.ADMIN_CHAT_ID || "",
    OWNER_CHAT_ID: process.env.OWNER_CHAT_ID || "",
    BOT_USERNAME: process.env.BOT_USERNAME || "",
    TON_API_URL: "https://tonapi.io/v1",
    TON_JSON_RPC_API: process.env.TON_JSON_RPC_API || "",
    TON_API_SERVER_KEY: `Bearer ${process.env.TON_API_SERVER_KEY || ""}`,
    TON_API_JSON_RPC_KEY: process.env.TON_API_JSON_RPC_KEY || "",
}

export const TON_REQ_HEADER = {
    headers: {
        'Authorization': config.TON_API_SERVER_KEY,
    },
}

export default config;
