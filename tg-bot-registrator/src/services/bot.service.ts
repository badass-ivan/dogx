import { Telegraf } from "telegraf-ts";
import config from "../config";
import { TonService } from "./ton.service";
import { NewChatMember, Nft, Txn } from "../models/types";
import moment from "moment";
import base64 from "base-64";
import { Address } from 'ton';
import { ChatMembersService } from "./chat-members.service";
import { ChatWatchdogService } from "./chat-watchdog.service";
import chatMessagesConfig from "../chat-messages.config";
import { errorHandler } from "../utils/error-handler";

const CHECK_TXN_ACTION = "check-txn-from-user-to-register-action";
const CHECK_NFTS_ACTION = "check-user-nfts-to-register-action";
const NO_REFERRAL_CODE_ACTION = "no_refferal-code-action";

export class BotService {

    private static bot: Telegraf<any>;

    // private static addressOtp: { [address: string]: number } = {};

    private static userSessionData: { [tgUserId: string]: { address: string, nfts: Nft[], otp: number } | null } = {};

    static async start() {
        console.log("Start bot preparing");

        this.bot = new Telegraf(config.BOT_TOKEN);

        // await ChatMembersService.init();
        // await ChatWatchdogService.start();

        this.bindOnStart();
        this.bindOnMessage();
        this.bindOnRecheckNfts();
        this.bindOnNoReferralCode();
        this.bindOnCheckTxn();

        this.bot.launch()
        console.log("Bot started!");
    }


    private static bindOnStart() {
        this.bot.start(async (ctx) => {
            if (await this.checkIsUnwatchedMsg(ctx)) {
                return;
            }
            ctx.reply(chatMessagesConfig.sign.start);
        });
    }

    private static bindOnMessage() {
        this.bot.on('message', async (ctx) => {
            const msg = ctx.message;

            if (msg && msg.chat.id === config.CHAT_ID && msg.new_chat_member) {
                await this.onNewChatMember(ctx, ctx.message.new_chat_member);
                return;
            }

            const tgUserId = ctx.message.from.id;
            const text = ctx.message.text;

            console.log(`Getting text: ${text} from ${tgUserId}`);

            if (
                await this.checkIsUnwatchedMsg(ctx)
                || await this.checkIsRegisteredUserOrAddress(ctx)
                || !text
            ) {
                return;
            }

            await this.checkNfts(ctx, text, tgUserId);
        });
    }

    private static async checkIsRegisteredUserOrAddress(ctx: any) {
        const tgUserId = ctx.message.from.id;
        const text = ctx.message.text;

        if (ChatMembersService.getChatMembersByUserId()[tgUserId]) {
            console.log(`${tgUserId} already in chat`);
            await ctx.reply(chatMessagesConfig.sign.gettingAddress.alreadyInBand);
            return true;
        }

        if (ChatMembersService.getChatMembers().some(it => it.address === text)) {
            console.log(`Address: ${text} requested from user with tgId: ${tgUserId} already in use`);
            await ctx.reply(chatMessagesConfig.sign.gettingAddress.addressAlreadyInUse);
            return true;
        }

        return false;
    }

