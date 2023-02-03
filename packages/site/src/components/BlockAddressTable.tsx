import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import { Typography } from '@mui/material';

import {deleteBlockedAddress} from "./../utils";

const RequestsTable = (props) => {
  useEffect(() => {
    props.fetchBlockedAddresses();
  }, [])

  const BlockButton = (params: GridRenderCellParams<string>) => {
    const handleClick = async() => {
      const id = params.id;
      try {
        const unblock = await deleteBlockedAddress(id-1);
        let newRows = [...props.rows];
        newRows.splice(id-1, 1);
        props.fetchBlockedAddresses();
      } catch(err) {
          console.log(err);
      }
    };
  
    return (
      <Button variant="contained" color="primary" onClick={handleClick}>
        UnBlock
      </Button>
    );
  };

  const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Sl. No.',
        width: 40,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 250,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 250,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
    },
    {
      field: 'action',
      headerName: 'Unblock',
      width: 100,
      renderCell: BlockButton,
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
        <Typography variant="h4">Blocked Addresses</Typography>
      </Box>
      <DataGrid rows={props.rows} columns={columns} pageSize={5} />
    </Box>
  );
};

export default RequestsTable;
