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

const RequestForm = () => {
  const walletAddress = useRef<HTMLInputElement>(null);
  const amount = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const submitHandler = (event: MouseEvent<HTMLButtonElement>) => {
    const enteredWalletAddress = walletAddress.current?.value;
    const enteredAmount = amount.current?.value;
    const enteredDescription = description.current?.value;
    console.log(enteredWalletAddress, enteredAmount, enteredDescription);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
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
      </Box>
    </Box>
  );
};

export default RequestForm;
