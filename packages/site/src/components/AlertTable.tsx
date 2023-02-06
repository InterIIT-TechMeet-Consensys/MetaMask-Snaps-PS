import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

const DeleteButton = () => {
  const handleDelete = () => {
    console.log('Delete');
  };

  return (
    <Button onClick={handleDelete} variant="contained" color="error">
      Delete
    </Button>
  );
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Sl. No.', width: 70 },
  { field: 'crypto', headerName: 'Crypto', width: 100 },
  { field: 'choice', headerName: 'Alert Choice', width: 150 },
  { field: 'choiceValue', headerName: 'Value', width: 100 },
  { field: 'alertType', headerName: 'Alert Type', width: 130 },
  {
    field: 'action',
    headerName: 'Delete',
    width: 100,
    renderCell: DeleteButton,
  },
];

const AlertTable = (props: any) => {
  return (
    <Box
      sx={{
        width: 680,
        height: 400,
      }}
    >
      <Box
        sx={{
          margin: '1rem',
        }}
      >
        <Typography variant="h4">Your Alerts</Typography>
      </Box>
      <DataGrid rows={props.rows} columns={columns} pageSize={5} />
    </Box>
  );
};

export default AlertTable;
