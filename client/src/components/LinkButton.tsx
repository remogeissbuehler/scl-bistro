import { IconButton } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

interface LinkButtonProps extends ButtonProps {
    to: string
}

export function LinkButton({to, ...props}: LinkButtonProps) {
    let navigate = useNavigate();

    return <Button {...props} onClick={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate(to);
    }}></Button>

    // return Button(props);
}

export function LinkIconButton({to, ...props}: LinkButtonProps) {
    let navigate = useNavigate();

    return <IconButton {...props} onClick={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate(to);
    }}></IconButton>

    // return Button(props);
}
