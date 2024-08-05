import { Helmet } from 'react-helmet-async';

import { SpareView } from 'src/sections/spare/view';

// ----------------------------------------------------------------------

export default function AccessoryPage() {
  return (
    <>
      <Helmet>
        <title> Spare | Vellowmotors </title>
      </Helmet>

      <SpareView />
    </>
  );
}
