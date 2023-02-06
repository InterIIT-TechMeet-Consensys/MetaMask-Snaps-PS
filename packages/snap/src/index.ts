import { OnRpcRequestHandler } from '@metamask/snap-types';
import { OnCronjobHandler } from '@metamask/snap-types';
import { OnTransactionHandler } from "@metamask/snap-types";

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */

export const getCoinPrices = async(coins: string[]) => {
  const API_URL = "https://api.coingecko.com/api/v3/coins/";
  const responseArray = await Promise.all(
    coins.map(async (coin) => {
      const response = await fetch(`${API_URL}${coin}`);
      const data = await response.json();
      return {
        name: data.name.toLowerCase(),
        price: data.market_data.current_price.usd,
      };
    })
  ).then(data => {return data});
  console.log(responseArray);
  return responseArray;
}


const getNotifications = async(account) => {
  console.log("sending notifications");
  const response = await fetch(`http://127.0.0.1:9000/receiveNotifications/${account}`);
  const jsonResponse = await response.json();

  const fetchedNotifications = jsonResponse.notifications;
  const stateData = await wallet.request({
    method: 'snap_manageState',
    params: ['get']
  });
  let oldNotifs = [];
  if(stateData) {
    oldNotifs = stateData?.web2Notifications;
  }
  let hasNew = false;  

  const stringifiedOldNotifs = oldNotifs.map(notif => JSON.stringify(notif));
  fetchedNotifications.forEach(notif => {
    if(!stringifiedOldNotifs.includes(JSON.stringify(notif))) {
      oldNotifs.unshift(notif);
      hasNew = true;
    }
  })
  await wallet.request({
    method: 'snap_manageState',
    params: ['update', {...stateData, web2Notifications:oldNotifs}]
  });
  return hasNew;
}

const notifyUser = async() => {
  return await wallet.request({
    method: 'snap_notify',
    params: [
      {
        type: 'inApp',
        message: `You have new pay requests`,
      },
    ],
  });
}


const deleteWatchListItem = async(index : Number) => {

  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get']
  });

  let watchList = state?.watchList;
  watchList.splice(index, 1);
  return await wallet.request({
        method: 'snap_manageState',
        params: ['update', {...state, watchList : [...watchList]}]
  });
}
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {

  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              'But you can edit the snap source code to make it do something, if you want to!',
          },
        ],
      });

    case "logState":
      return await wallet.request({
        method: 'snap_manageState',
        params: ['get']
      });
    

    
    case "initiateState":
      return await wallet.request({
        method: 'snap_manageState',
        params: ['update', {web2Notifications: [], permissions: {notificationsOptIn : false}, finishedPayments : [], blockedAddresses : [], watchList : []}]
      });

    case "initiateAccountDetails":
      const account = request.params.account;
      // const accounts = parameters.accounts
      
      return await wallet.request({
        method: 'snap_manageState',
        params: ['update', {...state, account : account}]
      });

    case "getRequests":
      const requests = await wallet.request({
        method: 'snap_manageState',
        params: ['get']
      });
      if(requests) {
        return requests.web2Notifications;
      } else {
        return [];
      }
    case "notificationsOptIn":
      return await wallet.request({
        method: 'snap_manageState',
        params: ['update', {...state, permissions : {...state?.permissions, notificationsOptIn : true}}]
      });
    
    case "updateFinishedPayments":
      return await wallet.request({
        method: 'snap_manageState',
        params: ['update', {...state, finishedPayments : [...state?.finishedPayments, request.params.sid]}]
      });

    case "addBlockAddress":
      const {walletAddress, name, description} = request.params.details;
      return await wallet.request({
        method: 'snap_manageState',
        params: ['update', {...state, blockedAddresses : [...state.blockedAddresses, {
          walletAddress,
          name,
          description
        }]}]
      });
    
    case "getBlockedAddresses":
      return state?.blockedAddresses;
    
    case "deleteBlockedAddress":
      let addresses = state?.blockedAddresses;
      addresses.splice(request.params?.id, 1);
      return await wallet.request({
        method: 'snap_manageState',
        params: ['update', {...state, blockedAddresses : [...addresses]}]
      });

    case "handleNotificationsOptIn" :
      return wallet.request({
        method: "snap_confirm",
        params: [
          {
            prompt: "Opt-in to receive notifications",
            description: `You are choosing to receive notifications`,
            textAreaContent: `Please click on Agree in order to fetch notifications for the pay requests you receive`
          }
        ]
      });

    case "addNewTokenAlert":
      console.log(request.params?.tokenAlert);
      const tokenName = request.params?.tokenAlert.tokenName;
      const isPercent = request.params?.tokenAlert.isPercent;
      const value = parseInt(request.params?.tokenAlert.value);
      const lookingFor = (request.params?.tokenAlert.lookingFor === "Rises" ? 1 : -1);
      // const price = (await getCoinPrices([tokenName]));
      
      return getCoinPrices([tokenName]).then(async priceDetails => {
        const priceAtTimeOfAddition = priceDetails[0].price;
        let targetPrice = value;
        if(isPercent) {
          if(lookingFor == 1) {
            targetPrice = priceAtTimeOfAddition * (1 + (value/100))
          } else if (lookingFor == -1) {
            targetPrice = priceAtTimeOfAddition * (1 - (value/100))
          }
        }
        return await wallet.request({
        method: 'snap_manageState',
        params: ['update', {...state, watchList : [...state?.watchList, {
          tokenName,
          isPercent,
          value,
          lookingFor,
          priceAtTimeOfAddition,
          targetPrice
        }]}]
      });
      }).catch(err => console.log(err));
      

    case "getWatchList":
      return state?.watchList;
    default:
      throw new Error('Method not found.');
  }
};

