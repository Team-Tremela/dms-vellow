import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const vechicles = [...Array(24)].map((_, index) => ({
  id: faker.string.uuid(),
  vechicleID: faker.string.uuid(),
  modelName: faker.vehicle.bicycle(),
  VIN: faker.string.uuid(),
  vendorID: sample([
    "Dual Electric Motor",
    "Single Electric Motor",
    "Single Electric Motor",
    "Single Electric Motor",
    "Dual Electric Motor",
    "Dual Electric Motor",
    "Single Electric Motor",
    "Dual Electric Motor",
    "Single Electric Motor",
    "Single Electric Motor",
  ]),
  chassisNo: faker.string.uuid(),
  motorNo: faker.string.uuid(),
  batteryNo: faker.string.uuid(),
  colorCode: ['#973131', '#E0A75E', '#402E7A', '#F19ED2', '#0C1844'],
  mfgDate: sample([
    "150 kW",
    "250 kW",
    "350 kW",
    "450 kW",
    "550 kW",
    "650 kW",
    "750 kW",
    "850 kW",
    "950 kW",
    "1050 kW"
  ]),
  unitCost: faker.commerce.price(),
  barCode: sample([
    "150 kW",
    "250 kW",
    "350 kW",
    "450 kW",
    "550 kW",
    "650 kW",
    "750 kW",
    "850 kW",
    "950 kW",
    "1050 kW"
  ]),
}));
