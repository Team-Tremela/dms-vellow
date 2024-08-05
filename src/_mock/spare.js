import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const spare = [...Array(25)].map((_, index) => ({
  id: faker.string.uuid(),
  SpareID: faker.string.uuid(),
  partNumber: sample([
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
  UnitCost: faker.commerce.price(),
  Description: faker.commerce.productDescription(),
  VendorID: faker.string.uuid(),
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
