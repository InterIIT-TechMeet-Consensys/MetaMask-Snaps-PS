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
        name: data.name,
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
      console.log(request.params.tokenAlert);
      const tokenName = request.params?.tokenAlert.tokenName;
      const isPercent = request.params?.tokenAlert.isPercent;
      const value = request.params?.tokenAlert.value;
      const lookingFor = (request.params?.tokenAlert.lookingFor === "Rises" ? 1 : -1);
      return await wallet.request({
        method: 'snap_manageState',
        params: ['update', {...state, watchList : [...state?.watchList, {
          tokenName,
          isPercent,
          value,
          lookingFor
        }]}]
      });

    case "getWatchList":
      return state.watchList;
    default:
      throw new Error('Method not found.');
  }
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });
  switch (request.method) {
    case "fetchWeb2PayRequests":
      return getNotifications(state.account).then(hasNew=> {
        if(hasNew) {
          return notifyUser().then(res=>console.log(res)).catch(err => console.log(err))
        }
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
