import { ChatMember, RawChatMember } from "../models/types";
import { ChatMembers } from "../repository/chat-members";

export class ChatMembersService {

    private static cachedMembers: { [address: string]: ChatMember | undefined } = {};

    static async init() {
        const members = await ChatMembers.getAllChatMembers();

        members.map(it => {
            this.cachedMembers[it.address] = it;
        })

        console.log(`Cache inited with members: ${members.length}`)
    }

    static getChatMembers(): ChatMember[] {
        return Object.values(this.cachedMembers)
    }

    static getChatMembersByUserId(): { [tgUserId: string]: ChatMember | undefined } {
        return Object.fromEntries(
            this.getChatMembers().map(member => [member.tgUserId, member])
        );
    }

    static async saveChatMember(chatMember: RawChatMember): Promise<ChatMember> {
        this.cachedMembers[chatMember.address] = await ChatMembers.saveChatMember(chatMember);
        return this.cachedMembers[chatMember.address]
    }
}
