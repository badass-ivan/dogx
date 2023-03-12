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
        attributes:[{ "trait_type": string, "value": Rarity }],
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

export enum Rarity {
    Common = "Common",
    Uncommon = "Uncommon",
    Rare = "Rare",
    Epic = "Epic",
    Legendary = "Legendary",
}

export const rarityPosition = {
    "Common": 4,
    "Uncommon": 3,
    "Rare": 2,
    "Epic": 1,
    "Legendary": 0,
}

export const colorByRarity = {
    "Common": "🟢",
    "Uncommon": "🔵",
    "Rare": "🟣",
    "Epic": "🔴",
    "Legendary": "🟡",
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
    address: string,
    nfts?: Nft[],
    otp: number
};
