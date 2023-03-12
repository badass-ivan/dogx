import { BotService } from "../services/bot.service";

const defaultLog = console.log;
console.log = (...args) => {
    BotService.sendMsgToAdmin(JSON.stringify(args))
    defaultLog(...args, new Date())
}

const defaultError = console.error;
console.error = (...args) => {
    BotService.sendErrorToAdmin(JSON.stringify(args))
    defaultError(...args, new Date())
}
