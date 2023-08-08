import { useState, useEffect, React, useCallback } from 'react';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CommentIcon from '@mui/icons-material/Comment';
import FlagSharpIcon from '@mui/icons-material/FlagSharp';
import SubjectIcon from '@mui/icons-material/Subject';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTickets = (props) => {
  const { handleClose } = props;

  const [ticketNum, setTicketNum] = useState('');
  const [user, setUser] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [comments, setComments] = useState('');
  const [staffs, setStaffs] = useState([]);
  const [flagc,setFlagc] = useState('');
  useEffect(() => {
    fetch('http://helpdesk.wingslide.co.in:4001/getticket', {
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
        //   console.log(data);
        if (data.status === 'ok') {
          setTicketNum(data.data);
          setUser(data.username);
          setStaffs(data.users);
        } else {
          toast.error(data.error);
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      });
  }, []);
  function generateCustomerId(customerName) {
    // Convert the customer name to lowercase and remove all spaces
    const cleanedName = customerName.toLowerCase().replace(/\s/g, '');

    // Generate a random 4-digit number
    const randomDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    // Combine the cleaned name and random digits to create the customer ID
    const customerId = `${cleanedName}${randomDigits}`;

    return customerId;
  }
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
    setFlagc(event.target.value);
  };

  function handleCustomerNameChange(event) {
    const newName = event.target.value;
    setCustomerName(newName);
    const newCustomerId = generateCustomerId(newName);
    setCustomerId(newCustomerId);
  }

  const createRecord = (e) => {
    e.preventDefault();
    console.log(flagc);
    // Check if customer name and email are not empty
    if (!customerName || !email) {
      toast.error('Please enter customer name and email');
      return;
    }

    fetch('http://helpdesk.wingslide.co.in:4001/createticket', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        title,
        ticketNum,
        user,
        customerName,
        customerId,
        email,
        phone,
        assignTo,
        subject,
        comments,
        flagc,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'Ok') {
          toast.success('Tickert Successfully Created');
          setTimeout(() => {
            handleClose();
          }, 2000);
        } else {
          toast.error('Something went wrong');
        }
      });
  };

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
      <div className="form_wrapper">
        <div className="form_container">
          <div className="title_container">
            <h2>Create A Ticket</h2>
          </div>
          <form onSubmit={createRecord}>
            <div className="row clearfix">
              <div>
                <div className="textarea_field">
                  <span className="icons comment">
                    <SubjectIcon />{' '}
                  </span>
                  <input type="text" name="title" placeholder="Business Name" onChange={(e) => setTitle(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="row clearfix">
              <div className="col_half">
                <div className="input_field">
                  <span className="icons">
                    <ConfirmationNumberIcon />{' '}
                  </span>
                  <input type="text" name="ticketid" defaultValue={ticketNum} placeholder="Ticket Id" readOnly />
                </div>
              </div>
              <div className="col_half">
                <div className="input_field">
                  <span className="icons">
                    <PersonIcon />{' '}
                  </span>
                  <input type="text" name="username" defaultValue={user} placeholder="User Name" readOnly />
                </div>
              </div>
            </div>
            <div className="row clearfix">
              <div className="col_half">
                <div className="input_field">
                  <span className="icons">
                    <PersonIcon />{' '}
                  </span>
                  <input type="text" name="custname" placeholder="Customer Name" onChange={handleCustomerNameChange} />
                </div>
              </div>
              <div className="col_half">
                <div className="input_field">
                  <span className="icons">
                    <PersonIcon />{' '}
                  </span>
                  <input type="text" name="custID" value={customerId} placeholder="Customer Id" disabled />
                </div>
              </div>
            </div>
            <div className="row clearfix">
              <div className="col_half">
                <div className="input_field">
                  <span className="icons">
                    <EmailIcon />{' '}
                  </span>
                  <input
                  type="email"
                    name="email"
                    placeholder="abc@gmail.com"
                    
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="col_half">
                <div className="input_field">
                  <span className="icons">
                    <PhoneIcon />{' '}
                  </span>
                  <input type="text" name="phone" placeholder="Phone no" onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="row clearfix">
              <div className="col_half">
                <div>Assign To</div>
                <div>
                  <select
                    onChange={(e) => {
                      setAssignTo(e.target.value);
                    }}
                  >
                    <option> Select to Assign</option>
                    {staffs.map((s) => {
                      if (s.First_Name !== 'Admin') {
                        return (
                          <option key={s.First_Name} value={s.First_Name}>
                            {s.username}
                          </option>
                        );
                      }
                      return null;
                    })}
                  </select>
                </div>
              </div>
              <div className="col_half flags">
                <span className="icons ">{selectedColor && <FlagSharpIcon style={{ color: selectedColor }} />}</span>
                <select defaultValue="" onChange={handleColorChange} style={{marginTop:'23px'}}>
                  <option value="">
                    Select Priority
                  </option>
                  <option value="red">Critical</option>
                  <option value="orange">Average</option>
                  <option value="blue">Low Priority</option>
                </select>
              </div>
            </div>
            <div className="row clearfix">
              <div>
                <div className="textarea_field">
                  <span className="icons comment">
                    <SubjectIcon />{' '}
                  </span>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row clearfix">
              <div>
                <div className="textarea_field">
                  <span className="icons comment">
                    <CommentIcon />
                  </span>
                  <textarea
                    cols="46"
                    rows="3"
                    name="comments"
                    placeholder="Comments"
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button className="button" type="submit" value="Sumbit">
              Submit
            </button>
          </form>
        </div>
      </div>

    </>
  );
};

export default AddTickets;
