import * as React from 'react';
import { NextPage } from 'next';
import { SimpleAppBar, TitleList, SimpleBackdrop } from '../src/presentation/components';
import { Container, Typography, makeStyles, createStyles } from '@material-ui/core';
import { titleApi } from '../src/api';
import useSWR from 'swr';

const username = "cce93dce-b13a-4cd3-9380-008d48e6a53c"

const useStyles = makeStyles(theme => createStyles({
  subtitle: {
    fontFamily: "'BM HANNA 11yrs old'",
    textAlign: "center",
    marginTop: theme.spacing(2)
  },
  titleListContainer: {
    marginTop: theme.spacing(3)
  }
}))

const MyPage: NextPage = () => {
  const classes = useStyles();

  const {data, error} = useSWR(`/recommended-titles/by-user/${username}`, () => titleApi.getRecommendationByUsername(username))

  return <>
    <SimpleAppBar label={"마이페이지"} />
    <Container maxWidth="lg">
      <Typography variant="h6" component="h6" className={classes.subtitle}>
        username: {username}
      </Typography>
      <Typography variant="h4" component="h4" className={classes.subtitle}>
        좋아할만한 작품을 모아봤어요.
      </Typography>
      <div className={classes.titleListContainer}>
        {data
          ? <TitleList titles={data} />
          : error ? "error" : <SimpleBackdrop />}
      </div>
    </Container>
  </>
}

export default MyPage;
