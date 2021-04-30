import { Snackbar, SnackbarProps } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
interface NotificationProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  alertProps?: AlertProps;
  snackbarProps?: SnackbarProps;
}
const Notification = (props: NotificationProps) => {
  const handleClose = () => {
    props.setOpen(false);
  };
  return (
    <>
      <Snackbar
        open={props.open}
        autoHideDuration={5000}
        onClose={handleClose}
        {...props.snackbarProps}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="error"
          {...props.alertProps}
          onClose={handleClose}
        >
          {props.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};
export default Notification;
