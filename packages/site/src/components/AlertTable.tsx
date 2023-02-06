import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';

import { deleteAlert } from '../utils';

const AlertTable = (props: any) => {

  const DeleteButton = (params: GridRenderCellParams<string>) => {
    const handleDelete = async () => {
      const id = params.id;
      try {
        const deletedIds = await deleteAlert(id-1);
        let newRows = [...props.rows];
        newRows.splice(id-1, 1);
        props.fetchWatchList();
      } catch(err) {
          console.log(err);
      }
    };
  
    return (
      <Button onClick={handleDelete} variant="contained" color="error">
        Delete
      </Button>
    );
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Sl. No.', width: 50 },
    { field: 'crypto', headerName: 'Crypto', width: 100 },
    { field: 'choice', headerName: 'Alert Choice', width: 100 },
    { field: 'priceAtTimeOfAddition', headerName: 'Price when added', width: 100 },
    { field: 'choiceValue', headerName: 'Value', width: 100 },
    { field: 'alertType', headerName: 'Alert Type', width: 130 },
    {
      field: 'action',
      headerName: 'Delete',
      width: 100,
      renderCell: DeleteButton,
    },
  ];

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
