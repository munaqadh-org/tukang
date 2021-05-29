const axios = require('axios')

const ACCESS_KEY = "1737516827:AAG3-3-XcZQNAPvA1XORdTIgDxJlKU6bkZE"
const CHAT_ID = -515673992;

const DEFAULT_ACCOUNT = {
    id: 0,
    telegramID: "",
    name: "",
    githubUsername: ""
}

const ACCOUNTS = [
    {
        id: 0,
        telegramID: "@ridho_assuryadi",
        name: "Ridho",
        githubUsername: "ridhoassuryadi"
    },
    {
        id: 1,
        telegramID: "@agusfikri",
        name: "Agus",
        githubUsername: "ikrydev"
    },
    {
        id: 2,
        telegramID: "@aldiskatel",
        name: "Aldi",
        githubUsername: "aldiskatel"
    },
    {
        id: 3,
        telegramID: "@anjar_bording",
        name: "Anjar",
        githubUsername: "gnosprinting"
    }
]

const getUserBasedOnGithubUsername = (githubUsername) => {
    let user =  ACCOUNTS.find(usr => usr.githubUsername == githubUsername)

    if (user === undefined){
        return DEFAULT_ACCOUNT
    }

    return user
}


const getGithubUrl = (escapedURL) => {
    return escapedURL.replace(/\\/, '');
}

const parseWebhookPayload = (payload) => {
    return {
        assigner: payload.pull_request.user.login || "",
        PRUrl: getGithubUrl(payload.pull_request.html_url || ""),
        action: payload.action || "",
        state: payload.review ? payload.review.state : '',
        title: payload.pull_request.title || "",
        repository: {
            name: payload.repository.name,
            url: payload.repository.url
        }
    }
}

const getMessageBasedOnActionType = (actionType) => {
    switch(actionType) {
        case ACTION.APPROVED :
            return 'telah menyetujui pull request '
        break;
        case ACTION.CLOSED :
            return 'telah menutup pull request '
        break;
        case ACTION.REVIEW_REQUESTED:
            return 'telah membuka pull request '
        break;
        case ACTION.REOPENED:
            return 'telah membuka kembali pull request '
        break;
        default:
            return `melakukan action ${actionType} `
        break;
    };
}

module.exports = (req, res) => {
    console.log("masuk",req.body)
    const githubData = parseWebhookPayload(req.body);
    console.log(githubData)
    axios.post(`https://api.telegram.org/bot${ACCESS_KEY}/sendMessage`, {
        "chat_id": CHAT_ID ,
        text: 'Flintsxxtone',
        parse_mode: "markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Buka Code",
                        url: "test.com"
                    }
                ]
            ]
        }
      })
      .then(function (response) {
        res.send("sucxßsscess")
      })
      .catch(function (error) {
        console.log(err);
        res.send(JSON.stringify({ success: false }));
      });
}