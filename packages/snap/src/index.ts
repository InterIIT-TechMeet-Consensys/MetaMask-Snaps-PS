import { OnRpcRequestHandler } from '@metamask/snap-types';
import { OnCronjobHandler } from '@metamask/snap-types';

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
        params: ['update', {web2Notifications: [], permissions: {notificationsOptIn : false}, finishedPayments : []}]
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
      })
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
