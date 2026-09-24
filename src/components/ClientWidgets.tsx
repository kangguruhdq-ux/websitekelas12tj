'use client';

import dynamic from 'next/dynamic';

const InteractivePetBot = dynamic(() => import('@/components/InteractivePetBot'), { ssr: false });
const TerminalModal = dynamic(() => import('@/components/TerminalModal'), { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <InteractivePetBot />
      <TerminalModal />
    </>
  );
}
