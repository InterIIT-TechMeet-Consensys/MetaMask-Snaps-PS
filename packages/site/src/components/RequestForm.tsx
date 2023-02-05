import React, { MouseEvent, useRef } from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';

import Web3 from 'web3';

const RequestForm = () => {
  const walletAddress = useRef<HTMLInputElement>(null);
  const amount = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);

  const clearForm = () => {
    walletAddress.current.value = '';
    amount.current.value = '';
    description.current.value = '';
  };
  const submitHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    const enteredWalletAddress = walletAddress.current?.value;
    const enteredAmount = amount.current?.value;
    const enteredDescription = description.current?.value;
    console.log(enteredWalletAddress, enteredAmount, enteredDescription);

    if (
      enteredAmount === '' ||
      enteredWalletAddress === '' ||
      enteredDescription === ''
    ) {
      alert('Enter all values!');
      return;
    }
    const walletAddresses = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    console.log(walletAddresses);
    const userWalletAddress = walletAddresses[0];
    console.log(userWalletAddress);
    const url = 'http://127.0.0.1:9000/sendNotification';
    const data = {
      to: enteredWalletAddress,
      amount: enteredAmount,
      message: enteredDescription,
      from: userWalletAddress,
    };
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    const jsonResponse = await response.json();
    // console.log(await response.json());
    if (jsonResponse.message === 'notification sent') {
      alert('Notification sent successfully!');
      clearForm();
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1rem',
      }}
    >
      <Box
        sx={{
          margin: '1rem',
        }}
      >
        <Typography variant="h4">Request Ether</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '1rem',
        }}
      >
        <TextField
          inputRef={walletAddress}
          style={{
            width: '45rem',
            marginRight: '1rem',
          }}
          id="outlined-basic"
          label="Wallet Address"
          variant="outlined"
        />
        <FormControl>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            inputRef={amount}
            style={{
              width: '14rem',
              fontSize: '1.5rem',
            }}
            type="number"
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">Ξ</InputAdornment>}
            label="Amount"
          />
        </FormControl>
      </Box>
      <TextField
        inputRef={description}
        id="outlined-multiline-static"
        label="Description"
        multiline
        rows={12}
        variant="outlined"
        style={{
          width: '60rem',
        }}
      />
      <Box
        sx={{
          width: '60rem',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          variant="outlined"
          style={{
            marginTop: '1rem',
            width: '15rem',
          }}
          onClick={clearForm}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          style={{ marginTop: '1rem', width: '15rem' }}
          onClick={submitHandler}
        >
          Request
        </Button>

        {/* <Button
          variant="contained"
          style={{ marginTop: '1rem', width: '15rem' }}
          onClick={async (e) => {
            e.preventDefault();
            const enteredWalletAddress = walletAddress.current?.value;
            const enteredAmount = amount.current?.value;
            const enteredDescription = description.current?.value;
            const details = {
              to : enteredWalletAddress,
              value : enteredAmount
            }
            await PayClicked(details)
          }}
        >
          Pay
        </Button> */}
      </Box>
    </Box>
  );
};

export default RequestForm;
