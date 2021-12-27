import { ThemeProvider } from "@emotion/react";
import { Alert, AppBar, Box, Button, Card, CardActions, CardContent, CardMedia, Container, createTheme, CssBaseline, Fab, Grid, Icon, IconButton, makeStyles, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { ArrowCircleLeft, ArrowCircleRight, CheckCircleOutline, Home, KeyboardArrowUp, ManageAccounts, RemoveCircle, SendSharp } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
// import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { Component } from "react";
import { validateTime } from "../utils";
import { LinkButton } from "./LinkButton";
import config from "common/clientConfig";
import LogoutButton from "./LogoutButton";

const theme = createTheme();

type LunchOrDinner = "lunch" | "dinner";

function checkDeadline(type: "add" | "delete", meal: LunchOrDinner, date: string) {
    let today = new Date();
    let deadline = new Date(date);
    type LorDDel = "lunch_del" | "dinner_del";
    let [h, m] = type == "add" ? config.deadlines[meal] : config.deadlines[meal + "_del" as LorDDel];
    deadline.setHours(h);
    deadline.setMinutes(m);

    return today <= deadline;
}

function NameTable({ insc, meal, rows, loadData }: { insc: any, meal: string, rows: Array<[string, string, string]>, loadData: Function }) {
    return (
        <Table sx={{ bgcolor: "Window", mt: 1 }} size='small'>
            <TableHead sx={{ bgcolor: "WindowFrame" }}>
                <TableRow>
                    <TableCell>Angemeldet</TableCell>
                    <TableCell>Zeit</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    rows.map(([id, name, time]) => (
                        <TableRow hover={true} key={name}>
                            <TableCell> {name} </TableCell>
                            <TableCell> {time} </TableCell>
                            <TableCell>
                                {id == localStorage.getItem("_id") && checkDeadline("delete", meal as LunchOrDinner, insc.date)
                                    ? <IconButton
                                        color="error"
                                        onClick={async () => {
                                            await axios.delete(`/inscriptions/${insc._id}/${meal}`);
                                            loadData();
                                        }}
                                    >
                                        <RemoveCircle />
                                    </IconButton>
                                    : null
                                }
                            </TableCell>
                        </TableRow>
                    ))
                }
                {
                    rows.length == 0 ? <TableRow hover={true} key="lastrow"> <TableCell>--</TableCell><TableCell>--</TableCell></TableRow>
                        : null
                }
            </TableBody>
        </Table>
    )
}

function InscriptionCard(props: { insc: any, title: string, id: string, loadData: Function }) {
    let { insc, title, id, loadData } = props;

    let submitNewTime = async (e: any) => {
        let textField = document.querySelector(`#${id}-${insc._id}`) as any;
        await axios.post("/inscriptions/add", {
            date_id: insc._id,
            meal: id,
            time: textField.value
        });

        loadData();
    }

    let SubmitButton = () => (
        <IconButton aria-label="tick" onClick={submitNewTime}>
            <SendSharp color="success" />
        </IconButton>
    )

    // let rows = []
    // if (id === "lunch") {
    let rows = insc[id].map((obj: any) => [obj?.user?._id, obj?.user?.fullname, obj?.time])
    // }

    return (
        <Card variant="outlined" sx={{ mx: 2, my: 1 }}>
            <CardContent>
                <Typography variant="h5" align="center">{title}</Typography>
                <NameTable insc={insc} meal={id} rows={rows} loadData={loadData} />
                {
                    checkDeadline("add", id as LunchOrDinner, insc.date) 
                    ? 
                        <Stack direction='column' justifyContent="center">
                            <Typography align="center" sx={{ mt: 4, mb: 2 }}>Anmelden:</Typography>
                            <TextField
                                id={`${id}-${insc._id}`}
                                fullWidth={false}
                                label="Zeit"
                                variant="filled"
                                helperText="Bitte Zeit als hh:mm eintragen"
                                InputProps={{ endAdornment: <SubmitButton /> }}
                            />
                            {/* <IconButton aria-label="tick">
                                <CheckCircleOutline/>
                            </IconButton> */}
                        </Stack>
                    : <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>Keine Anmeldung mehr möglich</Alert>
                }
            </CardContent>
        </Card>
    )
}


export default class Week extends Component<{ onUnauthorized: Function }, any> {
    onUnauthorized: Function;

    constructor(props: { onUnauthorized: Function }) {
        super(props);
        this.onUnauthorized = props.onUnauthorized;

        this.state = {
            startDate: new Date(),
            errorMsg: "",
            hasError: false,
            loading: true,
            inscriptions: [],
            // startDay = new Date();
        }

        this.loadData = this.loadData.bind(this);
    }

