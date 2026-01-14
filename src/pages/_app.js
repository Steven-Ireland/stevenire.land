import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import '../style/index.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title key="title">Steven Ireland - Software Engineer</title>
        <meta name="description" content="Steven Ireland's personal website and portfolio. Software Engineer, Game Developer, and Tech Enthusiast." />
        <meta property="og:title" content="Steven Ireland - Software Engineer" />
        <meta property="og:description" content="Steven Ireland's personal website and portfolio. Software Engineer, Game Developer, and Tech Enthusiast." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
