import { TonService } from "./ton.service";
import { ChatMembersService } from "./chat-members.service";
import chatMessagesConfig from "../chat-messages.config";
import { BotService } from "./bot.service";

export class ChatWatchdogService {

    static start() {
        console.log("Watchdog inited")
        this.startCheckingChatUsers();
    }

    private static async startCheckingChatUsers() {
        await this.checkChatUsers();

        setInterval(() => {
            this.checkChatUsers();
        }, 1000 * 60 * 10);
    }

    private static async checkChatUsers() {
        const members = ChatMembersService.getChatMembers();
        console.log(`Start watchdog finding for ${members.length} members...`)

        for(let i = 0; i < members.length; i++) {
            const it = members[i];

            try {
                const nfts = await TonService.getNftsFromTargetCollection(it.address);

                if (!nfts.length) {
                    const tgMember = await BotService.getChatMember(+it.tgUserId);
                    console.log(`Remove ${tgMember.user.username} from chat`)
                    await BotService.kickChatMember(+it.tgUserId);
                    await BotService.sendMessage(chatMessagesConfig.watchdog.ban.replace("$USER$", tgMember.user.username || ""));
                    await ChatMembersService.removeChatMember(it);
                }

            } catch (e) {
                console.error(e);
            }

            await new Promise(res => setTimeout(res, 200))
        }
    }
}
