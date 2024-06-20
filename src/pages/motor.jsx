import { Helmet } from 'react-helmet-async';

import { MotorView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function MotorPage() {
  return (
    <>
      <Helmet>
        <title> Motor Management | Vellowmotors </title>
      </Helmet>

      <MotorView />
    </>
  );
}
