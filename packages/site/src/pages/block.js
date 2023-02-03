import React, { useContext, useEffect, useState, useRef } from 'react';
import { MetamaskActions, MetaMaskContext } from '../hooks';

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

import Layout from '../components/UI/Layout';

import BlockAddressForm from '../components/BlockAddressForm';
import BlockAddressTable from "../components/BlockAddressTable";

import {getBlockedAddresses, deleteBlockedAddress} from "./../utils";

const Block = () => {
  const [rows, setRows] = useState([]);
  const fetchBlockedAddresses = () => {
    getBlockedAddresses().then(async addresses => {
        console.log(addresses);
        const processedBlocked = addresses.map((addr,id) =>  {
          return {id : id+1, address : addr.walletAddress, name : addr.name, description : addr.description};
        })
        console.log(processedBlocked);
        setRows(processedBlocked);
      }).catch(err => console.log(err));
  }
    return (
        <>
      <Layout>

        <BlockAddressForm rows = {rows} fetchBlockedAddresses = {fetchBlockedAddresses}/>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            margin: '10rem',
          }}
        >
          <BlockAddressTable rows = {rows} setRows = {setRows} fetchBlockedAddresses = {fetchBlockedAddresses}/>
        </Box>
      </Layout>
    </>
    )
}

export default Block;