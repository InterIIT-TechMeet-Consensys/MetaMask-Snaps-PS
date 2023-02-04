import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendHello,
  shouldDisplayReconnectButton,
  notificationsOptIn,
  logState,
  handleNotificationsOptIn,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
} from '../components';
import Layout from '../components/UI/Layout';
import RequestForm from '../components/RequestForm';
import { Box } from '@mui/system';
import RequestsTable from '../components/RequestsTable';

import { initiateAccountDetails } from '../utils';
import { Button } from '@mui/material';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
  background-color: '#171275';
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  window.ethereum.on('accountsChanged', async (accounts) => {
    // console.log(accounts);
    try {
      await initiateAccountDetails(accounts);
    } catch (err) {
      console.log(err);
    }
  });
  const [state, dispatch] = useContext(MetaMaskContext);

  const [optIn, setOptIn] = useState(false);

  useEffect(() => {
    logState()
      .then((data) => {
        if (data?.permissions?.notificationsOptIn) {
          setOptIn(true);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleNotificationsOptInClick = async () => {
    try {
      const optIn = await handleNotificationsOptIn();
      if (!optIn) {
        return;
      }
    } catch (err) {
      console.log(err);
    }

    const walletAddresses = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const user = walletAddresses[0];
    const url = 'http://127.0.0.1:9000/opt-in';
    const data = {
      user,
    };
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    const jsonResponse = await response.json();
    if (jsonResponse.message === 'opt-in successful') {
      await notificationsOptIn();
      alert('Subscribed for notifications successfully');
      setOptIn(true);
    } else if (jsonResponse.message === 'opt-in failed') {
      alert('Failed to subscribe to notifications. Try again Later!');
    }
  };
  return (
    <>
      <Layout>
        <Button
          variant="contained"
          style={{
            marginTop: '1rem',
            width: '15rem',
          }}
          onClick={handleNotificationsOptInClick}
          disabled={optIn}
        >
          Opt-in (Notifications)
        </Button>

        <RequestForm />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            margin: '10rem',
          }}
        >
          <RequestsTable />
        </Box>
      </Layout>
    </>
  );
};

export default Index;
