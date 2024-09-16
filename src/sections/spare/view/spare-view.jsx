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

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './Spare.css';
import TableNoData from '../table-no-data';
import SpareTableRow from '../spare-table-row';
import TableEmptyRows from '../spare-empty-rows';
import SpareTableHead from '../spare-table-head';
import SpareTableToolbar from '../spare-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function SparePage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [spare, setSpare] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [Name, setName] = useState('');
  const [Description, setDescription] = useState('');
  const [UnitCost, setUnitCost] = useState('');
  const [LeadTime, setLeadTime] = useState('');
  // const [SpareID, setSpareID] = useState('');
  const [PartNumber, setPartNumber] = useState('');
  const [VendorID, setVendorID] = useState(''); // State for VendorID

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
    const apiUrl = 'https://vlmtrs.onrender.com/v1/spare/fetch-all';
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json(); // Extract error data
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data = await response.json();
      setSpare(data.data);
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
      const newSelecteds = spare.map((n) => n.spare_id);
      setSelected(newSelecteds);
      // return;
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, spare_id) => {
    const selectedIndex = selected.indexOf(spare_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, spare_id);
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
    inputData: spare,
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
    // setSpareID('');
  };

  const handleAddMotor = async () => {
    const newSpare = {
      name: Name,
      description: Description,
      part_number: PartNumber,
      unit_cost: UnitCost,
      lead_time: LeadTime,
      vendor_id: VendorID,
    };

    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/spare/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSpare),
      });

      if (!response.ok) {
        throw new Error('Failed to add spare');
      }

      const data = await response.json();
      console.log('Spare added successfully:', data);

      // Reset form fields after successful submission
      setName('');
      setDescription('');
      setPartNumber('');
      // setSpareID('');
      setUnitCost('');
      // setAddress('');
      setVendorID('');
      setLeadTime('');

      // Close modal
      setOpenModal(false);

      // Show success message
      toast.success('Spare added successfully!');

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
        <Typography variant="h4">Spare</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenModal}
        >
          Add Spare
        </Button>
      </Stack>

      <Card>
        <SpareTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSuccess={fetchData}
          setSelected={setSelected}
          selected={selected}
          tableData={spare}
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
              <TableContainer  sx={{
                  maxHeight: 400, // Set a maximum height for the TableContainer
                  overflowY: 'auto', // Enable vertical scrolling
                }}
                className='custom-scrollbar'>
                <Table sx={{ minWidth: 800 }}>
                  <SpareTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={spare.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'SpareID', label: 'Spare Id' },
                      { id: 'Name', label: 'Name' },
                      { id: 'PartNumber', label: 'Part Number' },
                      { id: 'UnitCost', label: 'Unit Cost' },
                      { id: 'Description', label: 'Description' },
                      { id: 'VendorID', label: 'Vendor ID' },
                      { id: 'LeadTime', label: 'Lead Time' },
                      { id: '' },
                    ]}
                    checked={selected.length > 0 && selected.length === spare.length} // All selected
                    indeterminate={selected.length > 0 && selected.length < spare.length} // Some selected
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <SpareTableRow
                          key={row.id}
                          spareID={row.spare_id}
                          Name={row.name}
                          PartNumber={row.part_number}
                          UnitCost={row.unit_cost}
                          Description={row.description}
                          VendorID={row.vendor_id}
                          LeadTime={row.lead_time}
                          selected={selected.indexOf(row.spare_id) !== -1}
                          handleClick={(event) => handleClick(event, row.spare_id)}
                          onUpdateSuccess={fetchData}
                        />
                      ))}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, spare.length)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={spare.length}
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
            Add Spare
          </Typography>
          {/* <TextField
            fullWidth
            label="Accessory Id"
            value={SpareID}
            onChange={(e) => setSpareID(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px', marginTop: '20px' }}
          /> */}
          {/* Vendor ID Dropdown */}
          <Select
            fullWidth
            value={VendorID}
            onChange={(e) => setVendorID(e.target.value)}
            displayEmpty
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px', marginTop: '20px' }}
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
            label="Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
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
          <TextField
            fullWidth
            label="Part Number"
            value={PartNumber}
            onChange={(e) => setPartNumber(e.target.value)}
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
