import { Session } from "../models/types";
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { uuid } from "uuidv4";
import { Op } from "sequelize";

@Table({
    tableName: "user_session",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})
export class UserSession extends Model {

    @PrimaryKey
    @Column
    id: string;

    @Column({ field: "tg_user_id" })
    tgUserId: string;

    @Column({ field: "address", allowNull: true })
    address: string;

    @Column({ field: "otp", allowNull: true })
    otp: string;

    @Column({ field: "inviter_tg_user_id", allowNull: true })
    inviterTgUserId: string;

    static async getSessions(): Promise<UserSession[]> {
        return this.findAll();
    }

    static async findByTgUserId(tgUserId: number): Promise<UserSession | null> {
        return this.findOne({
            where: { tgUserId: tgUserId.toString() }
        })
    }

    static async createOrUpdate(session: Session): Promise<UserSession> {
        console.log(`Create or update session for tgUserId: ${session.tgUserId} address: ${session.address} nfts: ${session.nfts?.length} otp: ${session.otp}`)
        const tgUserId = session.tgUserId.toString();
        const otp = session.otp?.toString() || null;

        const userSession = await this.findByTgUserId(session.tgUserId);

        if (userSession) {
            console.log(`Update session for tgUserId: ${session.tgUserId}`)
            await UserSession.update({ otp, address: session.address, inviterTgUserId: session.inviterTgUserId }, {
                where: {
                    tgUserId: {
                        [Op.eq]: tgUserId
                    }
                }
            })

            return (await this.findByTgUserId(session.tgUserId)) as UserSession;
        }

        console.log(`Create session for tgUserId: ${session.tgUserId}`)

        return await UserSession.create({
            id: uuid(),
            tgUserId,
            address: session.address,
            otp: session.otp?.toString(),
            inviterTgUserId: session.inviterTgUserId,
        })
    }

    static async removeSessionByTgUserId(tgUserId: number): Promise<void> {
        console.log(`Remove session for tgUserId: ${tgUserId}`)
        await UserSession.destroy({
            where: { tgUserId },
        })
    }
}
