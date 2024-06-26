import { Helmet } from 'react-helmet-async';

import { ReportView } from 'src/sections/reports/view';

// ----------------------------------------------------------------------

export default function ReportPage() {
  return (
    <>
      <Helmet>
        <title> Reports | Vellowmotors </title>
      </Helmet>

      <ReportView />
    </>
  );
}
