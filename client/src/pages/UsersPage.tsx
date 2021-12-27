import { ThemeProvider } from "@emotion/react";
import { AddCircle, Home, HowToReg, PlusOne, Refresh, RemoveCircle } from '@mui/icons-material';
import { Alert, AppBar, Button, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
// import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import React, { Component, useState } from "react";
import { LinkButton } from "../components/LinkButton";
import LogoutButton from "../components/LogoutButton";
import theme from "../styling/theme";
import { onLogout } from "../utils/auth";

function ConfirmDeleteButtonAndDialog({ username, loadData }: { username: string, loadData: Function }) {
    let [open, setOpen] = useState(false);
    function changeOpenFn(value: boolean) {
        return () => { loadData(); setOpen(value); }
    }

    return (
        <>
            <Button
                color="error"
                variant="outlined"
                startIcon={<RemoveCircle />}
                onClick={async () => {
                    setOpen(true);
                }}
            >
                Löschen
            </Button>
            <Dialog
                open={open}
                onClose={changeOpenFn(false)}
            >
                <DialogTitle>
                    Benutzer löschen?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Willst du den Benutzer "{username}" wirklich löschen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={changeOpenFn(false)}>Nein</Button>
                    <Button
                        onClick={async () => {
                            await axios.delete(`/users/${username}`);
                            loadData();
                            setOpen(false);
                        }}
                        autoFocus
                    >
                        Ja
                    </Button>
                    </DialogActions>
            </Dialog>
        </>
    )
}

function NameTable({ rows, loadData }: { rows: Array<[string, string, boolean]>, loadData: Function }) {
    return (
        <Table sx={{ bgcolor: "Window", mt: 1 }} size='small'>
            <TableHead sx={{ bgcolor: "WindowFrame" }}>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>username</TableCell>
                    <TableCell>Account freischalten</TableCell>
                    <TableCell>Löschen</TableCell>
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
                                    ? <Button
                                        color="success"
                                        variant="outlined"
                                        startIcon={<HowToReg />}
                                        onClick={async () => {
                                            await axios.patch(`/users/approve`, {
                                                username
                                            });
                                            loadData();
                                        }}
                                    >
                                        Benutzer bestätigen
                                    </Button>
                                    : null
                                }
                            </TableCell>
                            <TableCell>
                                <ConfirmDeleteButtonAndDialog  { ...{ username, loadData } } />
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
        return this.state.data.map((u: User) => [u?.fullname, u?.username, u?.pendingApproval || false]);
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
                                mr: 2
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
                            sx={{
                                mx: 1
                            }}
                        >
                            <Refresh />
                        </Button>
                        <LogoutButton sx={{ ml: 1 }} callback={onLogout} />
                    </Toolbar>
                </AppBar>
                <main>
                    <Container sx={{ py: 2 }} maxWidth="md">
                        {
                            this.state.errorMessages.map(msg =>
                                <Alert severity='error' sx={{ my: 1 }} >
                                    {msg}
                                </Alert>
                            )
                        }
                        <Typography variant="h4" >
                            Benutzer-Übersicht
                        </Typography>
                        <Typography sx={{ my: 2 }}>
                            Hier können Benutzer, die sich neu angemeldet haben, freigeschaltet werden. Dazu auf den Knopf in der «Account freischalten» Spalte klicken.
                        </Typography>
                        <NameTable rows={this.rows} loadData={this.loadData} />
                        <LinkButton
                            variant="outlined"
                            startIcon={<AddCircle/>}
                            to="/app/signup"
                            color="success"
                            sx={{
                                my: 2
                            }}
                        >
                            Neuen Nutzer erfassen
                        </LinkButton>
                    </Container>



                </main>
            </ThemeProvider>

        )
    }

}