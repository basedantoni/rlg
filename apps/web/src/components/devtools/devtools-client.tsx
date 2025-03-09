'use client';

import dynamic from 'next/dynamic';

const DevTool = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(
      (mod) => mod.ReactQueryDevtools
    ),
  {
    ssr: false,
  }
);

export default function DevtoolsClient() {
  // Only render in development.
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  return <DevTool />;
}
