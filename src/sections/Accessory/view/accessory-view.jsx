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

// import { users } from 'src/_mock/user';
// import { vendor } from 'src/_mock/vendor';
// import { accessory } from 'src/_mock/accessory';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../accessory-empty-rows';
import AccessoryTableRow from '../accessory-table-row';
import AccessoryTableHead from '../accessory-table-head';
import AccessoryTableToolbar from '../accessory-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function AccessoryPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('Name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [accessory, setAccessory] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [Name, setName] = useState('');
  // const [batteryName, setBatteryName] = useState('');
  const [Description, setDescription] = useState('');
  const [VendorID, setVendorID] = useState('');
  const [UnitCost, setUnitCost] = useState('');
  const [LeadTime, setLeadTime] = useState('');
  // const [AccessoryID, setAccessoryID] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const fetchVendors = async () => {
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/vendor/fetch-all');
      const data = await response.json();
      setVendors(data.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  // Define fetchData function
  const fetchData = async () => {
    setLoading(true);
    const apiUrl = 'https://vlmtrs.onrender.com/v1/accessory/fetch-all';
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json(); // Extract error data
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data = await response.json();
      setAccessory(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchVendors();
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
      const newSelecteds = accessory.map((n) => n.accessory_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, accessory_id) => {
    const selectedIndex = selected.indexOf(accessory_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, accessory_id);
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
    inputData: accessory,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setName('');
    // setBatteryName('');
    setDescription('');
    setVendorID('');
    setUnitCost('');
    setLeadTime('');
    // setAccessoryID('');
  };

  const handleAddMotor = async () => {
    const newAccessory = {
      vendor_id: VendorID,
      name: Name,
      description: Description,
      unit_cost: UnitCost,
      lead_time: LeadTime,
    };
    console.log(newAccessory);
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/accessory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAccessory),
      });

      if (!response.ok) {
        throw new Error('Failed to add accessory');
      }

      const data = await response.json();
      console.log('Accessory added successfully:', data);

      // Reset form fields after successful submission
      setName('');
      setVendorID('');
      setDescription('');
      setUnitCost('');
      setLeadTime('');

      // Close modal
      setOpenModal(false);

      // Show success message
      toast.success('Accessory added successfully!');

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
        <Typography variant="h4">Accessory</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenModal}
        >
          Add Accessory
        </Button>
      </Stack>

      <Card>
        <AccessoryTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSuccess={fetchData}
          setSelected={setSelected}
          selected={selected}
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
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <AccessoryTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={accessory.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'AccessoryID', label: 'Accessory Id' },
                      { id: 'Name', label: 'Name' },
                      // { id: 'ContactInformation', label: 'Contact Information' },
                      { id: 'UnitCost', label: 'Unit Cost' },
                      { id: 'Description', label: 'Description' },
                      { id: 'VendorID', label: 'Vendor ID' },
                      { id: 'LeadTime', label: 'Lead Time' },
                      { id: '' },
                    ]}
                    checked={selected.length > 0 && selected.length === accessory.length} // All selected
                    indeterminate={selected.length > 0 && selected.length < accessory.length} // Some selected
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <AccessoryTableRow
                          key={row.id}
                          accessoryID={row.accessory_id}
                          Name={row.name}
                          // batteryName={row.ContactInformation}
                          UnitCost={row.unit_cost}
                          Description={row.description}
                          VendorID={row.vendor_id}
                          LeadTime={row.lead_time}
                          selected={selected.indexOf(row.accessory_id) !== -1}
                          handleClick={(event) => handleClick(event, row.accessory_id)}
                          onUpdateSuccess={fetchData}
                        />
                      ))}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, accessory.length)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={accessory.length}
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
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
            outline: 'none',
          }}
        >
          <Typography variant="h6" id="modal-title">
            Add Accessory
          </Typography>
          <TextField
            fullWidth
            label="Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px', marginTop: '20px' }}
          />
          {/* <TextField
            fullWidth
            label="Battery Name"
            value={batteryName}
            onChange={(e) => setBatteryName(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          /> */}
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
            style={{ marginBottom: '10px' }}
          />
          {/* Vendor ID Dropdown */}
          <Select
            fullWidth
            value={VendorID}
            onChange={(e) => setVendorID(e.target.value)}
            displayEmpty
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
          >
            <MenuItem value="">
              <em>Select Vendor</em>
            </MenuItem>
            {vendors.map((vendor) => (
              <MenuItem key={vendor.vendor_id} value={vendor.vendor_id}>
                {vendor.vendor_id}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Lead Time"
            value={LeadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
          />
          <div style={{ textAlign: 'center' }}>
            <Button variant="contained" color="inherit" onClick={handleAddMotor}>
              Save
            </Button>
          </div>
        </Box>
      </Modal>
      <Toaster />
    </Container>
  );
}
