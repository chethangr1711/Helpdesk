import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useState,useEffect } from 'react';
import { Container, Stack, Typography } from '@mui/material';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const Customers = () => {
    const [rowdata,setRowdata] = useState([]);
    const ticketData = rowdata.map((ticket)=> ({
        id:ticket._id,
        Customer_Id:ticket.CustomerID,
        Cust_Name:ticket.CustName,
        Email:ticket.Email,
        Phone:ticket.Phone,
        Ticket_Id:ticket.TicketID
      }));
    
      useEffect(()=>{

        const token = window.localStorage.getItem('token');
        // console.log(token)
        fetch(`http://helpdesk.wingslide.co.in:4001/customerdata?token=${token}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          })
        .then((res) => res.json())
        .then((data) => {
            if(data.status === 'Ok')
            {
                setRowdata(data.data);
            }
            else
            {
                toast.error(data.error);
                window.location.href='/';
            }
        }
        );
      },[]);


  return (
    <>
     <ToastContainer 
      autoClose={10000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
            Customers
          </Typography>
            </Stack>

            <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            sx={{ fontFamily: 'Poppins' }}
            columns={[
            
              {
                field: 'Customer_Id',
                headerName: 'Customer ID',
                flex: 0.7,
              },
              {
                field: 'Cust_Name',
                headerName: 'Customer Name',
                flex: 1,
              },
              {
                field: 'Email',
                headerName: 'Email',
                flex: 1,
              },
              {
                field: 'Phone',
                headerName: 'Phone Number',
                flex: 1,
              },
              {
                field: 'Ticket_Id',
                headerName: 'Ticket ID',
                flex: 1,
              },
              
            ]}
            rows={ticketData}
            components={{ Toolbar: GridToolbar }}
            checkboxSelection
            experimentalFeatures={{ lazyLoading: true }}
          />
        </div>
        </Container>
    </>
  )
}

export default Customers