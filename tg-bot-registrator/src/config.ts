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
    CHAT_ID: +process.env.CHAT_ID,
    COLLECTION_ADDRESS: process.env.COLLECTION_ADDRESS,
    OWNER_ADDRESS: process.env.OWNER_ADDRESS,
    TON_API_URL: "https://tonapi.io/v1",
    TON_API_SERVER_KEY: `Bearer ${process.env.TON_API_SERVER_KEY}`,
    COLLECTION_URL: "https://getgems.io/collection/EQBNoiznqLZkOOpZnMe09cb3qHHs_CPEaARXj4CHqgkm3h2n?filter=%7B%22attributes%22%3A%7B%7D%7D",
}

export const TON_REQ_HEADER = {
    headers: {
        'Authorization': config.TON_API_SERVER_KEY,
    },
}

export default config;
