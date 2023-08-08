import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import axios from 'axios';

// @mui
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
  
    try {
        const response = await axios.post("http://helpdesk.wingslide.co.in:4001/login", {
          email,
          password,
        })
        .then(response =>{
            if(response.status ===201){
                // console.log(response);
                toast.success("Login Successful!!!");
              
                  window.location.href = "/dashboard";
                  localStorage.setItem('user',response.data.username);
                  localStorage.setItem('token', response.data.data);
                  // console.log(response);
            }
            else{
                console.log(response.data.status);
                toast.error(response.data.status);
                // console.log(toast);
            }
        })
        ;
  
      } catch (error) {
        // console.error(error);
        toast.error("Invalid email or password");
      }
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
      pauseOnHover/>
      <Stack spacing={3}>
        <TextField name="email" onChange={(e)=>setEmail(e.target.value)} label="Email address" />

        <TextField
          name="password"
          label="Password"
          onChange={(e)=>setPassword(e.target.value)}
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>

        {/* <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    
    </>
  );
}
