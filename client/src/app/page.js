import { Suspense } from 'react';
import HomeClient from '../components/HomeClient';

export default function Page() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <HomeClient />
    </Suspense>
  );
}
