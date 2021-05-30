const axios = require('axios')


const ACCESS_KEY = process.env.TELEGRAM_KEY
const CHAT_ID = process.env.TELEGRAM_CHANNEL_ID 

const DEFAULT_ACCOUNT = {
    id: 0,
    telegramID: "",
    name: "",
    githubUsername: ""
}

const ACTION  = {
    REVIEW_REQUESTED: 'review_requested',
    SUBMITTED: 'submitted',
    APPROVED: 'approved',
    CHANGES_REQUESTED: 'changes_requested',
    COMMENTED: 'commented',
    CLOSED: 'closed',
    REOPENED: 'reopened'
};

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
    let user =  ACCOUNTS.find(usr => usr.githubUsername === githubUsername)

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
        assigner: payload.sender.login || "",
        PRUrl: getGithubUrl(payload.sender.html_url || ""),
        action: payload.action || "",
        state: payload.review ? payload.review.state : '',
        title: payload.issue ? payload.issue.title : payload.pull_request ? payload.pull_request.title : "",
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
    const githubData = parseWebhookPayload(req.body);

    const assigner = getUserBasedOnGithubUsername(githubData.assigner).name;
    const MESSAGE =  `${assigner} ${getMessageBasedOnActionType(githubData.action)} untuk *${githubData.title}* di  *${githubData.repository.name}*`;
    axios.post(`https://api.telegram.org/bot${ACCESS_KEY}/sendMessage`, {
        "chat_id": CHAT_ID ,
        text: MESSAGE,
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
        res.send("success")
      })
      .catch(function (error) {
        console.log(error, process.env);
        res.send(JSON.stringify({ success: false }));
      });
}