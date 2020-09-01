import { createStyles, makeStyles } from '@material-ui/core';
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
    textAlign: "center"
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
      color: '#04a6e0'
    }
  },
  "subHeader": {
    fontFamily: "'BM HANNA 11yrs old'",
    textShadow: `2px 2px ${theme.palette.text.disabled}`,
    "&:hover": {
      color: '#ec912d'
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
            AWS DNA 1st Team 3
        </Typography>
          <Typography className={classes.mainHeader} variant="h1" component="h1" gutterBottom>
            만화경 작품 추천 시스템
        </Typography>
          <Typography>
            뭔가 허전해서 넣은 글씨.. 시스템에 대한 설명, 기여한 사람 등의 정보를 넣으면 될 것 같다.
        </Typography>
          <Typography>
            여러 줄로 나눠서
        </Typography>
        </div>
        <TitleListContainer />
        <Copyright />
      </Box>
    </Container>
  );
}