    private static async checkNfts(ctx: any, address: string, tgUserId: number) {
        try {
            const nfts = await TonService.getNftsFromTargetCollection(address);

            this.userSessionData[tgUserId] = { address, nfts, otp: moment().unix() };

            if (!nfts.length) {
                console.log(`User with tgId: ${tgUserId} and address: ${address} has no NFTs`);
                await ctx.reply(chatMessagesConfig.sign.gettingAddress.noNft, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: chatMessagesConfig.sign.gettingAddress.btns.toCollection,
                                    url: config.COLLECTION_URL,
                                },
                                {
                                    text: chatMessagesConfig.sign.gettingAddress.btns.checkNfts,
                                    callback_data: CHECK_NFTS_ACTION
                                }
                            ],
                        ]
                    }
                })
                return;
            }

            console.log(`Send msg with NFTs to ${tgUserId} and address: ${address}`);

            await ctx.reply(this.prepareMsgWithNft(nfts), {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: chatMessagesConfig.sign.gettingAddress.btns.noReferralCode,
                                callback_data: CHECK_TXN_ACTION
                            }
                            // {
                            //     text: chatMessagesConfig.sign.gettingAddress.btns.send,
                            //     url: this.createPayTonkeeperUrl(TonService.formatBalanceFromView(chatMessagesConfig.sign.price), otp)
                            // },
                            // {
                            //     text: chatMessagesConfig.sign.gettingAddress.btns.checkTxn,
                            //     callback_data: CHECK_TXN_ACTION
                            // }
                        ],
                    ]
                }
            })
        } catch (e) {
            if (e.message.includes("illegal base64 data at input byte ")) {
                console.log(`User with tgId: ${tgUserId} wrote not an address: ${address}`);
                await ctx.reply(chatMessagesConfig.sign.gettingAddress.isNotAddress);
                return;
            }
            console.error(e)
            await errorHandler(ctx, e.message)
        }
    }

    private static async checkIsUnwatchedMsg(ctx: any) {
        const msg = ctx.message;

        if (msg && msg.chat.id === config.CHAT_ID) return true;

        const fromUser = ctx.update?.callback_query?.from || msg?.from || {};
        return fromUser.is_bot;
    }

    private static bindOnRecheckNfts() {
        this.bot.action(CHECK_NFTS_ACTION, async (ctx) => {
            if (await this.checkIsUnwatchedMsg(ctx)) {
                return;
            }

            const tgUserId = ctx.update.callback_query.from.id;
            const sessionData = this.userSessionData[tgUserId];

            if (!sessionData) {
                ctx.reply(chatMessagesConfig.sign.gettingAddress.sessionExpired);
                return;
            }

            await this.checkNfts(ctx, sessionData.address, tgUserId);
        })
    }

    private static bindOnNoReferralCode() {
        this.bot.action(NO_REFERRAL_CODE_ACTION, async (ctx) => {
            if (await this.checkIsUnwatchedMsg(ctx)) {
                return;
            }

            const tgUserId = ctx.update.callback_query.from.id;
            const sessionData = this.userSessionData[tgUserId];

            await ctx.reply(this.getSendText(sessionData.otp), {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: chatMessagesConfig.sign.gettingAddress.btns.send,
                                url: this.createPayTonkeeperUrl(TonService.formatBalanceFromView(chatMessagesConfig.sign.price), sessionData.otp)
                            },
                            {
                                text: chatMessagesConfig.sign.gettingAddress.btns.checkTxn,
                                callback_data: CHECK_TXN_ACTION
                            }
                        ],
                    ]
                }
            });
        })
    }

    private static bindOnCheckTxn() {
        this.bot.action(CHECK_TXN_ACTION, async (ctx) => {
            if (await this.checkIsUnwatchedMsg(ctx)) {
                return;
            }

            const tgUserId = ctx.update.callback_query.from.id;
            const sessionData = this.userSessionData[tgUserId];
            console.log(`Finding owner txn from user with tgID: ${tgUserId}, address: ${sessionData?.address} and otp: ${sessionData?.otp}`);

            if (!sessionData) {
                console.log("Expired session")
                return;
            }

            // already registered
            if (ChatMembersService.getChatMembersByUserId()[tgUserId]) {
                return;
            }

            let txns: Txn[] = [];

            try {
               txns = await TonService.getTxns(config.OWNER_ADDRESS);
            } catch (e) {
                await errorHandler(ctx, e.message)
                return;
            }

            const hasTxn = txns.find(txn => {
                if (!txn.in_msg.source) return false;

                const decodedRawMsg = base64.decode(txn.in_msg.msg_data);
                const otp = decodedRawMsg.slice(decodedRawMsg.length - sessionData.otp.toString().length)
                const address = Address.parseRaw(txn.in_msg.source.address);

                return sessionData.otp == otp && address.toString() == sessionData.address;
            });

            if (hasTxn) {
                try {
                    console.log(`Start saving user ${tgUserId} with address ${sessionData.address}`);
                    await ChatMembersService.saveChatMember({ tgUserId, address: sessionData.address, })
                    console.log(`Done saving user ${tgUserId} with address ${sessionData.address}`);
                } catch (e) {
                    await errorHandler(ctx, e.message)
                    return;
                }

                await ctx.reply(chatMessagesConfig.sign.checkTxn.payed, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: chatMessagesConfig.chatName,
                                    url: await this.bot.telegram.exportChatInviteLink(config.CHAT_ID)
                                }
                            ],
                        ]
                    }
                })
                return;
            }

            console.log(`Cant find txn from user with tgId: ${tgUserId} and address: ${sessionData.address}`);
            await ctx.reply(chatMessagesConfig.sign.checkTxn.noTxn)
        });
    }

    private static async onNewChatMember(ctx: any, member: NewChatMember) {
        const sessionData = this.userSessionData[member.id];

        let address = sessionData.address;

        console.log(`New chat member with tgId: ${member.id} and address: ${address}`);

        if (!sessionData) {
            const chatUser = ChatMembersService.getChatMembersByUserId()[member.id];
            if (!chatUser) return;

            address = chatUser.address;
        }

        const nfts = sessionData?.nfts || await TonService.getNftsFromTargetCollection(address);

        const nftNames = this.getBeautifulNftsString(nfts);

        ctx.reply(chatMessagesConfig.newMember
            .replace("$USER$", member.username)
            .replace("$NFTS$",nftNames));
    }

    private static getSendText(otp: number) {
        return chatMessagesConfig.sign.gettingAddress.hasNft.sendText
            .replace("$PRICE", chatMessagesConfig.sign.price.toString())
            .replace("$ADDRESS$", config.OWNER_ADDRESS)
            .replace("$OTP$", otp.toString());
    }

    private static prepareMsgWithNft(nfts: Nft[]): string {

        const nftNames = this.getBeautifulNftsString(nfts);

        return chatMessagesConfig.sign.gettingAddress.hasNft.text
            .replace("$NFTS$", nftNames)
            .replace("$REFERRAL_TEXT$", chatMessagesConfig.sign.gettingAddress.hasNft.referralText);
    }

    private static createPayTonkeeperUrl(amount: number, text: number) {
        return `https://app.tonkeeper.com/transfer/${config.OWNER_ADDRESS}?amount=${amount}&text=${text}`;
    }

    static getBeautifulNftsString(nfts: Nft[]) {
        if (nfts.length > 5) {
            return `${this.getNftsString(nfts.slice(0, 4))}+${nfts.slice(4).length}NFTs...`;
        }
        return this.getNftsString(nfts)
    }

    static getNftsString(nfts: Nft[]) {
        return nfts.map(it => `${it.metadata.name}\n`).join("");
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
