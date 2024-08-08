import { Helmet } from 'react-helmet-async';

import { VechiclesView } from 'src/sections/vechicles/view';

// ----------------------------------------------------------------------

export default function DealerPage() {
  return (
    <>
      <Helmet>
        <title> Vechicles | Vellowmotors </title>
      </Helmet>

      <VechiclesView/>
    </>
  );
}
