import { TonClient, WalletContractV4, internal, OpenedContract } from "ton";
import { mnemonicToPrivateKey } from "ton-crypto";
import { KeyPair } from "ton-crypto/dist/primitives/nacl";

export class TonTransferService {

    static workchain = 0;

    private constructor(
        private client: TonClient,
        private keyPair: KeyPair,
        private wallet: WalletContractV4,
        private contract: OpenedContract<WalletContractV4>,
    ) {}

    static async create(endpoint: string) {
        const mnemonic = process.env.MNEMONIC || "";
        const client = new TonClient({ endpoint });
        const keyPair = await  mnemonicToPrivateKey(mnemonic.split(" "))
        const wallet = WalletContractV4.create({ workchain: this.workchain, publicKey: keyPair.publicKey });
        const contract = client.open(wallet);

        return new TonTransferService(client, keyPair, wallet, contract)
    }

    async getTonBalance(): Promise<number> {
        return TonTransferService.formatBalanceToView(Number(await this.contract.getBalance()));
    }

    async createTransfer(to: string, amount: number, msg?: string): Promise<void> {
        const seqno: number = await this.contract.getSeqno();

        await this.contract.createTransfer({
            seqno,
            secretKey: this.keyPair.secretKey,
            messages: [internal({
                value: amount.toString(),
                to,
                body: msg,
            })]
        });
    }

    static formatBalanceFromView(num: number) {
        return num * 10 ** 9
    }

    static formatBalanceToView(num: number) {
        return num / 10 ** 9
    }
}