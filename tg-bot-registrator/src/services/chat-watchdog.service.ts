import { Telegraf } from "telegraf-ts";
import config from "../config";
import { TonService } from "./ton.service";
import { ChatMembersService } from "./chat-members.service";
import chatMessagesConfig from "../chat-messages.config";
import { BotService } from "./bot.service";

export class ChatWatchdogService {

    static start() {
        this.startCheckingChatUsers();
    }

    private static async startCheckingChatUsers() {
        console.log("Check bad chat members")
        await this.checkChatUsers();

        setInterval(() => {
            this.checkChatUsers();
        }, 1000 * 60 * 10);
    }

    private static async checkChatUsers() {
        const members = ChatMembersService.getChatMembers();

        await Promise.all(members.map(async it => {
            const nfts = await TonService.getNftsFromTargetCollection(it.address);

            if (!nfts.length) {
                const member = await BotService.getChatMember(+it.tgUserId);
                console.log(`Remove ${member.user.username} from chat`)
                await BotService.kickChatMember(+it.tgUserId);
                await BotService.sendMessage(chatMessagesConfig.watchdog.ban.replace("$USER$", member.user.username));
            }
        }))
    }
}
