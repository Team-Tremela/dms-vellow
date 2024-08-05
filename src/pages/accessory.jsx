import { Helmet } from 'react-helmet-async';

import { AccessoryView } from 'src/sections/Accessory/view';

// ----------------------------------------------------------------------

export default function AccessoryPage() {
  return (
    <>
      <Helmet>
        <title> Accessory | Vellowmotors </title>
      </Helmet>

      <AccessoryView />
    </>
  );
}