    updateStartDate(days: number) {
        let startDate = this.state.startDate;
        let currentDay = startDate.getDate();
        let date = new Date(startDate.setDate(currentDay + days));

        this.setState({ startDate: date });
        this.loadData();
    }

    updateStartDateFn(days: number) {
        return () => this.updateStartDate(days)
    }

    async loadData() {
        let startDate = this.state.startDate;

        // let monday = today.getDate() - today.getDay();
        let endDay = startDate.getDate() + 6;
        let endDate = new Date((new Date(startDate)).setDate(endDay));

        let short = (date: Date) => date.toLocaleDateString('en-GB').split("/").reverse().join("-");

        try {
            let rep = await axios.get(`/inscriptions/${short(startDate)}/${short(endDate)}`);

            if (rep.status == 200) {
                console.log(rep.data);
                this.setState({ inscriptions: rep.data });
            }
        } catch (err: any) {
            console.log(err);
            if (err.response && err.response.status == 401 || err.response.status == 403) {
                alert("Login abgelaufen, du musst dich neu einloggen");
                this.onUnauthorized();
            } else {
                this.setState({ errorMessage: "Beim Laden der Daten ist etwas schiefgelaufen... :(" });
            }
        }

    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="relative">
                    <Toolbar>
                    <LinkButton
                            variant="text"
                            to="/app"
                            color="inherit"
                            
                            sx={{
                                mr: 2,
                                // opacity: 0
                            }}
                        >
                            <Home color="inherit" />
                        </LinkButton>
                        <Typography variant="h5" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            Bistro Anmeldungen
                        </Typography>
                        {
                            localStorage.getItem("admin") === "true"
                                ?
                                <LinkButton
                                    variant="outlined"
                                    color="inherit"
                                    to="/app/approveUsers"
                                    startIcon={<ManageAccounts />}
                                    sx={{
                                        mx: 2
                                    }}
                                >
                                    Benutzer
                                </LinkButton>
                                : null
                        }
                        {/* <Button variant="contained"
                            color="inherit"
                            onClick={() => {
                                axios.get("/auth/logout");
                                this.onUnauthorized();
                            }}>
                            <LogoutIcon color="primary" />
                        </Button> */}
                        <LogoutButton callback={ () => {
                            this.onUnauthorized()
                        }}/>
                    </Toolbar>
                </AppBar>
                <main>
                    <Container sx={{ py: 2, mx: 0 }} maxWidth={false}>
                        <Stack
                            sx={{ pt: 4, py: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button variant="outlined"
                                size="large"
                                startIcon={<ArrowCircleLeft />}
                                onClick={this.updateStartDateFn(-7)}
                            >
                                Letzte Woche
                            </Button>
                            <Button variant="contained"
                                size="large"
                                endIcon={<ArrowCircleRight />}
                                onClick={this.updateStartDateFn(7)}
                            >
                                Nächste Woche
                            </Button>
                        </Stack>
                    </Container>
                    <Container sx={{ py: 2, mx: 0 }} maxWidth={false}>
                        {/* End hero unit */}
                        <Grid container spacing={4}>
                            {this.state.inscriptions.map((insc: any) => (
                                <Grid item key={insc._id} xs={12} sm={4} md={3} xl={1.7} sx={{ px: 0 }}>
                                    <Paper
                                        sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}
                                    >
                                        {/* <CardContent sx={{ flexGrow: 1 }}> */}
                                        <Typography gutterBottom variant="h4" component="h2" alignSelf="center">
                                            {new Date(insc.date).toLocaleDateString('de-CH')}
                                        </Typography>
                                        <InscriptionCard id="lunch" title="Mittag" insc={insc} loadData={this.loadData} />
                                        <InscriptionCard id="dinner" title="Abend" insc={insc} loadData={this.loadData} />

                                        {/* <Typography>
                                                This is a media card. You can use this section to describe the
                                                content.
                                            </Typography> */}
                                        {/* </CardContent> */}
                                        {/* <CardActions>
                                            <Button size="small">View</Button>
                                            <Button size="small">Edit</Button>
                                        </CardActions> */}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        {/* <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button variant="contained">Main call to action</Button>
                            <Button variant="outlined">Secondary action</Button>
                        </Stack> */}
                        <Fab onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            style={{ right: 20, bottom: 20, position: 'fixed' }}
                            color="primary"
                        >
                            <KeyboardArrowUp />
                        </Fab>
                    </Container>

                    <Snackbar
                        open={this.state.hasError}
                        autoHideDuration={6000}
                        onClose={(_: any, reason: string) => { if (reason === 'clickaway') return; else this.setState({ hasError: false }) }}
                        message={this.state.errorMessage}
                    // action={action}
                    />
                </main>

            </ThemeProvider>
        );
    }
}