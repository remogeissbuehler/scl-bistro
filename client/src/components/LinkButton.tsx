import { IconButton } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface LinkButtonProps extends ButtonProps {
    to: string | number
}

function useNavigateOverload() {
    let _navigate = useNavigate();
    return (to: string | number) => {
        if (typeof to === "string") {
            _navigate(to);
        } else {
            _navigate(to);
        }
    }
}

export function LinkButton({to, ...props}: LinkButtonProps) {
    let navigate = useNavigateOverload();

    return <Button {...props} onClick={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate(to);
    }}></Button>

    // return Button(props);
}

export function LinkIconButton({to, ...props}: LinkButtonProps) {
    let navigate = useNavigateOverload();

    return <IconButton {...props} onClick={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate(to);
    }}></IconButton>

    // return Button(props);
}
