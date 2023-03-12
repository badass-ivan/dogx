import { Session } from "../models/types";
import { UserSession } from "../repository/user-session";

export class UserSessionService {

    private static userSessionData: { [tgUserId: string]: Session | undefined } = {};

    static async init() {
        const sessions = await UserSession.getSessions();

        sessions.map(it => {
            this.userSessionData[it.tgUserId] = {
                tgUserId: +it.tgUserId,
                address: it.address,
                otp: +it.otp,
                fromReferralLink: it.fromReferralLink,
            };
        })

        console.log(`Cache inited with sessions: ${sessions.length}`)
    }

    static async getSessionByUserId(tgUserId: number): Promise<Session | undefined> {
        if (this.userSessionData[tgUserId]) {
            return this.userSessionData[tgUserId];
        }

        const session = await UserSession.findByTgUserId(tgUserId);

        return session ? {
            tgUserId: +session.tgUserId,
            address: session.address,
            otp: +session.otp,
            fromReferralLink: session.fromReferralLink,
        } : undefined;
    }

    static async saveSession(session: Session): Promise<Session> {
        console.log(`Save session for tgUserId: ${session.tgUserId} address: ${session.address} nfts: ${session.nfts?.length} otp: ${session.otp}`)
        const useSession = await UserSession.createOrUpdate(session);

        this.userSessionData[session.tgUserId] = {
            tgUserId: +useSession.tgUserId,
            address: useSession.address,
            otp: +useSession.otp,
            nfts: session.nfts,
            fromReferralLink: session.fromReferralLink,
        }

        return this.userSessionData[session.tgUserId] as Session
    }

    static async removeSession(session: Session): Promise<void> {
        console.log(`Remove session for tgUserId: ${session.tgUserId} address: ${session.address} nfts: ${session.nfts?.length} otp: ${session.otp}`)
        delete this.userSessionData[session.tgUserId];
        await UserSession.removeSessionByTgUserId(session.tgUserId);
        console.log(`Remove session for tgUserId: ${session.tgUserId} address: ${session.address} nfts: ${session.nfts?.length} otp: ${session.otp}`)
    }
}
