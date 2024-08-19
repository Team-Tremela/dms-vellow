import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const service = [...Array(25)].map((_, index) => ({
  id: faker.string.uuid(),
  ServiceID: faker.string.uuid(),
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
  VehicleID: faker.string.uuid(),
  ServiceDate: faker.string.uuid(),
  UnitCost: faker.commerce.price(),
  Description: faker.commerce.productDescription(),
  DealerID: faker.string.uuid(),
}));
