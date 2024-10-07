import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// import Iconify from 'src/components/iconify';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// import AppTasks from '../app-tasks';
// import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
// import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const [loading, setLoading] = useState(true); // Add loading state
  const [vechicles, setVechicles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [dealers, setdealers] = useState([]);
  const [parts, setParts] = useState([]);
  const [service, setService] = useState([]);

  const fetchParts = async () => {
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/spare/fetch-all'); // replace with your API endpoint
      const data = await response.json();
      // Check if data is undefined or if data.data is not an array
      if (!data || !Array.isArray(data.data)) {
        setParts([]); // Set dealers to an empty array
      } else {
        setParts(data.data); // Set dealers to the fetched data
      }
    } catch (error) {
      console.error('Error fetching parts:', error);
    }
  };
  // Define fetchData function
  const fetchData = async () => {
    setLoading(true);
    const apiUrl = 'https://vlmtrs.onrender.com/v1/vehicle/fetch-all';
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json(); // Extract error data
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data = await response.json();
      setVechicles(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };
  const fetchDealers = async () => {
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/dealer/fetch-all');
      const data = await response.json();
      // Check if data is undefined or if data.data is not an array
      if (!data || !Array.isArray(data.data)) {
        setdealers([]); // Set dealers to an empty array
      } else {
        setdealers(data.data); // Set dealers to the fetched data
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };
  const fetchService = async () => {
    setLoading(true);
    const apiUrl = 'https://vlmtrs.onrender.com/v1/service/fetch-all';
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json(); // Extract error data
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data = await response.json();
      setService(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchDealers();
    fetchParts();
    fetchService();
  }, []);

  const totalVehicle = vechicles.length;
  const totalDealers = dealers.length;
  const totalParts = parts.length;
  const totalService = service.length;

  return (
    <>
      {loading ? ( // Show loader if data is still being fetched
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          {errorMessage ? (
            <Typography color="error">{errorMessage}</Typography> // Error message
          ) : (
            <CircularProgress /> // Loader
          )}
        </Box>
      ) : (
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Hi, Welcome back 👋
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Total Vehicle"
                total={(totalVehicle <=0)? "No vechile" : totalVehicle}
                color="success"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_sc.png" />}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="New Dealers"
                total={(totalDealers <= 0)? "No dealer" : totalDealers}
                color="info"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_userss.png" />}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Parts available"
                total={(totalParts <= 0)? "No Parts" : totalParts}
                color="warning"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_cart.png" />}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Service's Booked"
                total={(totalService <= 0)? "no Service" : totalService}
                color="error"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_service.png" />}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={12}>
              <AppWebsiteVisits
                title="Current sales"
                subheader="(+43%) than last year"
                chart={{
                  labels: [
                    '01/01/2003',
                    '02/01/2003',
                    '03/01/2003',
                    '04/01/2003',
                    '05/01/2003',
                    '06/01/2003',
                    '07/01/2003',
                    '08/01/2003',
                    '09/01/2003',
                    '10/01/2003',
                    '11/01/2003',
                  ],
                  series: [
                    {
                      name: 'Sales',
                      type: 'column',
                      fill: 'solid',
                      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                    },
                    {
                      name: 'Model X',
                      type: 'area',
                      fill: 'gradient',
                      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                    },
                    {
                      name: 'Model Y',
                      type: 'line',
                      fill: 'solid',
                      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                    },
                  ],
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AppCurrentVisits
                title="Market coverage"
                chart={{
                  series: [
                    { label: 'Bhubaneswar', value: 4344 },
                    { label: 'Cuttack', value: 5435 },
                    { label: 'Puri', value: 1443 },
                    { label: 'Rourkela', value: 4443 },
                  ],
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AppCurrentSubject
                title="Bottom Line"
                chart={{
                  categories: ['Vechile','Dealer','Vendor', 'Accessory', 'Parts', 'Service'],
                  series: [
                    { name: 'Total', data: [80, 50, 30, 40, 100, 20] },
                    { name: 'Profit', data: [20, 30, 40, 80, 20, 80] },
                    { name: 'Loss', data: [44, 76, 78, 13, 43, 10] },
                  ],
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AppOrderTimeline
                title="Service Timeline"
                list={[...Array(5)].map((_, index) => ({
                  id: faker.string.uuid(),
                  title: [
                    '1983, orders, $4220',
                    '12 Invoices have been paid',
                    'Order #37745 from September',
                    'New order placed #XF-2356',
                    'New order placed #XF-2346',
                  ][index],
                  type: `order${index + 1}`,
                  time: faker.date.past(),
                }))}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={12}>
              <AppConversionRates
                title="Distribution"
                subheader="(+43%) than last year"
                chart={{
                  series: [
                    { label: 'Angul', value: 400 },
                    { label: 'Damana', value: 430 },
                    { label: 'Saheed Nagar', value: 448 },
                    { label: 'Old Town', value: 470 },
                    { label: 'Chauliaganj', value: 540 },
                    { label: 'Ranihat', value: 580 },
                    { label: 'Badambadi', value: 690 },
                  ],
                }}
              />
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}
