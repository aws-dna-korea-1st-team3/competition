import { createStyles, Link, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Copyright from '../src/Copyright';
import { TitleListContainer } from '../src/presentation/container';
import clsx from 'clsx';

const useStyle = makeStyles(theme => createStyles({
  "box": {
    wordBreak: "keep-all"
  },
  "textContainer": {
    textAlign: "center",
    marginBottom: theme.spacing(5)
  },
  "nonSelectable": {
    cursor: "default",
    "-webkit-user-select": "none",
    "-webkit-user-drag": "none",
    "-webkit-app-region": "no-drag",
  },
  "mainHeader": {
    fontFamily: "'BM HANNA 11yrs old'",
    textShadow: `5px 5px ${theme.palette.text.disabled}`,
    "&:hover": {
      color: theme.palette.primary.main
    }
  },
  "subHeader": {
    fontFamily: "'BM HANNA 11yrs old'",
    textShadow: `2px 2px ${theme.palette.text.disabled}`,
    "&:hover": {
      color: theme.palette.secondary.main
    }
  }
}))

export default function Index() {
  const classes = useStyle();
  return (
    <Container maxWidth="lg">
      <Box my={4} className={classes.box}>
        <div className={clsx(classes.nonSelectable, classes.textContainer)}>
          <Typography className={classes.subHeader} variant="h4">
            AWS DNA 1st :: Team 3
          </Typography>
          <Typography className={classes.mainHeader} variant="h1" component="h1" gutterBottom>
            만화경 작품 추천 시스템
          </Typography>
          <Typography>
            AWS Personalize로 유사 작품 추천 및 개인화 추천을 합니다.
          </Typography>
          <Typography>
            <Link href="https://github.com/aws-dna-korea-1st-team3/competition" target="_blank">
              https://github.com/aws-dna-korea-1st-team3/competition
            </Link>
          </Typography>
        </div>
        <TitleListContainer />
        <Copyright />
      </Box>
    </Container>
  );
}
