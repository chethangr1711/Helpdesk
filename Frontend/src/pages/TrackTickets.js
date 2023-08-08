import React, { useState, useEffect } from 'react';
import { Container } from '@mui/system';
import { Input, Grid, Typography, Button, Modal, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import { GridToolbar } from '@mui/x-data-grid-pro';
import 'react-toastify/dist/ReactToastify.css';
import './TrackTickets.css';

function TrackTickets() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketDetails, setTicketDetails] = useState([]);
  const [showDataGrid, setShowDataGrid] = useState(false);
  const [open, setOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');

  const handleSearch = () => {
    if (ticketNumber) {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      // Make API call to retrieve ticket data using token and ticketNumber
      fetch(`http://helpdesk.wingslide.co.in:4001/getrecord?ticketNumber=${ticketNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'Ok') {
            setTicketDetails(data.data);
          } else {
            toast.error(data.error);
          }
        });
    }
  };

  useEffect(() => {}, []);

  const ticketData = ticketDetails.map((ticket) => ({
    id: ticket._id || '',
    Ticketid: ticket.TicketID || '',
    Title: ticket.Title || '',
    subject: ticket.Subject || '',
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
    updatedat: ticket.UpdatedAt
      ? new Date(ticket.UpdatedAt)
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .replace(/\//g, '/')
      : '',
    phone: ticket.Phone || '',
  }));

  const handleDownload = () => {
    setShowDataGrid(true);
  };

  const openPopup = (title) => {
    setPopupTitle(title);
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
  };

  return (
    <Container>
      <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Grid item xs={12} md={12}>
        <Grid container spacing={1}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Track Your Tickets
          </Typography>
        </Grid>
        <form>
          {/* <h4>Enter Ticket Number To Track</h4> */}
          <div>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Enter Ticket Number To Track"
              sx={{
                mr: 1,
                fontWeight: 'fontWeightBold',
                boxShadow: '0 8px 16px 0 rgba(145, 158, 171, 0.16)',
                padding: '30px',
                marginBottom: '10px',
              }}
              value={ticketNumber}
              onChange={(event) => setTicketNumber(event.target.value)}
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
            <span style={{ float: 'right' }}>
              <Button variant="contained" onClick={handleDownload}>
                Download
              </Button>
            </span>
          </div>
        </form>

        <Container>
          {ticketDetails.length > 0 && (
            <Grid container>
              <div style={{ padding: '20px', width: '100%' }}>
                {showDataGrid && (
                  <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                      columns={[
                        {
                          field: 'subject',
                          headerName: 'Subject',
                          flex: 1,
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
                          flex: 0.5,
                        },
                        {
                          field: 'Comments',
                          headerName: 'Comments',
                          flex: 1,
                        },

                        {
                          field: 'Createdat',
                          headerName: 'Created At',
                          flex: 0.5,
                        },
                        {
                          field: 'updatedat',
                          headerName: 'Updated At',
                          flex: 0.5,
                        },
                        {
                          field: 'originalcomment',
                          headerName: 'Updated Comment',
                          sortable: false,
                          filterable: false,
                          flex: 1,
                        },
                      ]}
                      rows={ticketData}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </div>
                )}

                <div className="timeline">
                  {ticketDetails.map((record, index) => (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-content">
                        <h3>
                          <Button type="button" className="link-button" onClick={() => openPopup(record)}>
                            {record.TicketID}
                          </Button>
                        </h3>
                        <p>
                          {record.Subject}
                          <span style={{ float: 'right' }}>Created By: {record.CreatedBy}</span>
                        </p>
                        <p>
                          <span>Assigned To: {record.AssignedTo}</span>
                          <span style={{ float: 'right' }}>
                            Assigned On: {new Date(record.CreatedAt).toLocaleString()}
                          </span>
                        </p>
                        <p>
                          <span>Status: {record.Status}</span>
                          {record.UpdatedAt && (
                            <span style={{ float: 'right' }}>
                              <span>Updated By: {record.UpdatedBy}</span>
                              <span> @ {new Date(record.UpdatedAt).toLocaleString()}</span>
                            </span>
                          )}
                        </p>
                        <p>{record.Comments}</p>
                        {record.UpdatedComment && record.UpdatedAt && (
                          <p>
                            {record.UpdatedComment}
                            <span style={{ float: 'right' }}>
                              Updated At: {new Date(record.UpdatedAt).toLocaleString()}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <Modal open={open} onClose={closePopup}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        maxWidth: 600,
                        maxHeight: 600,
                        overflow: 'auto',
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Ticket ID : {popupTitle.TicketID}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Business Name : {popupTitle.Title}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Subject : {popupTitle.Subject}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Status : {popupTitle.Status}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Customer ID : {popupTitle.CustomerID}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Customer Name : {popupTitle.CustName}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Customer Phone : {popupTitle.Phone}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {popupTitle.ReassignedTo ? 'Reassigned To' : 'Assigned To'}:{' '}
                        {popupTitle.ReassignedTo ? popupTitle.ReassignedTo : popupTitle.AssignedTo}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Assigned By: {popupTitle.CreatedBy} @ {new Date(popupTitle.CreatedAt).toLocaleString()}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Updated By: {popupTitle.UpdatedBy} @ {new Date(popupTitle.UpdatedAt).toLocaleString()}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Comments: {popupTitle.Comments}
                      </Typography>
                      <Button variant="contained" sx={{ mr: 5 }} onClick={closePopup}>
                        Close
                      </Button>
                    </Box>
                  </Modal>
                </div>
              </div>
            </Grid>
          )}
        </Container>
      </Grid>
    </Container>
  );
}

export default TrackTickets;