const notifyAlerts = async(messages : string[]) => {

      return await wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'inApp',
            message: `${messages[0].substring(0, 49)}`,
          },
        ],
      })
}

const getPrice = (priceArray, tokenName : string) => {
  const filteredPrice = priceArray.filter(item => item.name === tokenName);
  return filteredPrice[0].price;
}

let shortForms = new Map();
shortForms.set("bitcoin", "BTC");
shortForms.set("ethereum", "ETC");

const getShortForm = (coinName : string) => {
  return shortForms.get(coinName);
}
export const onCronjob: OnCronjobHandler = async ({ request }) => {
  
  switch (request.method) {
    case "fetchWeb2PayRequests":
      let state1 = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
      return getNotifications(state1.account).then(hasNew=> {
        if(hasNew) {
          return notifyUser().then(res=>console.log(res)).catch(err => console.log(err))
        }
      }).catch(err => console.log(err));
    
    case "checkCoinAlert":
      let state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
      let needToBeAlerted : string[] = [];
      let satisfyingIndices = [];
      const watchList = state?.watchList;
        let coins = watchList.map(item => item.tokenName);
        coins = coins.filter((coin : string, idx : Number) => (coins.indexOf(coin) === idx));
        let priceDetails = [];

        let temp = "";
      try {
        priceDetails = await getCoinPrices(coins);
      } catch(err) {
        console.log(err);
      }

      watchList.forEach((item,idx) => {
        const price = getPrice(priceDetails, item.tokenName);
        let message = "";
        if(item.lookingFor == 1 && price >= item.targetPrice) {
          message = `${getShortForm(item.tokenName)} - ${price} USD, crossed your target of ${item.targetPrice}`;
        } else if(item.lookingFor == -1 && price <= item.targetPrice) {
          message = `${getShortForm(item.tokenName)} - ${price} USD, below your target of ${item.targetPrice}`;
        }

        if(message != "") {
          needToBeAlerted.push(message);
          satisfyingIndices.push(idx);
        }
      })
      if(needToBeAlerted.length == 0) {
        return;
      }
      return notifyAlerts(needToBeAlerted).then(async res => {
        const index = satisfyingIndices[0];
        // return await deleteWatchListItem(index);
        let watchList = state?.watchList;
        watchList.splice(index, 1);
        return await wallet.request({
              method: 'snap_manageState',
              params: ['update', {...state, watchList : [...watchList]}]
        });
      }).catch(err => console.log(err));
  }
};

const getInsights = async(transaction: Record<string, unknown>) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });
  const blockedAddressesDetails = state?.blockedAddresses;
  const blocked = blockedAddressesDetails.map(addr => addr.walletAddress.toLowerCase());

  let message;
  
  if(blocked.includes(transaction.to)) {
    const data = blockedAddressesDetails[blocked.indexOf(transaction.to)];
    message = {
      message : "This address is in your block list",
      accountAddress : data.walletAddress,
      name : data.name,
      description : data.description
    }
  } else {
    message = {
      message : "You haven't blocked this account"
    }
  }
  const returnObject: Record<string, unknown> = message;

  console.log(transaction);
  return returnObject;
}

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  return {
    insights: await getInsights(transaction),
  };
};
