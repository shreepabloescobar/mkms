import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFab-primary": {
      position: "fixed",
      bottom: 20,
      right: 20,
      overflow: "hidden",
    },
  },
  popOverStyle: {
    "& .MuiPopover-paper": {
      height: 520,
      width: 361,
      borderRadius: 10,
      position: "relative",
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));
