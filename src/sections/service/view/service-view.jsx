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
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem component
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
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
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../service-empty-rows';
import ServiceTableRow from '../service-table-row';
import ServiceTableHead from '../service-table-head';
import ServiceTableToolbar from '../service-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
// import { vechicles } from 'src/_mock/vechicles';

// ----------------------------------------------------------------------

export default function ServicePage() {
  const [totalPartsCost, setTotalPartsCost] = useState(0);
  const [parts, setParts] = useState([]);
  // const [selectedParts, setSelectedParts] = useState([]);
  // const [selectedPart, setSelectedPart] = useState('');
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
  const [Registrationno, setRegistrationno] = useState('');
  const [File, setFile] = useState('');
  const [Discopunt, setDiscount] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [selectedPartsArray, setSelectedPartsArray] = useState([]);

  const selctedarrayvalue = Array.isArray(selectedPartsArray)
    ? selectedPartsArray
    : [selectedPartsArray];

  console.log(typeof selectedPartsArray);

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

  const handleAddPart = () => {
    // Calculate the total cost from the selected parts
    const newTotal = selectedPartsArray.reduce((acc, part) => acc + parseFloat(part.unit_cost), 0); // Use selectedPartsArray
    setTotalPartsCost(newTotal); // Update total cost
    // Optionally, you might want to clear selectedPart after adding
    // setSelectedPart(null);
  };

  // Create a variable to convert selectedPart to an array
  // const selectedPartsArray = Array.isArray(selectedPart) ? selectedPart : [selectedPart];

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

  const fetchVechicle = async () => {
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/vehicle/fetch-all');
      const data = await response.json();
      // Check if data is undefined or if data.data is not an array
      if (!data || !Array.isArray(data.data)) {
        setvechicles([]); // Set dealers to an empty array
      } else {
        setvechicles(data.data); // Set dealers to the fetched data
      }
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
    fetchParts();
    setUnitCost(totalPartsCost);
  }, [totalPartsCost]);

  const validateFields = () => {
    // Regular expressions for validation
    const idPattern = /^[a-zA-Z0-9_]+$/; // Only letters and numbers
    const registrationPattern = /^[A-Za-z0-9]+$/; // Letters and numbers for registration no
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Date format YYYY-MM-DD
    const textPattern = /^[A-Za-z\s]+$/; // Only letters and spaces for text fields

    const currentDate = dayjs().format('YYYY-MM-DD');

    // Dealer ID Validation
    if (!DealerID) {
      toast.error('Please select a dealer');
      return false;
    }
    if (!idPattern.test(DealerID)) {
      toast.error('Dealer ID must be a combination of letters and numbers');
      return false;
    }

    // Vehicle ID Validation
    if (!VechicleID) {
      toast.error('Please select a vehicle');
      return false;
    }
    if (!idPattern.test(VechicleID)) {
      toast.error('Vehicle ID must be a combination of letters and numbers');
      return false;
    }

    // Registration number validation
    if (!Registrationno) {
      toast.error('Please enter registration number');
      return false;
    }
    if (!registrationPattern.test(Registrationno)) {
      toast.error('Registration number should contain only letters and numbers');
      return false;
    }

    // Service Date validation
    if (!ServiceDate) {
      toast.error('Please select a service date');
      return false;
    }
    if (!datePattern.test(ServiceDate)) {
      toast.error('Service date must be in YYYY-MM-DD format');
      return false;
    }
    if (dayjs(ServiceDate).isBefore(currentDate)) {
      toast.error('Service date cannot be in the past. Please select today or a future date.');
      return false;
    }

    // Selected Parts Validation
    if (selectedPartsArray.length === 0) {
      toast.error('Please select at least one part');
      return false;
    }

    // Unit Cost validation
    if (!totalPartsCost) {
      toast.error('Unit cost is required');
      return false;
    }

    // Description validation
    if (!Description) {
      toast.error('Please enter a description');
      return false;
    }
    if (!textPattern.test(Description)) {
      toast.error('Description should contain only letters and spaces');
      return false;
    }

    return true;
  };

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
    inputData: service || [],
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
    setDiscount('');
    setFile('');
    setDealerID('');
    setUnitCost('');
    setTotalPartsCost('');
    // setSelectedPart('');
    setSelectedPartsArray([]);
    setRegistrationno('');
    // setLeadTime('');
    // setServiceID('');
  };

  const handleAddMotor = async () => {
    const newService = {
      dealer_id: DealerID,
      vehicle_id: VechicleID,
      service_date: ServiceDate,
      description: Description,
      doc: File,
      registration_no: Registrationno,
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
      setDiscount('');
      setFile('');
      setUnitCost('');
      setServiceDate('');
      setTotalPartsCost('');
      // setSelectedPart('');
      setSelectedPartsArray([]);
      setRegistrationno('');

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

  const handleSubmit = () => {
    if (validateFields()) {
      handleAddMotor(); // Call the function only if validation passes
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
                    rowCount={service?.length || 0}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'ServiceID', label: 'Service Id' },
                      { id: 'VehicleID', label: 'Vechicle Id' },
                      { id: 'RegistrationNo', label: 'Registration no' },
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
                    {service === undefined || service.length === 0 ? ( // Check if there are no vehicles
                      <TableRow>
                        <TableCell colSpan={13} align="center">
                          {' '}
                          {/* Adjust colSpan based on your table structure */}
                          <Typography variant="body1">
                            There is no data available in the Service database
                          </Typography>
                          <Typography variant="h6">No data available</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <ServiceTableRow
                            key={row.id}
                            ServiceID={row.service_id}
                            // Name={row.Name}
                            // batteryName={row.ContactInformation}
                            VehicleID={row.vehicle_id}
                            Registrationno={row.registration_no}
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
                        ))
                    )}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, service?.length || 0)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={service?.length || 0}
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
              width: 1400,
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
                <TextField
                  fullWidth
                  label="Registration no"
                  value={Registrationno}
                  onChange={(e) => setRegistrationno(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
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
                {/* Select Part */}
                <Autocomplete
                  multiple
                  options={parts}
                  disableCloseOnSelect
                  getOptionLabel={(part) => `${part.name} - ₹${part.unit_cost}`}
                  value={selctedarrayvalue} // Use selectedPartsArray for value
                  onChange={(event, newValue) => {
                    console.log('Selected Parts:', newValue);
                    setSelectedPartsArray(newValue); // Update the selected parts correctly
                  }}
                  renderOption={(props, part) => {
                    const isSelected = selectedPartsArray.some(
                      (selectedd) => selectedd.id === part.id
                    ); // Adjust based on your part's unique identifier
                    return (
                      <li {...props}>
                        <Checkbox checked={isSelected} style={{ marginRight: 8 }} />
                        {part.name} - ₹{part.unit_cost}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Part" variant="outlined" fullWidth />
                  )}
                  style={{ marginBottom: '10px' }}
                />

                <Button color="primary" onClick={handleAddPart}>
                  Add parts &nbsp;
                  <Iconify icon="eva:plus-circle-fill" />
                </Button>
                {/* Add Part Button
                <IconButton color="primary" onClick={handleAddPart}>
                  <Iconify icon="eva:plus-circle-fill" /> Add
                </IconButton> */}
              </div>

              <div className="SModal-inner-right">
                <TextField
                  fullWidth
                  disabled
                  className="cs-cost"
                  label="Unit Cost"
                  value={totalPartsCost}
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
                <TextField
                  fullWidth
                  label="Discount"
                  value={Discopunt}
                  onChange={(e) => setDiscount(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
                <TextField
                  fullWidth
                  value={File}
                  onChange={(e) => setFile(e.target.value)}
                  // variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                  type="file"
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
              <Button variant="contained" color="inherit" onClick={handleSubmit}>
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
