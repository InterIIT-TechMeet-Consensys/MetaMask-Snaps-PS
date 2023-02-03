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

import { blockAddress } from '../utils';

const BlockForm = (props) => {
  const walletAddress = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);

  const clearForm = () => {
      walletAddress.current.value = "";
      name.current.value = "";
      description.current.value = "";
  }

  const submitHandler = async(event: MouseEvent<HTMLButtonElement>) => {
    const enteredWalletAddress = walletAddress.current?.value;
    const enteredName = name.current?.value;
    const enteredDescription = description.current?.value;
    console.log(enteredWalletAddress, enteredName, enteredDescription);
    
    if(enteredName === "" || enteredWalletAddress === "" || enteredDescription === "") {
      alert("Enter all values!");
      return;
    }
    try {
      await blockAddress({walletAddress : enteredWalletAddress, name : enteredName, description : enteredDescription});
      props.fetchBlockedAddresses();
      clearForm();
    } catch(err) {
      console.log(err);
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
        <Typography variant="h4">Block Wallet Address</Typography>
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
            width: '30rem',
            marginRight: '1rem',
          }}
          id="outlined-basic"
          label="Wallet Address"
          variant="outlined"
        />
        <FormControl>
          <InputLabel htmlFor="outlined-adornment-amount">Name</InputLabel>
          <OutlinedInput
            inputRef={name}
            style={{
              width: '29rem',
            }}
            type="t"
            id="outlined-basic"
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
          Block
        </Button>
      </Box>
    </Box>
  );
};

export default BlockForm;
