import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useRouter } from "next/router";
import { hasCookie, setCookie } from "cookies-next";

import { SetAuthToken } from "./utils/auth"

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const router = useRouter();

  // This should display quicker, but I suck at React, so we out here.
  React.useLayoutEffect(() => {
    if (hasCookie("auth-token")) {
      console.log("User has valid authentication token, redirect to main forms page.")
      router.push("/forms/form");
    }
  }, []);

  const [errorMessage, setErrorMessage]  = React.useState("");
  const [hasError, setError] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(false);
    setErrorMessage("");
    const data = new FormData(event.currentTarget);

    // Make request to API to login
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/login`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password")
        })
      })
      const response_data = await response.json()
      if (response.ok) {
        if (response_data.hasOwnProperty("access_token")) {
          setCookie("access-token", response_data['access_token']);
          router.push("/forms/form");
        } else {
          setErrorMessage("Malformed request from server, please try again and contact support if issue persists.");
          setError(true);
        }
      } else {
        console.error("Complete error received from server: ", response_data);
        if (typeof response_data?.detail === "string") {
          setErrorMessage(response_data?.detail);
        } else {
          setErrorMessage(response_data?.detail[0].msg);
        }
        setError(true);
      }
    } catch (error) {
      setErrorMessage("Internal Server error, please try again later, or contact support.");
      setError(true);
      console.log("Error occurred while making API request", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {hasError && <p style={{ color: "red" }}>{errorMessage}</p>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/sign-up/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
