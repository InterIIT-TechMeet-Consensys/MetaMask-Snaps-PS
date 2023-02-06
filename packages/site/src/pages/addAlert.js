import Layout from '../components/UI/Layout';
import CryptoUSDForm from '../components/CryptoUSDForm';

import {useState, useEffect} from "react";
import { addNewTokenAlert, getWatchList } from '../utils';

const AddAlert = () => {
  const [watchList, setWatchList] = useState([]);
  
  useEffect(() => {
    getWatchList().then(res => setWatchList(res)).catch(err => console.log(err));
  }, []);

  return (
    <Layout>
      <CryptoUSDForm setWatchList = {setWatchList}/>
    </Layout>
  );
};

export default AddAlert;
