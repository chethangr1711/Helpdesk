import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Stack, Typography, Button, Modal } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid-pro';
import FlagSharpIcon from '@mui/icons-material/FlagSharp';
import ViewModal from './ViewModel';
import AddTickets from './AddTickets';
import Iconify from '../components/iconify';

import './TicketsPage.css';

export default function TicketsPage() {

  const location = useLocation();
  const yourVariable = location.state?.yourVariable;


  const [username, setUser] = useState('');
  const [rowdata, setRowdata] = useState([]);
  const [openM, setOpenM] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const [passd, setPassd] = useState('');
  const [tab, settab] = useState(yourVariable || 'All');

  const fetchTicketRecords = (type) => {
    const tickettype = type;
    fetch('http://helpdesk.wingslide.co.in:4001/getticketrecords', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token: window.localStorage.getItem('token'),
        type: tickettype,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // setRowdata(data.data);
        // console.log(data.data);
        if (data.status === 'Ok') {
          setRowdata(data.data);
          setUser(data.username);
        } else {
          setRowdata([]);
        }
      });
  };
  useEffect(() => {
    // setTimeout(() => {
    fetchTicketRecords(tab);
    // }, 3000);
  }, [rowdata, fetchTicketRecords]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const memoizedModalContent = useMemo(
    () => <AddTickets data={username} open={openM !== null} handleClose={handleModalClose} />,
    [username]
  );

  const ticketData = rowdata.map((ticket) => ({
    id: ticket._id || '',
    Ticketid: ticket.TicketID || '',
    Title: ticket.Title || '',
    subject: `${ticket.Title || ''} - ${ticket.Subject || ''}`,
    asignto: ticket.AssignedTo || '',
    status: ticket.Status || '',
    Comments: ticket.UpdatedComment || '',
    Createdat:
      new Date(ticket.CreatedAt)
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .replace(/\//g, '/') || '',
    customerName: ticket.CustName || '',
    CustomerId: ticket.CustomerID || '',
    ReassignTo: ticket.ReassignedTo || '',
    CreatedBy: ticket.CreatedBy || '',
    flag: ticket.flag || '',
    asignby: ticket.CreatedBy || '',
    originalcomment: ticket.Comments || '',
    updatedat: ticket.UpdatedAt || '',
    phone: ticket.Phone || '',
  }));

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(false);
    setOpenM(false);
  };

  const handleView = (params) => {
    // console.log(params.row);
    setPassd(params.row);
    setOpenM(true);
  };

  const openTicket = () => {
    fetchTicketRecords('Open');
    settab('Open');
  };

  const allTicket = () => {
    fetchTicketRecords('All');
    settab('All');
  };

  const closedTicket = () => {
    fetchTicketRecords('Closed');
    settab('Closed');
  };

  const inProcessTicket = () => {
    fetchTicketRecords('In Process');
    settab('In Process');
  };

  const pauseTicket = () => {
    fetchTicketRecords('Paused');
    settab('Paused');
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Help Desk Tickets
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleModalOpen}>
            New Ticket
          </Button>
        </Stack>

        <Modal open={isModalOpen} onClose={handleModalClose}>
          <div>{memoizedModalContent}</div>
        </Modal>

        <Modal open={openM}>
          <div>
            <ViewModal data={passd} open={openM} onClose={handlePopoverClose} />
          </div>
        </Modal>

        <Stack direction="row" spacing={2} mb={2}>
          <Button variant={tab === 'All' ? 'contained' : 'outlined'} onClick={allTicket}>
            All
          </Button>
          <Button variant={tab === 'Open' ? 'contained' : 'outlined'} onClick={openTicket}>
            Open
          </Button>
          <Button variant={tab === 'Closed' ? 'contained' : 'outlined'} onClick={closedTicket}>
            Closed
          </Button>
          <Button variant={tab === 'Paused' ? 'contained' : 'outlined'} onClick={pauseTicket}>
            Paused
          </Button>
          <Button variant={tab === 'In Process' ? 'contained' : 'outlined'} onClick={inProcessTicket}>
            In Process
          </Button>
        </Stack>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              filterPanel: {
                disableAddFilterButton: true,
                disableRemoveAllButton: true,
              },
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'Ticketid', sort: 'desc' }],
              },
            }}
            density="standard"
            sx={{
              fontFamily: 'Poppins',
              boxShadow: 2,
              border: 0,
              borderColor: 'primary.light',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}
            columns={[
              {
                field: 'Ticketid',
                headerName: 'Ticket Id',
                flex: 0.8,
              },
              {
                field: 'subject',
                headerName: 'Subject',
                flex: 2.4,
              },
              {
                field: 'asignto',
                headerName: 'To',
                flex: 0.4,
              },
              {
                field: 'asignby',
                headerName: 'From',
                flex: 0.4,
              },
              {
                field: 'status',
                headerName: 'Status',
                flex: 0.4,
              },

              {
                field: 'flag',
                headerName: 'Flag',
                flex: 0.3,
                renderCell: (params) => {
                  let flagColor;
                  if (params.row.status === 'Closed') {
                    flagColor = 'green';
                  } else if (params.value === 'orange') {
                    flagColor = 'orange';
                  } else if (params.value === 'red') {
                    flagColor = 'red';
                  } else if (params.value === 'blue') {
                    flagColor = 'blue';
                  } else if (params.row.status === 'Paused') {
                    flagColor = 'skyblue';
                  } else {
                    return null;
                  }
                  return <FlagSharpIcon style={{ color: flagColor }} />;
                },
              },

              {
                field: 'Createdat',
                headerName: 'Created At',
                flex: 0.6,
              },
              {
                field: 'view',
                headerName: 'View',
                sortable: false,
                filterable: false,
                flex: 0.4,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                  return (
                    <Button variant="outlined" size="small" onClick={() => handleView(params)}>
                      View
                    </Button>
                  );
                },
              },
            ]}
            rows={ticketData}
            checkboxSelection
          />
        </div>
        <div className="notes">
          <h4>Note : Flags indicate the importance of the Tickets</h4>
          <div className="flagcolors">
            <FlagSharpIcon style={{ color: 'red' }} /> Critical
            <FlagSharpIcon style={{ color: 'orange' }} /> Average
            <FlagSharpIcon style={{ color: 'skyblue' }} /> Paused
            <FlagSharpIcon style={{ color: 'blue' }} /> Low Priority
            <FlagSharpIcon style={{ color: 'green' }} /> Closed
          </div>
          <h4>
            <span>
              Note : You Cannot make changes to tickets untill you have paused all the tickets assigned to you
            </span>
          </h4>
        </div>
      </Container>
    </>
  );
}
