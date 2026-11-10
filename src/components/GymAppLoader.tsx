'use client';

import dynamic from 'next/dynamic';

// The app depends on the current date/time and random live activity,
// so it renders on the client only (avoids hydration mismatches).
const GymApp = dynamic(() => import('./GymApp'), { ssr: false });

export default function GymAppLoader() {
  return <GymApp />;
}
