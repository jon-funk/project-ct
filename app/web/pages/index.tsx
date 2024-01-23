import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Copyright } from "../components/Copyright";
import { useRouter } from "next/router";
import { login } from "../utils/api";
import { RenderErrorAlerts } from "../components/RenderErrorAlerts";
import { RenderSubmitAlert } from "../components/RenderSubmitAlert";
import { AlertObject } from "../interfaces/AlertObject";
import { SignInFormInputs } from "../interfaces/SignInFormInputs";


const theme = createTheme();

export default function SignIn() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>();
  const [submitAlert, setSubmitAlert] = React.useState<AlertObject | null>(null);


  React.useEffect(() => {
    const token = window.localStorage.getItem("auth-token");
    if (token) {
      router.push("/medical/form"); // TODO: Implement logic for user's group form
    }
  }, [router]);


  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    const errorMessage = await login(data.email, data.password, data.userGroup);
    if (!errorMessage) {
      router.push("/medical/form"); // TODO: Implement logic for user's group form
    } else {
      setSubmitAlert({ type: "error", message: errorMessage });
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <FormControl fullWidth margin="dense">
              <InputLabel id="user-group-label">Sign-in to</InputLabel>
              <Controller
                name="userGroup"
                control={control}
                defaultValue=""
                rules={{ required: "Please select user group to sign-in to" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Sign-in to"
                    required
                    fullWidth
                  >
                    <MenuItem value="medical">Medical</MenuItem>
                    <MenuItem value="sanctuary">Sanctuary</MenuItem>
                  </Select>
                )}

              />
            </FormControl>
            <FormControl fullWidth margin="dense">
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: "Please enter your email" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email ? String(errors.email.message) : ""}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth margin="dense">
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: "Please enter your password" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password ? String(errors.password.message) : ""}
                  />
                )}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              {RenderSubmitAlert(submitAlert)}
              {RenderErrorAlerts(errors)}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </FormControl>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider >
  );
}
