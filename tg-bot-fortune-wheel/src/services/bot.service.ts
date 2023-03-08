import { Telegraf } from "telegraf-ts";
import config from "../config";
import chatMessagesConfig from "../chat-messages.config";

const CHECK_TXN_ACTION = "check-txn-from-user-to-register";
const CHECK_NFTS_ACTION = "check-user-nfts-to-register";

export class BotService {

    private static bot: Telegraf<any>;

    static async start() {
        console.log("Start bot preparing");

        this.bot = new Telegraf(config.BOT_TOKEN);

        this.bindOnStart();
        this.bindOnMessage();

        this.bot.launch()
        console.log("Bot started!");
    }


    private static bindOnStart() {
        this.bot.start(async (ctx) => {

            ctx.reply("Hello");
        });
    }

    private static bindOnMessage() {
        this.bot.on('message', async (ctx) => {
            if (await this.checkIsUnwatchedMsg(ctx)) {
                return;
            }

            const msg = ctx.message;

        });
    }

    private static async checkIsUnwatchedMsg(ctx: any) {
        const msg = ctx.message;

        if (msg && msg.chat.id === config.CHAT_ID) return true;

        const fromUser = ctx.update?.callback_query?.from || msg?.from || {};
        return fromUser.is_bot;
    }

    private static createPayTonkeeperUrl(address: string, amount: number, text: number) {
        return `https://app.tonkeeper.com/transfer/${address}?amount=${amount}&text=${text}`;
    }

    static async getChatMember(tgUserId: number) {
        return this.bot.telegram.getChatMember(config.CHAT_ID, tgUserId);
    }

    static async kickChatMember(tgUserId: number) {
        await this.bot.telegram.kickChatMember(config.CHAT_ID, tgUserId);
    }

    static async sendMessage(message: string) {
        await this.bot.telegram.sendMessage(config.CHAT_ID, message);
    }

    private static async showUpdates() {
        const updates = await this.bot.telegram.getUpdates();
        console.log(updates)
        console.log(JSON.stringify(updates))
    }
}
