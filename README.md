
# METAMASK SNAPS - Anything Snaps 🦊

## Overview
A Snap is a program run in an isolated environment that customizes and extends the wallet experience. We've built a solution that leverages the functionality provided by the Metamask snaps and makes Metamask more user-friendly by offering features like pay requests, address blocking, and price alerts.

## Problem Statement
Anything Snaps — An open-ended call for the development of Snaps to customize/extend the MetaMask wallet experience.

## Table of Contents

1. [Installation](#installation)
2. [How To Run](#how-to-run)
3. [Features](#features)

# Installation

This repository contains the code for our snap. Follow these intructions

1. Clone the repository  

    ```bash
    git clone https://github.com/InterIIT-TechMeet-Consensys/MetaMask-Snaps-PS.git
    ```

2. Run the following command   

    ```bash
    cd MetaMask-Snaps-PS
    yarn
    ```

3. You might want to run the following command to remove some files that will not work properly outside the MetaMask GitHub organization

    ```bash
    ./scripts/cleanup.sh
    ```

# How To Run

Make sure that you have all the [Prerquisites](https://docs.metamask.io/guide/snaps.html#prerequisites) for running a snap. Run the below command in the root directory of the project (MetaMask-Snaps-PS).

```bash
yarn start
```
Note: 
1. Keep ports 8000, 8080, 9000 free. The application makes use of these port numbers.
2. Before running make sure you have a `.env` file in the `./utilities/notifications-server`
3. The `.env` file should have following variables
	- PK : The private key with which you have created the push account
	- app_name : Your push account app name
	- channel_publicKey : The public key of your metamask account
4. Steps to setup push account:
	- Go to [Push dashboard](https://staging.push.org/#/dashboard)
	- Connect with your wallet
	- Click on the Create Channel button in the left pane and follow these steps [creating push channel](https://docs.push.org/developers/developer-guides/create-your-notif-channel)

# Features
Our solution extends the functionality of Metamask by offering three new features.
1. Pay Requests
2. Block Accounts
3. Price Alerts

## Pay Requests
### What is this?
The Request Ether feature allows you to send a request for a specific amount of Ethereum to any address. Simply set the amount, add a message and send the request. It's that easy!

### How is this useful?
Imagine browsing through Web3 and suddenly running out of Ethereum or developing a Dapp and not having sufficient ether to test. You will ask your friends or colleagues to lend you some ether, right? Wouldn't it be tedious to message him your public Id and request him to send you some ether? Therefore, we have integrated a feature to request ether quickly. Upon receiving a pay request, the sender gets notified. They can then send the ether with a single button click.

### Methodology
#### Sending a Pay Request
1. User enters the public Id of the person that he wants to request from along with the amount of ether and a message in the Request Form.
2. Upon submitting the form, these details are sent to a web server.
3. The web server formats the details properly and pushes the notifications into the receiver's [PUSH (previously EPNS)](https://push.org/) account.

#### Receiving and responding to the pay request
1. To receive notifications for pay requests, the user must Opt-in to receive the notifications by clicking on the Opt-in Button. This displays a confirm message using the **snap_confirm** JSON-RPC method of snaps. They can either accept or reject to receive the notifications.
2. A cron job runs every minute and checks if the user has received any new pay requests. All the computing is done entirely in the snap environment and makes use of the **endowment:cronjob** to run cron job and **endowment:network-access** to communicate with the web server.
3. The fetched Pay requests are stored locally in the snap using the **snap_manageState** JSON-RPC method. These are then retrieved whenever necessary.
4. Upon receiving a new pay request, the user is notified with an In-App notification using the **snap_notify** JSON-RPC method. The user receives notifications directly into his wallet.
5. The pay requests are also displayed in the pay requests table in the UI. Users can finish the payment by simply clicking on the Pay button.

## Block Accounts

### What is this?
The Block Addresses feature provides you with a safe and secure way to block any unwanted addresses. Keep your Ethereum transactions protected by blocking any addresses that you suspect to be a scam or a fraud.

### How is this useful?
There are several cases where people were scammed while making transactions on Dapps or smart contracts. Also, if we are aware that someone’s account is compromised, we must ensure that we do not make any transactions with them. It would be helpful if we could list the accounts we feel are harmful, so we can be informed when interacting with such accounts or smart contracts. Therefore, we have implemented a feature where users can maintain their block list. The users will be informed when they are interacting with those accounts at a later point.


### Methodology
#### Adding addresses to block list
1. Users need to enter the account address that he wants to add along with a name, and a description.
2. Upon submitting the form, the data is stored locally in the snap using the **snap_manageState** JSON-RPC method and retrieved whenever necessary.
3. Users can also remove an address from their block list

#### Making transactions with an account
1. While making transactions, snap checks if the account is present in the user's block list.
2. This is acheived by using the **onTransaction** export handler provided by requesting **endowment:transaction-insight** permission
3. Snap retrives the block list data from **snap state** and checks if the address is in the block list
4. If the address is in the block list, then it informs the user that this address is in his block list and also displays the name, and description that was given to this address.
5. This data is displayed in the transaction insights tab while making the transaction
6. The user can see the information and reject the transaction.

## Price Alerts
### What is this?
The Watchlist Alert feature lets you keep track of the crypto coins that matter to you. Get notifications for any changes in the balance or incoming transactions of the addresses you added to your watchlist.
User's can add an alert so that they are notified whenever a coin's price satisfies their required criteria. User must enter the following details:
1. The coin name (Ethereum, Bitcoin etc)
2. To notify if the coin's price *rises above* or *falls below* the target price
3. The target price. It can be entered as the coin's target price in USD or the percentage change of the coin with respect to current price.
### How is this useful?
Crypto currencies are very volatile. So every minute matters if you want to purchase or sell a coin. It is highly useful if you get price alerts directly in your wallet. Therefore, we offer a solution where the user can add price alerts and are notified directly in their wallet.

### Methodology
#### Adding a price alert
1. Users enter the coin name, target price (or percentage) along with the type of variation (rises above or falls below) in the form
2. Upon submitting the form, the alert gets stored in the **snap state** under *watchlist* for later retrieval
3. The snap uses the **cron job** feature and sends a request to the api and fetches the price of desired coins.
4. It then compares the prices with the *watchlist* and checks if any conditions are satisfied.
5. If the prices match any of the *watchlist* item, then the user is notified using the **snap_notify** JSON-RPC method
