import { Button, ButtonProps } from "@mui/material";
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";

interface OptionalCallback extends ButtonProps {
    callback?: Function
}

export default function LogoutButton({callback, ...props}: OptionalCallback) {
    const navigate = useNavigate();
    return (
        <Button variant="contained"
            color="inherit"
            onClick={async () => {
                await axios.get("/auth/logout");
                callback && callback();
                navigate("/app");
            }}
            {...props}>
            <LogoutIcon color="primary" />
        </Button>
    )
}