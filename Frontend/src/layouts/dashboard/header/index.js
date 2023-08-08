import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';




// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const [message,setMessage] = useState('');

  useEffect(()=>{
    const socket = io("http://helpdesk.wingslide.co.in:4002");
    // console.log(socket);
    const userlocal = localStorage.getItem('user');

    socket.on("notifications",(msg)=>{

      if (msg.includes(userlocal)) {
      Notification.requestPermission().then(perm => {
        const options = {
          body: msg,
          requireInteraction: true, // make the notification stay until the user manually closes it
          silent: false // allow the notification to make a sound
        };
        new Notification('New Notification', options);
      });
      // console.log(msg);
      setMessage((prev)=>
      [...prev,msg]);
    }
      // console.log(msg);
      
    })
    // socket.on("notifications", (msg) => {
    //   // Check if userlocal is included in the msg
    //   if (msg.includes(userlocal)) {
    //     setMessage((prev) => [...prev, msg]);
    //   }
    // });
    
  },[]);
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <NotificationsPopover data={message} />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
