import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const accessory = [...Array(25)].map((_, index) => ({
  id: faker.string.uuid(),
  serviceID: faker.string.uuid(),
  vehicleID: faker.string.uuid(),
  serviceDate: sample([
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
  Cost: sample([
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
  dealerID: faker.string.uuid(),
}));
