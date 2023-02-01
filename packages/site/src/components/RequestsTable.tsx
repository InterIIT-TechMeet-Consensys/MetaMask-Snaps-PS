import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import { Typography } from '@mui/material';

const PayButton = (params: GridRenderCellParams<string>) => {
  const show = params.row.status === 'Pending';

  if (!show) {
    return <Icon path={mdiCheck} size={1} color="green" />;
  }

  const handleClick = () => {
    console.log('Pay');
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
    field: 'sender',
    headerName: 'Requested From',
    width: 250,
  },
  {
    field: 'receiver',
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
    field: 'status',
    headerName: 'Status',
    width: 100,
  },
  {
    field: 'action',
    headerName: 'Pay',
    width: 100,
    renderCell: PayButton,
  },
];

const rows = [
  {
    id: 1,
    sender: '0x00000000219ab540356cbb839cbe05303d7705fa',
    receiver: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    amount: 100,
    status: 'Pending',
  },
  {
    id: 2,
    sender: '0x00000000219ab540356cbb839cbe05303d7705fa',
    receiver: '0x00000000219ab540356cbb839cbe05303d770dc',
    amount: 100,
    status: 'Done',
  },
];
const RequestsTable = () => {
  return (
    <Box
      sx={{
        width: 880,
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
