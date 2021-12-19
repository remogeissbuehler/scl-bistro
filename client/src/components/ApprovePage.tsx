import { ThemeProvider } from "@emotion/react";
import { Alert, AppBar, Box, Button, ButtonProps, Card, CardActions, CardContent, CardMedia, Container, createTheme, CssBaseline, Fab, Grid, Icon, IconButton, makeStyles, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { ArrowCircleLeft, ArrowCircleRight, CheckCircleOutline, Home, HowToReg, KeyboardArrowUp, Refresh, RemoveCircle, SendSharp } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
// import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import React, { Component } from "react";
import { validateTime } from "../utils";
import { useNavigate } from "react-router-dom";
import { LinkButton } from "./LinkButton";

const theme = createTheme();

function NameTable({ rows, loadData }: { rows: Array<[string, string, boolean]>, loadData: Function }) {
    return (
        <Table sx={{ bgcolor: "Window", mt: 1 }} size='small'>
            <TableHead sx={{ bgcolor: "WindowFrame" }}>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>username</TableCell>
                    <TableCell>Account freischalten</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    rows.map(([name, username, needsApproval]) => (
                        <TableRow hover={true} key={name}>
                            <TableCell> {name} </TableCell>
                            <TableCell> {username} </TableCell>
                            <TableCell>

                                {needsApproval
                                    ? <IconButton
                                        color="success"
                                        onClick={async () => {
                                            await axios.patch(`/users/approve`, {
                                                username
                                            });
                                            loadData();
                                        }}
                                    >
                                        <HowToReg />
                                    </IconButton>
                                    : null
                                }
                            </TableCell>
                        </TableRow>
                    ))
                }
                {
                    rows.length == 0 ? <TableRow hover={true}> <TableCell>--</TableCell><TableCell>--</TableCell></TableRow>
                        : null
                }
            </TableBody>
        </Table>
    )
}

interface User {
    username: string,
    fullname: string,
    _id: string,
    pendingApproval?: boolean,
    rights?: string[]
}


export default class ApprovePage extends Component<any, any> {

    state = {
        data: [],
        errorMessages: [],
        successMessage: ""
    }

    constructor(props: any) {
        super(props);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    addErrorMessage(msg: string) {
        this.setState({ errorMessages: [msg, ...this.state.errorMessages] });
    }

    clearErrorMessages() {
        this.setState({ errorMessages: [] });
    }

    get rows(): [string, string, boolean][] {
        return this.state.data.map((u: User)  => [u?.fullname, u?.username, u?.pendingApproval || false]);
    }

    async loadData() {
        try {
            let rep = await axios.get("/users/all");
            if (rep.status == 200) {
                let users = rep.data;
                console.log(users);
                this.setState({ data: users });
            }
            
        } catch (err: any) {
            if (err.response && (err.response.status == 401 || err.response.status == 403)) {
                this.addErrorMessage("Berechtigung fehlt");
                return;
            } else {
                this.addErrorMessage("Die Daten konnten nicht geladen werden");
            }
        }

    }

    render() {
        // let navigate = useNavigate();
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="relative">
                    <Toolbar>
                        <LinkButton
                            variant="contained"
                            to="/app"
                            color="inherit"
                            sx={{
                                mx: 2
                            }}
                        >
                            <Home color="primary" />
                        </LinkButton>
                        <Typography variant="h5" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            Bistro Benutzer Übersicht
                        </Typography>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={this.loadData}
                        >
                            <Refresh />
                        </Button>

                    </Toolbar>
                </AppBar>
                <main>
                    <Container sx={{py: 2}} maxWidth="md">
                        {
                            this.state.errorMessages.map(msg =>
                                <Alert severity='error' sx={{ my: 1 }} >
                                    {msg}
                                </Alert>
                            )
                        },
                        <NameTable rows={ this.rows } loadData={ this.loadData }/>
                    </Container>



                </main>
            </ThemeProvider>

        )
    }

}