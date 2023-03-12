import { BotService } from "./services/bot.service";
import { PostgresRepository } from "./repository/postgres.repository";
import "./utils/bind-logs";

function main() {
    PostgresRepository.init();
    BotService.start();
}

main();
