import { Helmet } from 'react-helmet-async';
import {  useNavigate } from 'react-router-dom'

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import { useEffect, useState } from 'react';

// sections
import {
  AppNewsUpdate,
  AppOrderTimeline,
  AppWidgetSummary,
} from '../sections/@dashboard/app';


// ----------------------------------------------------------------------

export default function DashboardAppPage() {

  const [cust,setCust] = useState('');
  const [tick,setTick] = useState('');
  const [open,setOpen] = useState(0);
  const [closeticket, setCloseTicket] = useState('');
  const totalCustomer = Number(cust);
  const totalTicket = Number(tick);
  const totalOpen = Number(open);

  const totalClosed = Number(closeticket);
  const [ticketdetails,setticektDetails] = useState([]);
  const [lastTickets,setLastTickets] = useState([]);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    fetch(`http://helpdesk.wingslide.co.in:4001/Dashboard?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((customers) => {
        if(customers.status ==='ok')
        {
          setCust(customers.customers);
          setTick(customers.tickets);
          setOpen(customers.open);
          setCloseTicket(customers.closed);
          setticektDetails(customers.latestTickets);
          setLastTickets(customers.lastTicket);
        }
      else
      {
        alert("Token Expired Please login again");
        window.location.href='/';
      }
        // console.log(customers);
       
      });
  }, [cust,tick,open,closeticket,ticketdetails,lastTickets]);
  
const handleWidgetClick = () =>{
  window.location.href ='/tickets';
}
const history = useNavigate();
  // const theme = useTheme();
const gotoTickets = (yourVariable) =>{
  
  history('/tickets' , { state: { yourVariable } });
}
  return (
    <>
      <Helmet>
        <title> Dashboard | Winglside Technologies </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Customers" total={totalCustomer} icon={'uil:user'}  style={{ minHeight: '240px' }}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3} style={{ cursor: 'pointer' }}>
            <AppWidgetSummary onClick={() => gotoTickets('All')} title="Total Tickets" total={totalTicket} color="info" icon={'icon-park-outline:tickets-two'} style={{ minHeight: '240px' }} />
          </Grid>

          <Grid item xs={12} sm={6} md={3} style={{ cursor: 'pointer' }}>
      <AppWidgetSummary title="Open Tickets" total={totalOpen}  onClick={() => gotoTickets('Open')} color="warning" icon={'icon-park-outline:tickets-two'} style={{ minHeight: '240px' }} />
    </Grid>

          <Grid item xs={12} sm={6} md={3} style={{ cursor: 'pointer' }}>
            <AppWidgetSummary title="Closed Tickets" total={totalClosed}  onClick={() => gotoTickets('Closed')} color="error" icon={'icon-park-outline:tickets-two'} style={{ minHeight: '240px' }} />
          </Grid>

          
          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              style={{ minHeight: '500px' }}
              title="Ticket Update"
              list={ticketdetails.map((ticket) => ({
                id: ticket._id,
                title: ticket.TicketID,
                business:ticket.Title,
                description: ticket.Subject,
                image: `/assets/images/covers/helpdesk.png`,
                postedAt: new Date(ticket.CreatedAt),
                status: ticket.Status,
                comments: ticket.Comments,
                created:ticket.CreatedBy,
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
            style={{ minHeight: '500px' }}
              title="Ticket Timeline"
              list={lastTickets.map((last) => ({
                id: last._id,
                title: last.TicketID,
                desc: last.Subject,
                status: last.Status,
                time: new Date(last.CreatedAt),
                closedAt: last.ClosedAt ? new Date(last.ClosedAt) : '',
                updatedAt: last.UpdatedAt ? new Date(last.UpdatedAt) : '',
                closedby : last.ClosedBy,
                created:last.CreatedBy,
                updatedby:last.UpdatedBy,
                comments:last.UpdatedComment,
                reassignedto:last.ReassignedTo,
                updatedcomment:last.UpdatedComment
              }))}
            />
          </Grid>

      
        </Grid>
      </Container>
    </>
  );
}
