import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { themeCreator } from '../src/theme';
import { webfontLoader } from '../src/util';
import { usePersistentDarkModePreference } from '../src/util';
import { ColorModeChangeButton } from '../src/presentation/components';

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
    webfontLoader();
  }, []);


  const [prefersDarkMode, toggleColorMode] =
     usePersistentDarkModePreference("@manhwakyung-recommendation/PREFERS_DARK_MODE");

  const theme = React.useMemo(() => themeCreator(prefersDarkMode), [prefersDarkMode]);

  return (
    <React.Fragment>
      <Head>
        <title>만화경 작품 추천 시스템 :: AWS DNA</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <ColorModeChangeButton isDark={prefersDarkMode} toggle={toggleColorMode} />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}
