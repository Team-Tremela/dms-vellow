import { Helmet } from 'react-helmet-async';

import { DealerView } from 'src/sections/dealer/view';

// ----------------------------------------------------------------------

export default function DealerPage() {
  return (
    <>
      <Helmet>
        <title> Dealer | Vellowmotors </title>
      </Helmet>

      <DealerView/>
    </>
  );
}
