const app = require("./app");
const PushAPI = require("@pushprotocol/restapi");
const ethers = require("ethers");

require("dotenv").config();

const PORT = 9000;

const PK = process.env.PK;
const Pkey = `0x${PK}`;
const app_name = process.env.app_name;
const channel_publicKey = process.env.channel_publicKey;
const signer = new ethers.Wallet(Pkey);

app.post("/opt-in", async(req, res) => {
    try {
        console.log(req.body.user);
        await PushAPI.channels.subscribe({
            signer: signer,
            channelAddress: `eip155:5:${channel_publicKey}`, // channel address in CAIP
            userAddress: `eip155:5:${req.body.user}`, // user address in CAIP
            onSuccess: () => {
             console.log(`opt in success for - ${req.body.user}`);
             res.status(200).json({
                message : "opt-in successful"
             })
            },
            onError: () => {
              console.error(`opt in error - ${req.body.user}`);
              res.status(400).json({
                message : "opt-in failed"
             })
            },
            env: 'staging'
          })
    } catch(err) {
        console.log(err);
    }
})

app.post("/opt-out", async(req,res) => {
    try {
        await PushAPI.channels.unsubscribe({
            signer: signer,
            channelAddress: `eip155:5:${channel_publicKey}`, // channel address in CAIP
            userAddress: `eip155:5:${req.body.user}`, // user address in CAIP
            onSuccess: () => {
             console.log(`opt out success for - ${req.body.user}`);
             res.status(200).json({
                message : "opt-out successful"
             })
            },
            onError: () => {
              console.error(`opt in error - ${req.body.user}`);
              res.status(400).json({
                message : "opt-out failed"
             })
            },
            env: 'staging'
          })
    } catch(err) {
        console.log(err);
    }
})

app.post("/sendNotification", async (req,res)=> {
    console.log(req.body.to);
    //notification format = from||to
    PushAPI.payloads.sendNotification({
        signer,
        type: 3,
        identityType: 2,
        notification: {
            title : `${req.body.from}`,
            body : `${req.body.to}||${req.body.amount}||${req.body.message}`
        },
        payload: {
            title: `${req.body.from}`,
            body : `${req.body.to}||${req.body.amount}||${req.body.message}`
        },
        recipients : `eip155:5:${req.body.to}`,
        channel : `eip155:5:${channel_publicKey}`,
        env : "staging"
    }).then(response => {
        console.log("response received");
        console.log(response);
        res.status(200).json({
            message: "notification sent"
        })
    }).catch(err => {console.log(err); res.status(400).json({
        message: "error",
        err
    })})
    
})


app.get("/receiveNotifications/:user", async (req,res) => {
    console.log("receiving request for user :" + req.params.user);
    try {
        let notifications = await PushAPI.user.getFeeds({
            user : `eip155:5:${req.params.user}`,
            env : "staging",
            // spam: true
        });

        let spamNotifications = await PushAPI.user.getFeeds({
            user : `eip155:5:${req.params.user}`,
            env : "staging",
            spam: true
        })

        notifications = notifications.concat(spamNotifications);
        notifications = notifications.filter(notification => notification.app === app_name);

        res.status(200).json({
            notifications : notifications
        })
    } catch(err) {
        console.log(err);
        res.status(400).json({
            message: "error occured"
        })
    }
});


app.get("/receiveNotificationIds/:user", async (req,res) => {
    try {
        let notifications = await PushAPI.user.getFeeds({
            user : `eip155:5:${req.params.user}`,
            env : "staging",
            // spam: true
        });
        notifications = notifications.filter(notification => notification.app === app_name);
        console.log(notifications);
        const notificationIds = notifications.map(notif => notif.sid);
        res.status(200).json({
            ids : notificationIds
        })
    } catch(err) {
        console.log(err);
        res.status(400).json({
            message: "error occured"
        })
    }
});

app.listen(PORT, () => {
    console.log(`Listening to PORT - ${PORT}`);
})
