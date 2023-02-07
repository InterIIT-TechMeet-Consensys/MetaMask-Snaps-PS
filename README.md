
# METAMASK SNAPS - Anything Snaps 🦊

## Overview
A Snap is a program run in an isolated environment that customizes and extends the wallet experience. We've built a solution that leverages the functionality provided by the Metamask snaps and makes Metamask more user-friendly by offering features like pay requests, address blocking, and price alerts.

## Problem Statement
Anything Snaps — An open-ended call for the development of Snaps to customize/extend the MetaMask wallet experience.

## Table of Contents

1. [Installation](#installation)
2. [How To Run](#how-to-run)
3. [Features](#features)
4. [Methodology](#methodology)
5. [File Structure](#file-structure)
6. [How to use the UI](#how-to-use-the-ui)

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
Note: Keep ports 8000, 8080, 9000 free. The application makes use of these port numbers.

# Features
Our solution extends the functionality of Metamask by offering three new features.
1. Pay Requests
2. Block Accounts
3. Price Alerts

## Pay Requests
### What is this?
The pay request feature allows you to request ethereum from other users in a simple and easy manner.

### How is this useful?
Imagine browsing through Web3 and suddenly running out of Ethereum or developing a Dapp and not having sufficient ether to test. You will ask your friends or colleagues to lend you some ether, right? Wouldn't it be tedious to message him your public Id and request him to send you some ether? Therefore, we have integrated a feature to request ether quickly. Upon receiving a pay request, the sender gets notified. They can then send the ether with a single button click.

### GIF speaks better than words
#### Sending a Pay request
///GIF for sending a pay request

#### Receiving and responding for a pay request
///FIF for receivig and responding for a pay request

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
Users can add certain accounts to their block-list. They will be informed when they are making transactions to any accounts that are in their block-list.

### How is this useful?
There are several cases where people were scammed while making transactions on Dapps or smart contracts. Also, if we are aware that someone’s account is compromised, we must ensure that we do not make any transactions with them. It would be helpful if we could list the accounts we feel are harmful, so we can be informed when interacting with such accounts or smart contracts. Therefore, we have implemented a feature where users can maintain their block list. The users will be informed when they are interacting with those accounts at a later point.


### GIF speaks better than words
#### Adding an address into blocklist
///GIF for Adding an address into blocklist

#### Making transaction with an account in the blocklist
///GIF for Making transaction with an account in the blocklist

#### Making transaction with an account not in the blocklist
///GIF for Making transaction with an account not in the blocklist

### Methodology
#### Adding addresses to block list
1. Users need to enter the account address that he wants to add along with a name, and a description.
2. Upon submitting the form, the data is stored locally in the snap using the **snap_manageState** JSON-RPC method and retrieved whenever necessary.
3. Users can also remove an address from their block list

#### Making transactions with an account
1. While making transactions, snap checks if the account is present in the user's block list.
2. This is acheived by using the **onTransaction** export handler provided by requesting **endowment:transaction-insight** permission
3. Snap retrives the block list data and checks if the address is in the block list
4. If the address is in the block list, then it informs the user that this address is in his block list and also displays the name, and description that was given to this address.
5. This data is displayed in the transaction insights tab while making the transaction
6. The user can see the information and reject the transaction.

## Price Alerts

### Preprocessing for Super Resolution

We have extensively tested super resolution algorithms and realised that the extracted images usually contained blurred photos which rendered the super resolution algorithms useless and gave sub-par performance on age and gender tasks. Thus we added a new preprocessing block of [Deblurring](https://github.com/swz30/MPRNet)

We have provided comparision for Wall Time, PSNR and SSIM accross multiple Super Resolutiom methods
<div align="center">

| MODEL           | Custom Metric | Wall Time    | PSNR        |
| --------------- | ------------- | ------------ | ----------- |
|                 |               |              |             |
| WDSR            | 345.5003798   | 15.85164261  | 30.36618739 |
| EDSR            | 347.6678516   | 2.112349987  | 30.34467902 |
| SRGAN           | 354.7159776   | 9.196819544  | 29.42405326 |
| FSRCNN          | 430.6859193   | 0.3795514107 | 23.69700551 |
| RDN             | 307.7455076   | 0.3795514107 | 24.58058639 |
| SRDenseNet      | 408.9996247   | 17.12142944  | 24.05288471 |
| ESPCN           | 362.0292181   | 0.4130887985 | 25.14499845 |
| FSRCNN\_trained | 575.1895184   | 0.8021452427 | 21.94459659 |

</div>
From the above metrics in order to maintain a trade off between wall time and PSNR value we have chosen EDSR as our main backbone of super resolution architecture.

### Weighted Frequency Aware Super Resolution Algorithm

The entire super resolution pipeline can be shown as <p align="center">![](imgs/fftloss.png)</p>

We have addressed the main pain point of the Problem statement.

- Just to give an overview, the existing super resolutions algorithms provided a high Peak Signal-to-Noise Ratio(PSNR) value but failed to preserve high frequency details of the image.
- Also existing super resolution algorithms are usually modifications of SRGANs which require expensive computation to train and have loss convergence issues.

```Thus we introduced a novel technique where we introduce a new loss in addition to exisitng reconstruction loss without introducing any new network parameters. Thus we follow the same training procedure but optimize the parameters with respect to the new loss which actually helps in preserving the high frequency components.```

The loss is formulated as <p align="center">![](imgs/loss.png)</p>

## Age and Gender Prediction

We have also done extensive experimentation on age and gender prediction. First we did a sanity check whether super resolution was useful for our task hence we ran benchmarks tests with and without super resolution whilst considering VGGFace as the classification model. The results are shown below

<div align="center">

| Image size | No SR | BSRGAN | EDSR  | SwinIR |
|------------|-------|--------|-------|--------|
| 7x7        | 0.287 |  0.241 | 0.314 |  0.252 |
| 14X14      | 0.352 |  0.313 | 0.386 |  0.313 |
| 28x28      | 0.488 |  0.499 | 0.523 |  0.495 |
| 56x56      | 0.513 | 0.5342 | 0.551 |  0.533 |

</div>

This shows us a general increase in accuracy for age prediction in the case of EDSR accross all the image sizes. We have taken all possible image sizes as Yolov5-face returns faces with different dimensions from the range of 7x7 to 96x96.

### Gender

- For the gender classification task since we only have 2 labels using a deeper and complex model would overfit to the data hence we train some layers of the original VGGFace model which reported a test accuracy of 94% and we are using that in our final pipeline.  

<div align="center">

|   MODEL  | DATASET | ACCURACY | PRECISION |  RECALL  |    F1   |
|:--------:|:-------:|:--------:|:---------:|:--------:|:-------:|
|  Facelib | Adience |  0.73386 |  0.73404  | 0.735218 | 0.73357 |
|          |   UTK   |  0.78948 |  0.79971  |  0.79349 | 0.78889 |
| VGG Face | Adience |  0.7492  |   0.7632  |  0.7541  | 0.74424 |
|          |   UTK   |  0.9139  |   0.9245  |  0.9219  |  0.9028 |
|  Resnet  | Adience |  0.4821  |   0.4931  |  0.4956  |  0.4732 |
|          |   UTK   |  0.9369  |   0.9378  |  0.9413  |  0.9217 |
|    MLP   | Adience |  0.8543  |   0.8612  |  0.8711  |  0.8422 |
|          |   UTK   |  0.9257  |   0.9033  |  0.9341  |  0.9160 |
</div>

### Age

- For the age classification task, we faced quite a number of challenges such as
  1. Non-uniformity in dataset labels
  2. Subpar Cross-dataset performance in existing state-of-the-art models

- To address these problems, we improved upon exisitng models in these ways:

    1. We first performed the gender classification and used that gender embedding as a prior to the age classification which helped us improve our results.  
        ![](imgs/age_gender.png)
    2. In order to generalize our datasets, we performed a model ensemble across multiple datasets and this made our model much more robust.
    3. We have use a new ensembling technique where more weight is given to age clusters grouped together by inversely weighting difference between predicted ages.

- For our age classification tasks, after extensive experimentation we have use the following models
    1. [VisualizingNDF](https://github.com/Nicholasli1995/VisualizingNDF) trained on CACD
    2. [VisualizingNDF](https://github.com/Nicholasli1995/VisualizingNDF) trained on CACD and finetuned on WIKI and UTKface
    3. [VisualizingNDF](https://github.com/Nicholasli1995/VisualizingNDF) trained on CACD and finetuned on WIKI
    4. [VGGFace](https://github.com/rcmalli/keras-vggface) trained on IMDB

<div align="center">

| Model                   | MSE       | RMSE     | R-square  | MAE      |
| ----------------------- | --------- | -------- | --------- | -------- |
| Deep Face (Retina Face) | 332.0787  | 18.223   | \-7.78913 | 14.3249  |
| Deep Face (Opencv)      | 332.8555  | 18.24432 | \-5.4156  | 14.3404  |
| Deep Face (SSD)         | 326.2908  | 18.06352 | \-6.4814  | 14.17737 |
| InsightFace             | 424.6219  | 20.60635 | \-0.46678 | 15.8082  |
| FaceLib                 | 211.54167 | 14.5444  | 0.286898  | 10.09992 |
</div>

# File Structure

```bash
├── age_gender_prediction/
    ├── VGGFace
    ├── VisualizingNDF
├── Deblur/
    ├── MPRNet
├── Denoising/
    ├── HINet
    ├── Restormer
├── ObjDet/
├── Super_Resolution/
    ├── bicubic_pytorch
    ├── ESPCN_pytorch
├── imgs/
├── README.md
```

# How to Use the UI

After running the command for streamlit, a new window opens up in the default browser. This code is directly using our codebase as a backend and takes an API call for running the model. Users can choose the type of GAN from the dropdown list and then upload the image from local system. Then the processing happens in the backend and the output image is rendered with the corresponding bounding box with the age and gender information.

For the help of the user, a walkthrough is shown below

![](imgs/user.gif)

The final prediction is shown below on a test image

![](imgs/user.png)
