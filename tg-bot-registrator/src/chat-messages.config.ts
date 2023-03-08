export default {

    systemError: "Ошибка системы:\n$ERROR$\n\nПожалуйста, сообщите об этом администратору!",

    chatName: "",

    sign: {
        start: '',

        price: 0.001,

        gettingAddress: {

            isNotAddress: "Дружище, это не похоже на адрес...",

            alreadyInBand: "",

            addressAlreadyInUse: "",

            noNft: "",

            sessionExpired: "Кажется мы что-то потеряли... Отправь свой адрес снова 😓",

            btns: {
                send: "Открыть Tonkeeper",
                toCollection: "getgems.io",
                checkTxn: "Проверить",
                checkNfts: "Проверить NFT",
                referal: "У меня есть реферальный код",
            },

            hasNft: {
                one: "",

                less5: "",

                more5: "",

                endText: "Окей, теперь давай убедимся, что ты - это ты.\nОтправь $PRICE$ TON (это даже не рубль 😉) на адрес:\n$ADDRESS$\nИ не забудь комментарий: $OTP$",
            }
        },

        checkTxn: {
            payed: "",

            noTxn: "",
        }
    },

    watchdog: {

        ban: "$USER$ изгнан😈! Отсутствие дога карается!",
    },

    newMember: "В стае пополнение!\n$USER$\n\nВладеет:\n$NFTS$",
}
