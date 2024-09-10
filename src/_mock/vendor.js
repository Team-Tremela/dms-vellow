// import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------
const apiUrl = 'https://vlmtrs.onrender.com/v1/vendor/fetch-all';

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data; // Assuming `data.data` is an array of vendor objects
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array if there's an error
  }
}

const apiData = await fetchData();

// const length = apiData.length();

export const vendor = [...Array(25)].map((_, index) => ({
  id: faker.string.uuid(),
  VendorID: apiData.length > 0 ? apiData[0].vendor_id : 'Default Vendor',
  BatchNo: apiData.length > 0 ? apiData[0].batch_no : 'Default Vendor',
  Name: apiData.length > 0 ? apiData[0].name : 'Default Vendor',
  Address: apiData.length > 0 ? apiData[0].address : 'Default Vendor',
  Email: apiData.length > 0 ? apiData[0].email : 'Default Vendor',
  PhoneNumber: apiData.length > 0 ? apiData[0].phone_no : 'Default Vendor',
}));
