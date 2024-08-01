import { Helmet } from 'react-helmet-async';

import { MotorView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function MotorPage() {
  return (
    <>
      <Helmet>
        <title> Vendor | Vellowmotors </title>
      </Helmet>

      <MotorView />
    </>
  );
}
