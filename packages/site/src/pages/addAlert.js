import Layout from '../components/UI/Layout';
import CryptoUSDForm from '../components/CryptoUSDForm';
import AlertTable from '../components/AlertTable';
import { useState, useEffect } from 'react';
import { getWatchList } from '../utils';
import Box from '@mui/material/Box';

const AddAlert = () => {
  const [watchList, setWatchList] = useState([]);

  const fetchWatchList = () => {
    getWatchList()
      .then((res) => {
        const data = res.map((item, idx) => ({
          id : idx + 1,
          crypto : item.tokenName,
          choice : (item.isPercent ? "Percentage Change" : "Target USD"),
          priceAtTimeOfAddition : item.priceAtTimeOfAddition,
          choiceValue : (item.isPercent ? `${item.value}%` : `${item.value} USD`),
          alertType : (item.lookingFor === 1 ? "Rises Above" : "Falls Below")
      }))

      setWatchList(data);
      })
  }
  useEffect(() => {
    getWatchList()
      .then((res) => {
        const data = res.map((item, idx) => ({
          id : idx + 1,
          crypto : item.tokenName,
          choice : (item.isPercent ? "Percentage Change" : "Target USD"),
          priceAtTimeOfAddition : `${item.priceAtTimeOfAddition} USD`,
          choiceValue : (item.isPercent ? `${item.value}%` : `${item.value} USD`),
          alertType : (item.lookingFor === 1 ? "Rises Above" : "Falls Below")
      }))

      setWatchList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout>
      <CryptoUSDForm setWatchList={setWatchList} watchList = {watchList} fetchWatchList = {fetchWatchList}/>
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
          // rows={[
          //   {
          //     id: 1,
          //     crypto : 'bitcoin',
          //     choice: 'Target USD',
          //     choiceValue: 10000,
          //     alertType: 'Falls Below',
          //     priceAtTimeOfAddition : 20000
          //   },
          // ]}

          rows = {watchList}
          fetchWatchList = {fetchWatchList}
        />
      </Box>
    </Layout>
  );
};

export default AddAlert;
