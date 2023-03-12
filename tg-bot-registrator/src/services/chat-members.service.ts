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
        return Object.values(this.cachedMembers).filter(it => it) as ChatMember[]
    }

    static getChatMembersByUserId(): { [tgUserId: string]: ChatMember | undefined } {
        return Object.fromEntries(
            this.getChatMembers().map(member => [member.tgUserId, member])
        );
    }

    static async saveChatMember(chatMember: RawChatMember): Promise<ChatMember | undefined> {
        console.log(`Start saving user ${chatMember.tgUserId} with address ${chatMember.address}`);
        this.cachedMembers[chatMember.address] = await ChatMembers.saveChatMember(chatMember);
        console.log(`Done saving user ${chatMember.tgUserId} with address ${chatMember.address}`);
        return this.cachedMembers[chatMember.address]
    }

    static async removeChatMember(member: ChatMember): Promise<void> {
        console.log(`Start removing user ${member.tgUserId} with address ${member.address}`);
        delete this.cachedMembers[member.address];
        await ChatMembers.removeChatMemberById(member.id);
        console.log(`Done removing user ${member.tgUserId} with address ${member.address}`);
    }
}
