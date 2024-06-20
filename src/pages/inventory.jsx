import { Helmet } from 'react-helmet-async';

import { InventortyView } from 'src/sections/inventory/view';

// ----------------------------------------------------------------------

export default function InventoryPage() {
  return (
    <>
      <Helmet>
        <title> Inventory | Vellowmotors </title>
      </Helmet>

      <InventortyView />
    </>
  );
}
