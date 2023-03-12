import axios from "axios";
import config, { TON_REQ_HEADER } from "../config";
import { Txn } from "../models/types";
import { TonTransferService } from "../../../ton-transfer"

export class TonService {

    private static transferService: TonTransferService;

    static async init() {
        this.transferService = await TonTransferService.create(config.TON_JSON_RPC_API);
        console.log(`Transfer service inited with balance ${await this.transferService.getTonBalance()}`)
    }

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
        } catch (e: any) {
            const errorData = e.response?.data || e;
            throw Error(errorData.error || errorData.message || errorData)
        }
    }

    static async getTxns(address: string): Promise<Txn[]> {
        try {
            const { data } = await axios.get(`${config.TON_API_URL}/blockchain/getTransactions?`+ new URLSearchParams({
                account: address,
            }).toString(), TON_REQ_HEADER);

            return data.transactions;
        } catch (e: any) {
            const errorData = e.response.data;
            throw Error(errorData.error || errorData.message || errorData)
        }
    }
}
