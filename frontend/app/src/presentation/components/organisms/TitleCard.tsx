import * as React from 'react';
import { Title } from '../../../types';
import { makeStyles, createStyles, Card, CardContent, Typography } from '@material-ui/core';

const THUMBNAIL_WIDTH = 360;

const useEachTitleStyles = makeStyles(theme => createStyles({
  card: {
    margin: theme.spacing(1),
    "& img": {
      borderRadius: 5
    },
    "-webkit-user-select": "none",
    "-webkit-user-drag": "none",
    "-webkit-app-region": "no-drag",
  },
  thumbnail: {
    width: THUMBNAIL_WIDTH
  },
  titleName: {
    fontFamily: "'BM HANNA 11yrs old'"
  },
  creatorName: {
    fontFamily: "'BM HANNA 11yrs old'",
  },
  titleNameAndCreator: {
    display: 'flex',
    justifyContent: "space-between",
    alignItems: "center",
    "& *": {
      verticalAlign: "middle"
    }
  },
  description: {
    maxWidth: THUMBNAIL_WIDTH
  },
  date: {
    textAlign: "right",
    fontSize: "0.8em",
    marginTop: theme.spacing(0.5),
    marginBottom: -theme.spacing(1.6)
  }
}))

const TitleCard: React.FC<{ title: Title }> = ({ title }) => {
  const classes = useEachTitleStyles();
  const createdAt = new Date(title.createdAt);

  return <div style={{display: 'flex'}}>
    <Card elevation={2} className={classes.card}>
      <CardContent>
        <img draggable="false" className={classes.thumbnail} src={title.thumbnailImageUrl} />
        <div className={classes.titleNameAndCreator}>
          <div>
            <Typography variant="h6" className={classes.titleName}>
              {title.name}
            </Typography>
          </div>
          <div>
            <Typography className={classes.creatorName}>
              <img draggable="false" src={title.creator.profileImageUrl} width={22} />
              <span>{" " + title.creator.name}</span>
            </Typography>
          </div>
        </div>
        <div className={classes.description}>
          {title.description}
        </div>
        <div className={classes.date}>
          {createdAt.getFullYear() + "." + createdAt.getMonth() + "." + createdAt.getDay()}
        </div>
      </CardContent>
    </Card>
  </div>
}

export default TitleCard
