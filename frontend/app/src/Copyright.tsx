import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles(createStyles({
  copyright: {
    cursor: 'default',
    "-webkit-user-select": "none",
    "-webkit-user-drag": "none",
    "-webkit-app-region": "no-drag",
    fontFamily: "'BM HANNA 11yrs old'"
  }
}))

export default function Copyright() {
  const classes = useStyles();
  return (
    <Typography variant="body2" color="textSecondary" align="center" className={classes.copyright}>
      Amazon Web Service Digital Native Architects 1st :: Team 3 :: 2020
    </Typography>
  );
}
