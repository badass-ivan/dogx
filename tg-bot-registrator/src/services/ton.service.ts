import axios from "axios";
import config, { TON_REQ_HEADER } from "../config";
import { Txn } from "../models/types";

export class TonService {

    static async getNftsFromTargetCollection(address: string) {
        try {
            const { data } = await axios.get(`${config.TON_API_URL}/nft/searchItems?`+ new URLSearchParams({
                owner: address,
                collection: config.COLLECTION_ADDRESS,
                "include_on_sale": "false",
                limit: "20",
                offset: "0"
            }).toString(), TON_REQ_HEADER);

            return data.nft_items;
        } catch (e) {
            const errorData = e.response.data;
            throw Error(errorData.error || errorData.message || errorData)
        }
    }

    static async getTxns(address: string): Promise<Txn[]> {
        try {
            const { data } = await axios.get(`${config.TON_API_URL}/blockchain/getTransactions?`+ new URLSearchParams({
                account: address,
            }).toString(), TON_REQ_HEADER);

            return data.transactions;
        } catch (e) {
            const errorData = e.response.data;
            throw Error(errorData.error || errorData.message || errorData)
        }
    }

    static formatBalanceFromView(num: number) {
        return num * 10 ** 9
    }
}
