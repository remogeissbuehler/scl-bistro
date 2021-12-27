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
import { LinkButton, LinkIconButton } from '../components/LinkButton';
import { ArrowBack, Home } from '@mui/icons-material';
import theme from "../styling/theme";

function validateForm(formData: FormData) {
  let username = formData.get("username");
  let name = formData.get("name");
  let pw = formData.get("password") as string;
  let pwConfirm = formData.get("password-confirm") as string;

  let errorMessages: string[] = [];

  if (username == "") {
    errorMessages.push("Benutzername sollte nicht leer sein");
  }
  if (name == "") {
    errorMessages.push("Name sollte nicht leer sein");
  }
  if (pw.length < 8) {
    errorMessages.push("Passwort sollte mindestens 8 Zeichen haben.");
  }

  if (pw != pwConfirm) {
    errorMessages.push("Passwörter stimmen nicht überein");
  }

  return errorMessages;
}


export default function SignupPage() {
  // let [hasError, setHasError] = React.useState(false);
  let emptyErr: string[] = [];
  let [errorMessages, setErrorMessages] = React.useState(emptyErr);
  let [successMessage, setSuccessMessage] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let err = validateForm(data);
    if (err.length > 0) {
      console.log(errorMessages);
      setErrorMessages(err);
      return;
    }

    try {
      const res = await axios.post(
        "/auth/signup",
        {
          username: data.get('username'),
          name: data.get('name'),
          password: data.get('password')
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (res.status == 200) {
        setSuccessMessage("Deine Daten wurden erfolgreich erfasst. Sobald wir deinen Account freigeschaltet haben, kannst du dich einloggen.");
      }
    } catch (err: any) {
      setErrorMessages(["Server Fehler, sorry :/"]);
      console.log(err);
    }

  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component="main"
        justifyContent="center"
        sx={{
          height: '100vh',
          backgroundImage: `url(${process.env.PUBLIC_URL}/ilfishalle.jpg)`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <CssBaseline />

        <Grid
          item
          xs={false}
          sm={12}
          md={12}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <LinkIconButton
            to="/app"
            color='primary'
            sx={{
              ml: 2,
              mt: 2
            }}
          >
            {/* <Home /> */}
            <ArrowBack />
          </LinkIconButton>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }} >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Neues Konto erstellen
            </Typography>
            {successMessage.trim().length > 0 ? null :
              <Box
                component="form"

                textAlign="center"
                onSubmit={handleSubmit}
                onChange={(e: React.FormEvent<HTMLFormElement>) => {
                  if (errorMessages.length > 0) {
                    let newErrors = validateForm(new FormData(e.currentTarget));
                    setErrorMessages(newErrors);
                  }
                }}
                sx={{ mt: 1 }}
              >
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
                  id="name"
                  label="Vor- und Nachname"
                  name="name"
                  autoComplete="name"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Passwort"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password-confirm"
                  label="Passwort bestätigen"
                  type="password"
                  id="password-confirm"
                  autoComplete="new-password"
                />

                {
                  errorMessages.map(msg =>
                    <Alert severity='error' sx={{ my: 1 }} >
                      {msg}
                    </Alert>
                  )
                },

                {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Eingeloggt bleiben"
                /> */}
                <Button
                  type="submit"

                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  absenden
                </Button>
              </Box>
            }
            {
              successMessage.trim().length > 0 ?
                <Alert severity='success' >
                  {successMessage}
                </Alert>
                : null
            }
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={12}
          md={12}
        />
      </Grid>
    </ThemeProvider>
  );
}