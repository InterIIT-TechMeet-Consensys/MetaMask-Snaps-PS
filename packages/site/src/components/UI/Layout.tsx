import * as React from 'react';
import { useContext } from 'react';
import { navigate } from 'gatsby';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { MetamaskActions, MetaMaskContext } from '../../hooks';
import {
  connectSnap,
  getSnap,
  logState,
  initiateState,
  connectMetamaskWallet,
  initiateAccountDetails,
} from '../../utils';

const drawerWidth = 240;

type Props = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactNode;
};

export default function Layout(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();
      // console.log(installedSnap);
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });

      try {
        let stateData = await logState();
        if (!stateData) {
          await initiateState();
        }
      } catch (err) {
        console.log(err);
      }

      const accounts = await connectMetamaskWallet();
      // console.log(accounts);
      if (accounts) {
        await initiateAccountDetails(accounts);
      }
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleLogStateClick = async () => {
    try {
      const logStateData = await logState();
      console.log(logStateData);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleInitiateStateClick = async () => {
    try {
      const state = await initiateState();
      console.log(state);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePageChange = (text: string) => {
    let url = '/';
    console.log('clicked');
    switch (text) {
      case 'Request':
        url = '/';
        break;
      case 'Manage Block':
        url = '/block';
        break;
      case 'Add Alert':
        url = '/addAlert';
        break;
      default:
        url = '/';
    }
    navigate(`http://localhost:8000${url}`);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem key="Request" disablePadding>
          <ListItemButton onClick={handlePageChange.bind(this, 'Request')}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Request" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Add Alert" disablePadding>
          <ListItemButton onClick={handlePageChange.bind(this, 'Add Alert')}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Add Alert" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {/* ['Block', 'ListItem 2', 'ListItem 3'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={handleBlock}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        )) */}
        <ListItem key="Block" disablePadding>
          <ListItemButton onClick={handlePageChange.bind(this, 'Manage Block')}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Block" />
          </ListItemButton>
        </ListItem>
      </List>
      <Button color="success" variant="contained" onClick={handleConnectClick}>
        {' '}
        Connect{' '}
      </Button>{' '}
      <br />
      <p>Debugging purposes</p>
      <Button color="success" variant="contained" onClick={handleLogStateClick}>
        {' '}
        Log State{' '}
      </Button>{' '}
      <br />
      <Button
        color="success"
        variant="contained"
        onClick={handleInitiateStateClick}
      >
        {' '}
        initiate State{' '}
      </Button>
    </div>
  );

  const container =
    window === undefined ? undefined : () => window().document.body;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            IIT Bhubaneswar Metamask Snap
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
