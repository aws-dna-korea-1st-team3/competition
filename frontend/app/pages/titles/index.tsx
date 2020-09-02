import * as React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { titleApi } from '../../src/api';
import { SimpleBackdrop, SimpleAppBar } from '../../src/presentation/components';
import { Container } from '@material-ui/core';
import { TitleDetailContainer } from '../../src/presentation/container';

const TitlePage: NextPage = () => {
  const router = useRouter();
  const id = String(router.query.id);

  const { data, error } = useSWR(`/titles/${id}`, () => titleApi.findById(id))

  return <div>
    <SimpleAppBar label={data?.name || ""} />
    <Container maxWidth="lg">
      <div>
        {data ? <TitleDetailContainer title={data} /> : error ? "error" : <SimpleBackdrop />}
      </div>
    </Container>
  </div>;
}

export default TitlePage;
