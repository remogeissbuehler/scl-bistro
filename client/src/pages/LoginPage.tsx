import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import theme from '../styling/theme';


export default function LoginPage({ onLogin }: { onLogin: Function }) {
  // let [hasError, setHasError] = React.useState(false);
  let [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const res = await axios.post(
        // `https://${config.server.host}:${config.server.port}/auth/login`,
        "/auth/login",
        { username: data.get('username'), password: data.get('password') },
        {
          headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*'
          },
          // withCredentials: true
        }
      )

      if (res.status == 200) {
        for (let key in res.data) {
          localStorage.setItem(key, res.data[key]);
        }
        // localStorage.setItem("user_id", res.data._id);
        // localStorage.setItem("username", res.data.username);
        // localStorage.setItem("fullname", res.data.fullname);
        // localStorage.set
        // console.log(res.data);
        setErrorMessage("");
        onLogin();
      } 
    } catch (err: any) {
      if (!err.response) {
        setErrorMessage("Unbekannter Fehler, sorry :/");
        console.log(err);
        return;
      }
      if (err.response.status == 403) {
        setErrorMessage("Dein Account wurde noch nicht freigeschaltet.");
      }
      if (err.response.status == 401)
        setErrorMessage("Falscher Benutzername oder Passwort");
      else {
        
      }
        
    }
    

    

    

    // console.log(res);
    

    // eslint-disable-next-line no-console
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password'),
    // });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid 
      container 
      component="main" 
      sx={{ 
        height: '100vh' 
      }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            // backgroundImage: 'url(https://source.unsplash.com/random)',
            // backgroundImage: 'url(https://www.ilfishalle.ch/wp-content/uploads/sites/4/2019/09/ms_ilfishalle_eiserlebnis.jpg)',
            backgroundImage: `url(${process.env.PUBLIC_URL}/ilfishalle.jpg)`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'rgb(37,87,180)' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Benutzername"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Passwort"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              
              { 
                errorMessage.trim().length > 0 ?  
                                                  <Alert severity='error' >
                                                    {errorMessage}
                                                  </Alert>
                                                : null
              }
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Eingeloggt bleiben"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>

              <Typography>
                Wenn du noch keinen Account hast, kannst du { }
                <Link to="/app/signup">
                  hier einen erstellen. 
                </Link>
              </Typography>

              
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}