export type Nft = {
    address: string,
    approved_by: null,
    collection: {
        address: string,
        name: string
    },
    collection_address: string,
    index: 0,
    metadata: {
        name: string,
        description: string,
        marketplace: string,
        attributes:[{ "trait_type": string, "value": string }],
        image: string
    },
    owner: {
        address: string,
        icon: string,
        is_scam: false,
        name: string, // domain
    },
    verified: true
}

export type Txn = {
    in_msg: {
        msg_data: string,
        destination: {
            address: string,
        }
        source: {
            address: string,
        }
    }
}
export type NewChatMember = {
    id: number,
    is_bot: boolean,
    first_name: string,
    last_name: string,
    username: string,
    language_code: string,
}

export type RawChatMember = {
    address: string,
    tgUserId: string,
}

export type ChatMember = RawChatMember & {
    id: string,
}

export type Session = {
    tgUserId: number,
    address?: string,
    nfts?: Nft[],
    otp?: number,
    fromReferralCode?: string
};
