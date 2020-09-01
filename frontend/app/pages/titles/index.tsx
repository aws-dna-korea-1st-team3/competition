import * as React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { titleApi } from '../../src/api';
import { SimpleBackdrop } from '../../src/presentation/components';
import { Container } from '@material-ui/core';

const TitlePage: NextPage = () => {
  const router = useRouter();
  const id = String(router.query.id);

  const { data, error } = useSWR(`/titles/${id}`, () => titleApi.findById(id))

  return <Container maxWidth="lg">
    <div>
      {data ? JSON.stringify(data) : error ? "error" : <SimpleBackdrop />}
    </div>
  </Container>;
}

export default TitlePage;
