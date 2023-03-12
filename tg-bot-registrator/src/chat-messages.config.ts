export default {

    systemError: "Ошибка системы:\n$ERROR$\n\nПожалуйста, сообщите об этом администратору!",

    chatName: "DogX Holders",

    collectionUrl: "https://getgems.io/collection/EQB_24cS5G4ssIQ6DmbjeL76WuXZ164zLBFuojAlDi6x9MYp",

    referralCodeText: "Держи свою реферальную ссылку!\n$REFERRAL_LINK$\nЕсли твой другу(или подруга) перейдёт по этой ссылке и войдёт в чат холдеров, то вы оба получите по $REFERRAL_PRIZE$!",

    referralPrize: 0.1,

    btns: {
        getReferralCode: "Получить реферальную ссылку",
    },

    sign: {
        start: 'Привет!🐺‍\nХочешь в стаю? Тогда пройди обряд инициации\n*отправь адрес своего кошелька*\n\nУ тебя должен быть хотя бы один 🐕NFT и не на продаже!',

        price: 0.001,

        minCountOfDogs: 6,

        gettingAddress: {

            isNotAddress: "Дружище, это не похоже на адрес...",

            alreadyInBand: "Ты уже в стае.",

            addressAlreadyInUse: "Пользователь с таким адресом уже в чатике.",

            noNft: "Кажется, мы не смогли найти у тебя догов🥺\nПереходи на нашу коллекцию в getgems.io и возми себе верного друга!",

            sessionFailed: "Кажется мы что-то потеряли... Отправь свой адрес снова 😓",

            btns: {
                send: "Tonkeeper",
                toCollection: "getgems.io",
                checkTxn: "Проверить",
                checkNfts: "Проверить NFT",
            },

            hasNft: {
                text: "Вот такие NFT нам удалось у тебя найти\n$NFTS$\n$END_TEXT",

                notEnoughNft: "Для вступления в закрытый чат, нужно иметь хотя бы $COUNT_OF_NFT$ NFT.\nТебе не хватает всего лишь $NOT_ENOUGH_NFT$😉",

                sendText: "Окей, теперь давай убедимся, что ты - это ты.\nОтправь $PRICE$ TON (это даже не рубль 😉) на адрес:\n$ADDRESS$\nИ не забудь комментарий: $OTP$",
            }
        },

        checkTxn: {
            payed: "Поздравляю со встеплением в стаю🐺\n\nПрисодиняйся скорее!",

            noTxn: "Хм... Кажется, твоя транзакция ещё не пришла.\nПопробуй повторить проверку чуть позже.",
        }
    },

    watchdog: {

        ban: "$USER$ изгнан😈! Отсутствие 6 догов карается!",
    },

    newMember: "В стае пополнение!\n$USER$\n\nВладеет:\n$NFTS$",
}
