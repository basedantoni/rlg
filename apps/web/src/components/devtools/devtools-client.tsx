'use client';

import dynamic from 'next/dynamic';

const ReactQueryDevtools = dynamic(
  () =>
    process.env.NODE_ENV === 'development'
      ? import('@tanstack/react-query-devtools').then(
          (mod) => mod.ReactQueryDevtools
        )
      : Promise.resolve(() => null),
  { ssr: false }
);

export default function DevtoolsClient() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <ReactQueryDevtools initialIsOpen={false} />;
}
