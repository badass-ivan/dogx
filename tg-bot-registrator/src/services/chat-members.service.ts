import { ChatMember, RawChatMember } from "../models/types";
import { ChatMembers } from "../repository/chat-members";

export class ChatMembersService {

    private static cachedMembers: ChatMember[] = [];

    static async init() {
        this.cachedMembers = await ChatMembers.getAllChatMembers();
        console.log(`Cache inited with members: ${this.cachedMembers.length}`)
    }

    static getChatMembers(): ChatMember[] {
        return Object.values(this.cachedMembers).filter(it => it) as ChatMember[]
    }

    static getChatMembersByUserId(tgUserId: number): ChatMember | undefined {
        return this.cachedMembers.find(it => +it.tgUserId === tgUserId);
    }

    static async saveChatMember(chatMember: RawChatMember): Promise<ChatMember | undefined> {
        console.log(`Start saving user ${chatMember.tgUserId} with address ${chatMember.address}`);
        const member = await ChatMembers.saveChatMember(chatMember);
        this.cachedMembers.push(member);
        console.log(`Done saving user ${chatMember.tgUserId} with address ${chatMember.address}`);
        return member;
    }

    static async removeChatMember(member: ChatMember): Promise<void> {
        console.log(`Start removing user ${member.tgUserId} with address ${member.address}`);

        const index = this.cachedMembers.findIndex(it => it.id === member.id);

        if (index === -1) throw Error(`Unknown user id:${member.id} tgUserId: ${member.tgUserId} address: ${member.address} to delete`);

        this.cachedMembers.splice(index, 1);
        await ChatMembers.removeChatMemberById(member.id);

        console.log(`Done removing user ${member.tgUserId} with address ${member.address}`);
    }
}
