import { createStyles, makeStyles } from '@material-ui/core';
import * as React from 'react';
import { Title } from '../../../types';
import TitleCard from './TitleCard';
import Link from '../../../Link';

interface Props {
  titles: Title[]
}

const useTitleListStyles = makeStyles(theme => createStyles({
  listContainer: {
    display: 'flex',
    flexWrap: "wrap",
    justifyContent: "center",
    margin: `${theme.spacing(5)}px 0`
  },
  link: {
    "&:hover": {
      opacity: 0.7,
      cursor: 'pointer',
    },
  }
}))

const TitleList: React.FC<Props> = ({ titles }) => {
  const classes = useTitleListStyles();
  return <div className={classes.listContainer}>{
    titles.map(title =>
      <Link href={`/titles?id=${title.id}`} underline="none" className={classes.link}>
        <TitleCard key={title.id} title={title} />
      </Link>
    )
  }</div>
}

export default TitleList;
