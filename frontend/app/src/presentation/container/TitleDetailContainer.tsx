import * as React from 'react';
import { Title } from '../../types';
import { TitleCard, TitleList } from '../components';
import { makeStyles, createStyles, Typography, CircularProgress } from '@material-ui/core';
import useSWR from 'swr';
import { titleApi } from '../../api';

const useStyles = makeStyles(theme => createStyles({
  root: {
    marginTop: theme.spacing(2)
  },
  cardWrapper: {
    cursor: 'default',
    display: 'flex',
    justifyContent: 'center'
  },
  recommendation: {
    fontFamily: "'BM HANNA 11yrs old'",
    textAlign: "center",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    cursor: "default",
    "-webkit-user-select": "none",
    "-webkit-user-drag": "none",
    "-webkit-app-region": "no-drag",
  },
  titleContainer: {
    display: 'flex',
    justifyContent: "center",
  }
}))

interface Props {
  title: Title
}
 
const TitleDetailContainer: React.FC<Props> = ({title}) => {
  const classes = useStyles();

  const {data: recommendedTitles, error} = useSWR(
    `/recommended-titles/by-title/${title.id}`,
    () => titleApi.getRecommendationByTitleId(String(title.id)));

  return <div className={classes.root}>
    <div className={classes.cardWrapper}>
      <TitleCard title={title} />
    </div>
    <Typography variant="h4" className={classes.recommendation}>
      이 작품이 좋다면?
    </Typography>
    <div className={classes.titleContainer}>
      {recommendedTitles
      ? <TitleList titles={recommendedTitles} />
      : error ? "error" : <CircularProgress color="inherit" />}
    </div>
  </div>;
}
 
export default TitleDetailContainer;
