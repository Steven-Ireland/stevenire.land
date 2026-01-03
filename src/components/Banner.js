import React from 'react';
import Link from 'next/link';

const Banner = () => {
  const title = "Steven Ireland's Blog";

  return (
    <section className="Banner">
      <h1>
        <Link href="/">{title}</Link>
      </h1>
      <h2>
        <Link href="/posts">Posts & Projects</Link>
      </h2>
    </section>
  );
};

export default Banner;
