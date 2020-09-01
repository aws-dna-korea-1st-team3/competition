import * as React from 'react';
import useSWR from "swr";
import { titleApi } from '../../api';
import { SimpleBackdrop } from '../components';
import { TitleList } from '../components/organisms';

const TitleListContainer: React.FC = () => {
  const { data, error } = useSWR('/titles', titleApi.findAll);

  if (!data) {
    return <div>
      {error ? "error" : <SimpleBackdrop />}
    </div>
  }

  return <TitleList titles={data} />
}

export default TitleListContainer;
