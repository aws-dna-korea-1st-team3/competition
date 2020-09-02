import { createStyles, IconButton, makeStyles, NoSsr, Tooltip } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import * as React from "react";
import Link from "../../../Link";

const useStyles = makeStyles(theme => createStyles({
  icon: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(8),
    opacity: 0.5,
    zIndex: theme.zIndex.snackbar
  }
}));

const MyPageButton: React.FC = () => {
  const classes = useStyles();

  return <NoSsr>
    <Link href="/my-page">
      <Tooltip title="마이페이지" placement="bottom">
        <IconButton className={classes.icon}>
          <AccountCircle />
        </IconButton>
      </Tooltip>
    </Link>
  </NoSsr>;
};

export default MyPageButton;
