import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import { Typography } from '@mui/material';
import Web3 from 'web3';

import { getRequests } from './../utils';

const RequestsTable = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getRequests()
      .then(async (fetchedRequests) => {
        // const logStateData = await logState();
        // const finishedPayments = logStateData.finishedPayments;
        console.log(fetchedRequests);
        const processedRequests = fetchedRequests.map((request, id) => {
          const requestedBy = request.title;
          const [yourAccount, amount, message] = request.message.split('||');
          // const status = (finishedPayments.includes(request.sid) ? "Done" : "Pending");
          return { id: id + 1, requestedBy, yourAccount, amount, message };
        });
        setRows(processedRequests);
      })
      .catch((err) => console.log(err));
  }, []);

  const PayButton = (params: GridRenderCellParams<string>) => {
    const handleClick = async () => {
      const id = params.id;
      console.log(id);
      const details = rows[id - 1];
      const value = Web3.utils.toHex(Web3.utils.toWei(details.amount));
      // const value2=Web3.utils.toHex(value);
      const transactionParameters = {
        nonce: '0x00',
        to: details.requestedBy,
        from: details.yourAccount,
        value: value,
      };
      try {
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
        console.log(txHash);
      } catch (err) {
        if (err.code === 4100) {
          alert(
            'user has requested amount from other account. Please switch the account',
          );
        } else {
          console.log(err);
        }
      }
    };

    return (
      <Button variant="contained" color="primary" onClick={handleClick}>
        Pay
      </Button>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Sl. No.',
      width: 80,
    },
    {
      field: 'yourAccount',
      headerName: 'Requested From',
      width: 250,
    },
    {
      field: 'requestedBy',
      headerName: 'Requested By',
      width: 250,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 80,
      valueFormatter: (params) => `${params.value} ETH`,
    },
    {
      field: 'message',
      headerName: 'Message',
      width: 200,
    },
    {
      field: 'action',
      headerName: 'Pay',
      width: 100,
      renderCell: PayButton,
    },
  ];

  return (
    <Box
      sx={{
        width: 970,
        height: 400,
      }}
    >
      <Box
        sx={{
          margin: '1rem',
        }}
      >
        <Typography variant="h4">Transactions</Typography>
      </Box>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </Box>
  );
};

export default RequestsTable;
