import chatMessagesConfig from "../chat-messages.config";

export const errorHandler = async (ctx: any, error: string) => {
    await ctx.reply(chatMessagesConfig.systemError.replace("$ERROR$", error))
}
