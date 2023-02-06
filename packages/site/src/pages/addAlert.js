import Layout from '../components/UI/Layout';
import CryptoUSDForm from '../components/CryptoUSDForm';
import AlertTable from '../components/AlertTable';
import { useState, useEffect } from 'react';
import { addNewTokenAlert, getWatchList } from '../utils';
import Box from '@mui/material/Box';

const AddAlert = () => {
  const [watchList, setWatchList] = useState([]);

  useEffect(() => {
    getWatchList()
      .then((res) => setWatchList(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout>
      <CryptoUSDForm setWatchList={setWatchList} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: '10rem',
        }}
      >
        <AlertTable
          rows={[
            {
              id: 1,
              crypto: 'Bitcoin',
              choice: 'Target USD',
              choiceValue: 10000,
              alertType: 'Falls Below',
            },
          ]}
        />
      </Box>
    </Layout>
  );
};

export default AddAlert;
