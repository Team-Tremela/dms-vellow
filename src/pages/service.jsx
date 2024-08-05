import { Helmet } from 'react-helmet-async';

import { ServiceView } from 'src/sections/service/view';

// ----------------------------------------------------------------------

export default function AccessoryPage() {
  return (
    <>
      <Helmet>
        <title> Service | Vellowmotors </title>
      </Helmet>

      <ServiceView />
    </>
  );
}
