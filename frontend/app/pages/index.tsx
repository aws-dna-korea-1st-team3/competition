import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';
import useSWR from 'swr'
import { titleApi } from '../src/api';
import { SimpleBackdrop } from '../src/presentation/components';

const Titles: React.FC = () => {
  const { data, error } = useSWR('/titles', titleApi.findAll);
  return <div>{
    data ? JSON.stringify(data) : error ? "error": <SimpleBackdrop />
  }</div>
}

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js with TypeScript example
        </Typography>
        <Link href="/titles?id=1" color="secondary">
          Go to the title #1
        </Link>
        <Titles />
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
