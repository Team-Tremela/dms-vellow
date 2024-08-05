import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const accessory = [...Array(25)].map((_, index) => ({
  id: faker.string.uuid(),
  dealerID: faker.string.uuid(),
  Name: sample([
    "Alice Johnson",
    "Bob Smith",
    "Carol Williams",
    "David Brown",
    "Eve Davis",
    "Frank Miller",
    "Grace Wilson",
    "Hank Taylor",
    "Ivy Anderson",
    "Jack Thompson",
  ]),
  UnitCost: sample([
    "123 Main St, Anytown, USA",
    "456 Elm St, Othertown, USA",
    "789 Oak St, Somewhere, USA",
    "101 Maple St, Anytown, USA",
    "202 Pine St, Othertown, USA",
    "303 Cedar St, Somewhere, USA",
    "404 Birch St, Anytown, USA",
    "505 Spruce St, Othertown, USA",
    "606 Willow St, Somewhere, USA",
    "707 Aspen St, Anytown, USA",
  ]),
  Description: sample([
    "john.doe@example.com",
    "jane.smith@example.com",
    "alice.johnson@example.com",
    "bob.brown@example.com",
    "carol.white@example.com",
    "david.green@example.com",
    "emily.black@example.com",
    "frank.gray@example.com",
    "grace.davis@example.com",
    "henry.wilson@example.com",
  ]),
  VendorID: sample([
    "A265D7V",
    "G356F47",
    "HJA5658",
    "V56GH67",
    "GVA7856",
    "JHA1342",
    "VS2345S",
    "K466GSG",
    "ZVA314F",
    "AA17S68",
  ]),
  LeadTime: sample([
    "123-456-7890",
    "234-567-8901",
    "345-678-9012",
    "456-789-0123",
    "567-890-1234",
    "678-901-2345",
    "789-012-3456",
    "890-123-4567",
    "901-234-5678",
    "012-345-6789"
  ]),
}));
