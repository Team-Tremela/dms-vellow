import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
// import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select'; // Import Select component
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem component
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { service } from 'src/_mock/service';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './Service.css';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../service-empty-rows';
import ServiceTableRow from '../service-table-row';
import ServiceTableHead from '../service-table-head';
import ServiceTableToolbar from '../service-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
// import { vechicles } from 'src/_mock/vechicles';

// ----------------------------------------------------------------------

export default function ServicePage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('Name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [service, setService] = useState([]);
  const [dealers, setdealers] = useState([]);
  const [vechicles, setvechicles] = useState([]);

  // const [Name, setName] = useState('');
  const [VechicleID, setVechicleId] = useState('');
  const [ServiceDate, setServiceDate] = useState('');
  // const [batteryName, setBatteryName] = useState('');
  const [Description, setDescription] = useState('');
  const [DealerID, setDealerID] = useState('');
  const [UnitCost, setUnitCost] = useState('');
  // const [LeadTime, setLeadTime] = useState('');
  // const [ServiceID, setServiceID] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const fetchDealers = async () => {
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/dealer/fetch-all');
      const data = await response.json();
      setdealers(data.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchVechicle = async () => {
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/vehicle/fetch-all');
      const data = await response.json();
      setvechicles(data.data);
    } catch (error) {
      console.error('Error fetching vechicles:', error);
    }
  };

  // Define fetchData function
  const fetchData = async () => {
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
    fetchVechicle();
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = service.map((n) => n.service_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, service_id) => {
    const selectedIndex = selected.indexOf(service_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, service_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // const dataFiltered = applyFilter({
  //   inputData: users,
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  // });
  const dataFiltered = applyFilter({
    inputData: service,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // setName('');
    // setBatteryName('');
    setServiceDate('');
    setVechicleId('');
    setDescription('');
    setDealerID('');
    setUnitCost('');
    // setLeadTime('');
    // setServiceID('');
  };

  const handleAddMotor = async () => {
    const newService = {
      dealer_id: DealerID,
      vehicle_id: VechicleID,
      service_date: ServiceDate,
      description: Description,
      cost: UnitCost,
    };
    console.log(newService);
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/service/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });

      if (!response.ok) {
        throw new Error('Failed to add service');
      }

      const data = await response.json();
      console.log('Service added successfully:', data);

      // Reset form fields after successful submission
      setVechicleId('');
      setDealerID('');
      setDescription('');
      setUnitCost('');
      setServiceDate('');

      // Close modal
      setOpenModal(false);

      // Show success message
      toast.success('Service added successfully!');

      // Optionally, fetch the updated vendor list to reflect the new vendor in the table
      fetchData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Service</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenModal}
        >
          Add Service
        </Button>
      </Stack>

      <Card>
        <ServiceTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSuccess={fetchData}
          setSelected={setSelected}
          selected={selected}
          tableData={service}
        />

        {loading ? ( // Show loader if data is still being fetched
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            {errorMessage ? (
              <Typography color="error">{errorMessage}</Typography> // Error message
            ) : (
              <CircularProgress /> // Loader
            )}
          </Box>
        ) : (
          <>
            <Scrollbar>
              <TableContainer
                sx={{
                  maxHeight: 400, // Set a maximum height for the TableContainer
                  overflowY: 'auto', // Enable vertical scrolling
                }}
                className="custom-scrollbar"
              >
                <Table sx={{ minWidth: 800 }}>
                  <ServiceTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={service.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'ServiceID', label: 'Service Id' },
                      { id: 'VehicleID', label: 'Vechicle Id' },
                      { id: 'ServiceDate', label: 'Sevice Date' },
                      // { id: 'ContactInformation', label: 'Contact Information' },
                      { id: 'Description', label: 'Description' },
                      { id: 'Cost', label: 'Cost' },
                      { id: 'DealerID', label: 'Dealer ID' },
                      { id: 'CreatedAt', label: 'Created At' },
                      { id: 'UpdatedAt', label: 'Updated At' },
                      { id: '' },
                    ]}
                    checked={selected.length > 0 && selected.length === service.length} // All selected
                    indeterminate={selected.length > 0 && selected.length < service.length} // Some selected
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <ServiceTableRow
                          key={row.id}
                          ServiceID={row.service_id}
                          // Name={row.Name}
                          // batteryName={row.ContactInformation}
                          VehicleID={row.vehicle_id}
                          ServiceDate={row.service_date}
                          Description={row.description}
                          UnitCost={row.cost}
                          DealerID={row.dealer_id}
                          CreatedAt={row.createdAt}
                          UpdatedAt={row.updatedAt}
                          selected={selected.indexOf(row.service_id) !== -1}
                          handleClick={(event) => handleClick(event, row.service_id)}
                          onUpdateSuccess={fetchData}
                        />
                      ))}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, service.length)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={service.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Card>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 800,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 1,
              outline: 'none',
            }}
          >
            <Typography variant="h6" id="modal-title">
              Add Service
            </Typography>
            <div className="SModal-style">
              <div className="SModal-inner-left">
                <Select
                  fullWidth
                  value={DealerID}
                  onChange={(e) => setDealerID(e.target.value)}
                  displayEmpty
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px', marginTop: '20px' }}
                >
                  <MenuItem value="">
                    <em>Select Dealer</em>
                  </MenuItem>
                  {dealers.map((dealer) => (
                    <MenuItem key={dealer.dealer_id} value={dealer.dealer_id}>
                      {dealer.dealer_id}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  fullWidth
                  value={VechicleID}
                  onChange={(e) => setVechicleId(e.target.value)}
                  displayEmpty
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                >
                  <MenuItem value="">
                    <em>Select Vechicle</em>
                  </MenuItem>
                  {vechicles.map((vechicle) => (
                    <MenuItem key={vechicle.vehicle_id} value={vechicle.vehicle_id}>
                      {vechicle.vehicle_id}
                    </MenuItem>
                  ))}
                </Select>
                {/* <TextField
                fullWidth
                label="Service Id"
                value={ServiceID}
                onChange={(e) => setServiceID(e.target.value)}
                variant="outlined"
                mb={2}
                style={{ marginBottom: '10px' }}
              /> */}
                {/* <TextField
                fullWidth
                label="Name"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                mb={2}
                style={{ marginBottom: '10px', marginTop: '20px' }}
              /> */}
                <DesktopDatePicker
                  label="Service Date"
                  inputFormat="YYYY-MM-DD"
                  value={ServiceDate ? dayjs(ServiceDate) : null} // Format it to dayjs object
                  onChange={(newValue) =>
                    setServiceDate(newValue ? newValue.format('YYYY-MM-DD') : '')
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      mb={2}
                      style={{ marginBottom: '10px' }}
                    />
                  )}
                />
                <div style={{ marginTop: '10px' }}> </div>
              </div>
              <div className="SModal-inner-right">
                <TextField
                  fullWidth
                  label="Unit Cost"
                  value={UnitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="outlined"
                  mb={2}
                  multiline
                  rows={4} // Number of rows for the textarea
                  style={{ marginBottom: '10px' }}
                />
                {/* <TextField
                fullWidth
                label="Dealer Id"
                value={DealerID}
                onChange={(e) => setDealerID(e.target.value)}
                variant="outlined"
                mb={2}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                fullWidth
                label="Lead Time"
                value={LeadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                variant="outlined"
                mb={2}
                style={{ marginBottom: '10px' }}
              /> */}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button variant="contained" color="inherit" onClick={handleAddMotor}>
                Save
              </Button>
            </div>
          </Box>
        </LocalizationProvider>
      </Modal>
      <Toaster />
    </Container>
  );
}
