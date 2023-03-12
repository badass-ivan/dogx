import { Sequelize } from "sequelize-typescript";
import { ChatMembers } from "./chat-members";
import { UserSession } from "./user-session";

export class PostgresRepository {

    static sequelize: Sequelize

    static init() {
        this.sequelize = new Sequelize(
            {
                database: process.env.DATABASE_NAME,
                host: process.env.DATABASE_HOST,
                port: +(process.env.DATABASE_PORT || "123"),
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                dialect: "postgres",
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
                models: [ChatMembers, UserSession],
                logging: (sql: string) => console.log(sql),
            }
        )
    }
}
