import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { ArrowBackIos } from '@material-ui/icons';
import Link from '../../../Link';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      "&:hover": {
        color: theme.palette.primary.main
      }
    },
    title: {
      flexGrow: 1,
      fontFamily: "'BM HANNA 11yrs old'",
      textShadow: `1.8px 1.8px ${theme.palette.text.disabled}`,
      "&:hover": {
        color: theme.palette.primary.main
      },
      textAlign: 'center',
      cursor: "default",
      "-webkit-user-select": "none",
      "-webkit-user-drag": "none",
      "-webkit-app-region": "no-drag",
    },
  }),
);

const SimpleAppBar: React.FC<{label: string}> = ({label}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Link href="/" color="textPrimary">
            <IconButton edge="start" color="inherit" aria-label="menu" className={classes.menuButton}>
              <ArrowBackIos />
            </IconButton>
          </Link>
          <Typography variant="h5" className={classes.title}>
            {label}
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="menu" style={{opacity: 0}} >
            <ArrowBackIos />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default SimpleAppBar;
