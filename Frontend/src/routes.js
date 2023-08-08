import { Navigate, useRoutes } from 'react-router-dom';

import { useState, useEffect } from 'react';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//

import Customers from './pages/Customers';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import TicketsPage from './pages/TicketsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import TrackTickets from './pages/TrackTickets'
import EditProfile from './pages/EditProfile';

// ----------------------------------------------------------------------

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // console.log(isLoggedIn);
    fetch('http://helpdesk.wingslide.co.in:4001/validate', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token: window.localStorage.getItem('token'),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
   
        }
      });


  
  
  }, []);

  const routes = useRoutes([
    {
      path: '/',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: 'dashboard', element: <DashboardAppPage /> },
        { path: 'customer', element: <Customers /> },
        { path: 'tickets', element: <TicketsPage /> },
        { path: 'tracktickets', element: <TrackTickets /> },
        { path: 'editprofile', element: <EditProfile /> },
      ],
    },
    {
      path: '/login',
      element: !isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" />,
    },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
