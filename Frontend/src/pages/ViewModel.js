import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FlagSharpIcon from '@mui/icons-material/FlagSharp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FormControl from '@mui/material/FormControl';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewModal(props) {
  const { open, onClose, data } = props;
  // console.log(props);
  const [comments, setComments] = useState(data.Comments || '');
  const [users, setUsers] = useState([]);
  const [st, setSt] = useState(data.status);
  const [priority, setPriority] = useState(data.flag);
  const [ticketcreator] = useState(data.CreatedBy || '');
  const TID = data.Ticketid;
  const [closedby, setClosedby] = useState('');
  const [userposition, setUserPosition] = useState('');

  const [showReassign, setShowReassign] = useState(false);
  const [reassignedto, setReassignTo] = useState('');
  const [process, setProcess] = useState('');
  const [creator, setCreator] = useState(false);
  const [title, setTitle] = useState(data.Title);
  const [subject,setSubject] = useState(data.subject);
  const [phoneno,setPhoneno] = useState(data.phone);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (user === ticketcreator) {
      setCreator(true);
    }

    fetch(`http://helpdesk.wingslide.co.in:4001/viewTicket?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'Ok') {
          setClosedby(data.username);
          setUsers(data.allusers);
          setUserPosition(data.isAdmin);
          setProcess(data.inprocess);
        }
      });
  }, [creator]);

  const updateRecord = (e) => {
    e.preventDefault();
    if (process <= 1 || st==='Paused') {
      const token = window.localStorage.getItem('token');
      fetch('http://helpdesk.wingslide.co.in:4001/updateTicket', {
        method: 'POST',
        crossDomain: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          token,
          comments,
          st,
          TID,
          closedby,
          reassignedto,
          priority,
          title,
          subject,
          phoneno,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          if (data.success === true) {
            toast.success('Ticket updated successfully');
            setTimeout(() => {
              onClose();
            }, 2000);
          } else {
            toast.error(data.error);
          }
        });
    } else {
      alert(`You Cannot make changes Because You have one Ticket In "In Process"`);
    }
  };

  function getRelativeTime(timestamp) {
    if (!timestamp) {
      return '';
    }

    const now = Date.now();
    const diff = now - Date.parse(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    switch (true) {
      case seconds < 60:
        return `${seconds} sec ago`;
      case minutes < 60:
        return `${minutes} min ago`;
      case hours < 24:
        return `${hours} hour ago`;
      default:
        return `${days} days ago`;
    }
  }

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
        pauseOnHover
      />
      <Modal open={open} onClose={onClose}>
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
            Ticket ID: {data.Ticketid}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Business Name:{' '}
            {data.status === 'Closed' ? (
              <span>{title}</span>
            ) : creator ? (
              <input
                type="text"
                style={{ fontSize: '14px',border:'1px solid #eee',padding:'2px' }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <span>{title}</span>
            )}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Subject: {' '}
            {/* {data.subject} */}
            {data.status === 'Closed' ? (
              <span>{subject}</span>
            ) : creator ? (
              <input
                type="text"
                style={{ fontSize: '14px',border:'1px solid #eee',padding:'2px' }}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            ) : (
              <span>{subject}</span>
            )}

          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Customer ID: {data.CustomerId}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Customer Name: {data.customerName}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Customer Phone: {''}
            {data.status === 'Closed' ? (
              <span>{phoneno}</span>
            ) : creator ? (
              <input
                type="text"
                style={{ fontSize: '14px',border:'1px solid #eee',padding:'2px'  }}
                value={phoneno}
                onChange={(e) => setPhoneno(e.target.value)}
              />
            ) : (
              <span>{phoneno}</span>
            )}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {data.ReassignTo ? 'Reassigned To' : 'Assigned To'}: {data.ReassignTo ? data.ReassignTo : data.asignto}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Assigned By: {data.CreatedBy}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                label="Status"
                defaultValue={data.status}
                onChange={(event) => setSt(event.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Open" disabled={data.status === 'Open' || data.status === 'In Process'}>
                  Open
                </MenuItem>
                <MenuItem value="In Process" disabled={data.status === 'In Process'}>
                  In Process
                </MenuItem>
                <MenuItem value="Paused" disabled={data.status === 'Open' || data.status === 'Paused'}>
                  Paused
                </MenuItem>
                <MenuItem value="Closed" disabled={data.status === 'Closed'}>
                  Closed
                </MenuItem>
              </Select>
            </FormControl>
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            <InputLabel id="demo-simple-select-helper-label">Priority</InputLabel>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                label="Status"
                defaultValue={data.flag}
                onChange={(event) => setPriority(event.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="red" selected={data.flag === 'red'}>
                  <FlagSharpIcon style={{ color: 'red' }} /> Critical
                </MenuItem>
                <MenuItem value="orange" selected={data.flag === 'orange'}>
                  <FlagSharpIcon style={{ color: 'orange' }} /> Average
                </MenuItem>

                <MenuItem value="blue" selected={data.flag === 'blue'}>
                  <FlagSharpIcon style={{ color: 'blue' }} /> Low Priority
                </MenuItem>
              </Select>
            </FormControl>
          </Typography>

          {showReassign && (
            <div id="reassing">
              <Typography variant="subtitle1" gutterBottom>
                <InputLabel id="demo-simple-select-helper-label">Reassign To</InputLabel>
                <FormControl sx={{ m: 1, minWidth: 220 }} size="small">
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="users"
                    onChange={(e) => setReassignTo(e.target.value)}
                  >
                    {users
                      .filter((user) => user.username !== 'Admin')
                      .map((user) => (
                        <MenuItem key={user._id} value={user.First_Name}>
                          {user.username}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Typography>
            </div>
          )}

          <Typography variant="subtitle1" gutterBottom>
            Comments:
          </Typography>
          <span style={{ userSelect: 'none' }}>
            <h6>
              {data.Comments}{' '}
              <span style={{ display: 'flex', justifycontent: 'center', float: 'right', alignItems: 'center' }}>
                <span className="icon">
                  {' '}
                  <AccessTimeIcon style={{ width: '16px' }} />{' '}
                </span>{' '}
                {data.Createdat}
              </span>
            </h6>
            <h6>
              {data.originalcomment}{' '}
              <span style={{ display: 'flex', justifycontent: 'center', float: 'right', alignItems: 'center' }}>
                <span className="icon">
                  {' '}
                  <AccessTimeIcon style={{ width: '16px' }} />{' '}
                </span>{' '}
                {getRelativeTime(data.updatedat)}
              </span>
            </h6>
          </span>

          <textarea
            onChange={(e) => setComments(e.target.value)}
            style={{ width: '100%', height: 100, marginBottom: 20, padding: 10 }}
          />

          {data.status === 'Closed' ? null : (
            <Button variant="contained" sx={{ mr: 5 }} onClick={updateRecord}>
              Update
            </Button>
          )}

          <Button variant="contained" sx={{ mr: 5 }} onClick={onClose}>
            Close
          </Button>
          {userposition === 'Team Lead' || userposition === 'Admin' || data.status !== 'Closed' ? (
            <Button variant="contained" onClick={() => setShowReassign(!showReassign)}>
              Reassign
            </Button>
          ) : null}

          <h4 style={{paddingTop:'12px'}}>{data.status === 'Closed' ? <span>Note: The Ticket is Closed</span> : null}</h4>
        </Box>
      </Modal>
    </>
  );
}
