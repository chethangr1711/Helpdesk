import React, { useEffect, useState } from 'react';
import './Common.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from 'mdb-react-ui-kit';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import Iconify from '../components/iconify';

export default function EditProfile() {
  const [username, setUsername] = useState([]);
  const [oldPass, setoldPass] = useState('');
  const [newPass, setnewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [alluser, setAllUser] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [email,setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`http://helpdesk.wingslide.co.in:4001/getProfile?token=${token}`, {
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
          setUsername(data.username);
          setAllUser(data.allusers);
          setAdmin(data.admin);
        }
        // console.log(data);
      });
  }, [username]);

  const changePassword = (e) => {
    e.preventDefault();
    console.log(email,newPass);
    fetch('http://helpdesk.wingslide.co.in:4001/changepass', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token: window.localStorage.getItem('token'),
        oldPassword: oldPass,
        newPassword: newPass,
        Email:email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success(data.status);
        setEditMode(false);
      });
  };

  const userdata = alluser.map((ticket) => ({
    id: ticket._id || '',
    FirstName: ticket.First_Name || '',
    Email: ticket.Email || '',
    LastName: ticket.Last_Name || '',
    username: ticket.username || '',
    password: ticket.Password || '',
    Position: ticket.Position || '',
    Group: ticket.Group || '',
  }));

  const filteredUserdata = userdata.filter((record) => record.username !== 'Admin' && record.username !== 'Sales');

  const columns = [
    {
      field: 'FirstName',
      headerName: 'First Name',
      flex: 1,
    },
    {
      field: 'LastName',
      headerName: 'Last Name',
      flex: 1,
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 1,
    },
   
  ];

  if (admin) {
    columns.push(
      {
        field: 'Email',
        headerName: 'Email',
        flex: 2,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: (params) => (
          <Button variant="contained" onClick={() => handleEdit(params.row)}>
            Edit
          </Button>
        ),
      }
    );
  }
  

  const handleEdit = (params) => {
    // console.log(params);
    setoldPass(params.password);
    setEditMode(true);
    setUsername(params);
    setEmail(params.Email);
  };
  return (
    <>
          <ToastContainer 
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
      <section style={{ backgroundColor: '#eee' }}>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            componentsProps={{
              filterPanel: {
                disableAddFilterButton: true,
                disableRemoveAllButton: true,
              },
            }}
            sx={{
              fontFamily: 'Poppins',
              '& .MuiDataGrid-footerContainer': {
                justifyContent: 'right',
              },
              '& .MuiDataGrid-pagination': {
                '& .MuiButtonBase-root': {
                  borderRadius: '4px',
                  margin: '0px',
                  padding: '6px 8px',
                },
              },
            }}
            columns={columns}
            rows={filteredUserdata}
            checkboxSelection
          />
        </div>
        {editMode && (
          <MDBContainer className="py-5">
            <MDBRow>
              <MDBCol lg="4">
                <MDBCard className="mb-4">
                  <MDBCardBody className="text-center">
                    <MDBCardImage
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: '150px', margin: 'auto', paddingBottom: '17px' }}
                      fluid
                    />
                    <p className="text-muted mb-1">{username.Position}</p>
                    <p className="text-muted mb-4">{username.Group}</p>
                  </MDBCardBody>
                </MDBCard>

                <MDBCard className="mb-4 mb-lg-0">
                  <MDBCardBody className="p-0">
                    <MDBListGroup className="rounded-3">
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                        <MDBIcon fas icon="globe fa-lg text-warning" />
                        <MDBCardText>http://helpdesk.wingslide.co.in</MDBCardText>
                      </MDBListGroupItem>
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                        <MDBIcon fab icon="github fa-lg" style={{ color: '#333333' }} />
                        <MDBCardText>Coming Soon...</MDBCardText>
                      </MDBListGroupItem>
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                        <MDBIcon fab icon="twitter fa-lg" style={{ color: '#55acee' }} />
                        <MDBCardText>Coming Soon...</MDBCardText>
                      </MDBListGroupItem>
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                        <MDBIcon fab icon="instagram fa-lg" style={{ color: '#ac2bac' }} />
                        <MDBCardText>Coming Soon...</MDBCardText>
                      </MDBListGroupItem>
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                        <MDBIcon fab icon="facebook fa-lg" style={{ color: '#3b5998' }} />
                        <MDBCardText>Coming Soon...</MDBCardText>
                      </MDBListGroupItem>
                    </MDBListGroup>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol lg="8">
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Full Name</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{username.username}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Email</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{username.Email}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Phone</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">-</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Mobile</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">-</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Address</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">-</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>

                <MDBRow>
                  <MDBCol md="12">
                    <MDBCard className="mb-4 mb-md-0">
                      <MDBCardBody>
                        <MDBCardText className="mb-4">Change Password</MDBCardText>
                        <MDBCol md="6">
                          <TextField
                            name="password"
                            style={{ width: '100%' }}
                            variant="outlined"
                            label="Old Password"
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPass}
                            onChange={(e) => setoldPass(e.target.value)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                                    {showOldPassword ? (
                                      <Iconify icon="bi:eye-slash-fill" />
                                    ) : (
                                      <Iconify icon="bi:eye-fill" />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </MDBCol>
                        <MDBCol md="12" style={{ display: 'flex', marginTop: '10px' }}>
                          <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
                            <MDBCol md="6">
                              <TextField
                                style={{ width: '100%' }}
                                name="password"
                                label="New Password"
                                onChange={(e) => setnewPass(e.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                        </MDBCol>
                        <MDBCol md="6">
                              <TextField
                                name="password"
                                style={{ width: '100%' }}
                                label="Confirm Password"
                                onChange={(e) => setConfirmPass(e.target.value)}
                                type={showConfirmPassword ? 'text' : 'password'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                      >
                                        <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </MDBCol>
                          </div>
                        </MDBCol>

                        {newPass !== confirmPass && (
                          <MDBCol md="12" style={{ color: 'red', marginTop: '10px' }}>
                            Passwords do not match
                          </MDBCol>
                        )}
                        <MDBCol md="12" style={{ marginTop: '10px' }}>
                          <MDBBtn onClick={changePassword}>Change Password</MDBBtn>
                        </MDBCol>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        )}
      </section>
      <div className="notes">
        <h4>Note : To Change Password Contact Your Admin</h4>
      </div>
    </>
  );
}
