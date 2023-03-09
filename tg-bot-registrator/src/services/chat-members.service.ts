import { ChatMember, RawChatMember } from "../models/types";
import { ChatMembers } from "../repository/chat-members";

export class ChatMembersService {

    private static cachedMembers: ChatMember[] = [];

    static async init() {
        this.cachedMembers = await ChatMembers.getAllChatMembers();
        console.log(`Cache inited with members: ${this.cachedMembers.length}`)
    }

    static getChatMembers(): ChatMember[] {
        return this.cachedMembers
    }

    static getChatMembersByUserId(): { [tgUserId: string]: ChatMember | undefined } {
        return Object.fromEntries(
            this.getChatMembers().map(member => [member.tgUserId, member])
        );
    }

    static async saveChatMember(chatMember: RawChatMember): Promise<ChatMember> {
        const member = await ChatMembers.saveChatMember(chatMember);
        this.cachedMembers.push(member);
        return member
    }
}
