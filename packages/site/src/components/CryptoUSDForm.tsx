import React, { MouseEventHandler } from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import Icon from '@mdi/react';
import { mdiBitcoin, mdiEthereum } from '@mdi/js';

import { addNewTokenAlert} from '../utils';

const CryptoUSDForm = (props) => {
  const [crypto, setCrypto] = React.useState<string>('');
  const [target, setTarget] = React.useState<boolean>(true);

  const USDInputRef = React.useRef<HTMLInputElement>(null);
  const PercInputRef = React.useRef<HTMLInputElement>(null);
  const SelectInputRef = React.useRef<HTMLSelectElement>(null);

  const clearForm = () => {
    USDInputRef.current.value = null;
    PercInputRef.current.value = null;
    SelectInputRef.current.value = null;
    setCrypto("");
    setTarget(true);
  }
  const toggleHandler = (e: any) => {
    if (e.target.value === 'Target') {
      setTarget(true);
    } else {
      setTarget(false);
    }
  };

  const addAlertHandler: MouseEventHandler = async () => {

    const getTokenName = (coin : string) => {
      switch(coin) {
        case "BTC":
          return "bitcoin"
        case "ETH":
          return "ethereum"
      }
    }
  

    const tokenAlert = {
      tokenName : getTokenName(crypto),
      isPercent : !target,
      value : (!target ? PercInputRef.current?.value : USDInputRef.current?.value),
      lookingFor : (SelectInputRef.current?.value)
    }

    try {
        await addNewTokenAlert(tokenAlert);
        // clearForm();
    } catch(err) {
      console.log(err);
    }
    console.log(tokenAlert);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
      }}
    >
      <Box
        sx={{
          margin: '2rem',
        }}
      >
        <Typography variant="h4">Add Alert</Typography>
      </Box>
      <FormControl>
        <InputLabel id="select-label">
          Select Target USD or Percentage Change
        </InputLabel>
        <Select
          label="Select Target USD or Percentage Change"
          labelId="select-label"
          style={{ width: '60rem' }}
          onChange={toggleHandler}
          value={target ? 'Target' : 'Percentage'}
        >
          <MenuItem value="Target">Target USD</MenuItem>
          <MenuItem value="Percentage">Percentage Change</MenuItem>
        </Select>
      </FormControl>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FormControl>
          <InputLabel id="crypto-select">Crypto</InputLabel>
          <Select
            labelId="crypto-select"
            label="Crypto"
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
            style={{ width: '10rem' }}
          >
            <MenuItem value="BTC">
              <Icon path={mdiBitcoin} size={1} /> BTC
            </MenuItem>
            <MenuItem value="ETH">
              <Icon path={mdiEthereum} size={1} /> ETH
            </MenuItem>
            <MenuItem value="FIL">FIL</MenuItem>
          </Select>
        </FormControl>
        {target ? (
          <FormControl>
            <InputLabel htmlFor="usd-select">USD</InputLabel>
            <OutlinedInput
              inputRef={USDInputRef}
              label="USD"
              id="usd-select"
              type="number"
              style={{ width: '30rem' }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl>
        ) : (
          <FormControl>
            <InputLabel htmlFor="usd-select">Percentage Change</InputLabel>
            <OutlinedInput
              inputRef={PercInputRef}
              label="Percentage Change"
              id="usd-select"
              type="number"
              style={{ width: '30rem' }}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
          </FormControl>
        )}
        <FormControl>
          <InputLabel id="select-label">Select</InputLabel>
          <Select
            label="select"
            labelId="select-label"
            style={{ width: '17rem' }}
            inputRef={SelectInputRef}
          >
            <MenuItem value="Falls">Falls Below</MenuItem>
            <MenuItem value="Rises">Rises Above</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button variant="contained" onClick={addAlertHandler}>
        Add Alert
      </Button>
    </Box>
  );
};

export default CryptoUSDForm;
