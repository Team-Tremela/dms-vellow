import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const users = [...Array(24)].map((_, index) => ({
  id: faker.string.uuid(),
  modelName: sample([
    "Tesla Model S4",
    "Nissan Leaf",
    "Chevrolet Bolt EV",
    "BMW i3",
    "Audi e-tron",
    "Ford Mustang Mach-E",
    "Hyundai Kona Electric",
    "Porsche Taycan",
    "Kia Soul EV",
    "Volkswagen ID.4",
  ]),
  batteryName: sample([
    "Panasonic 100 kWh",
    "LG Chem 40 kWh",
    "Samsung SDI 66 kWh",
    "BMW 42.2 kWh",
    "Audi 95 kWh",
    "Ford 75.7 kWh",
    "LG Chem 64 kWh",
    "Porsche 93.4 kWh",
    "SK Innovation 64 kWh",
    "Volkswagen 77 kWh",
  ]),
  batteryKWH: sample([
    "100 kWh",
    "40 kWh",
    "66 kWh",
    "42.2 kWh",
    "95 kWh",
    "75.7 kWh",
    "64 kWh",
    "93.4 kWh",
    "64 kWh",
    "77 kWh",
  ]),
  motorName: sample([
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
  colorName: ['#973131', '#E0A75E', '#402E7A', '#F19ED2', '#0C1844'],
  motorkw: sample([
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
