import * as React from 'react';
import { Title } from '../../../types';
import { makeStyles, createStyles, Card, CardContent, Typography } from '@material-ui/core';
import Link from '../../../Link';

interface Props {
  titles: Title[]
}

const THUMBNAIL_WIDTH = 360;

const useTitleListStyles = makeStyles(theme => createStyles({
  listContainer: {
    display: 'flex',
    flexWrap: "wrap",
    justifyContent: "center",
    margin: `${theme.spacing(5)}px 0`
  }
}))

const useEachTitleStyles = makeStyles(theme => createStyles({
  card: {
    margin: theme.spacing(1),
    "&:hover": {
      opacity: 0.7,
      cursor: 'pointer',
    },
    "& img": {
      borderRadius: 5
    }
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

const EachTitle: React.FC<{ title: Title }> = ({ title }) => {
  const classes = useEachTitleStyles();
  const createdAt = new Date(title.createdAt);

  return <div>
    <Link href={`/titles?id=${title.id}`} underline="none">
      <Card elevation={2} className={classes.card}>
        <CardContent>
          <img className={classes.thumbnail} src={title.thumbnailImageUrl} />
          <div className={classes.titleNameAndCreator}>
            <div>
              <Typography variant="h6" className={classes.titleName}>
                {title.name}
              </Typography>
            </div>
            <div>
              <Typography className={classes.creatorName}>
                <img src={title.creator.profileImageUrl} width={22} />
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
    </Link>
  </div>
}

const TitleList: React.FC<Props> = ({ titles }) => {
  const classes = useTitleListStyles();
  return <div className={classes.listContainer}>{
    titles.map(title => <EachTitle key={title.id} title={title} />)
  }</div>
}

export default TitleList;
