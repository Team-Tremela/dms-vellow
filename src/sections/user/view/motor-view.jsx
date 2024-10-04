import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
// import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

// import { users } from 'src/_mock/user';
// import { vendor } from 'src/_mock/vendor';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './Vendor.css';
import TableNoData from '../table-no-data';
import UserTableRow from '../motor-table-row';
import UserTableHead from '../motor-table-head';
import TableEmptyRows from '../motor-empty-rows';
import UserTableToolbar from '../motor-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function MotorPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [vendor, setVendor] = useState([]);

  const [Name, setName] = useState('');
  // const [batteryName, setBatteryName] = useState('');
  const [Email, setEmail] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Address, setAddress] = useState('');
  const [GST, setGST] = useState('');
  const [Aadharcard, setAadharcard] = useState('');
  const [PAN, setPAN] = useState('');
  // const [VendorID, setVendorID] = useState('');
  // const [BatchNo, setBatchNo] = useState('');
  // const [colors, setColors] = useState('');

  // Snackbar state for error message
  const [errorMessage, setErrorMessage] = useState('');

  // Define fetchData function
  const fetchData = async () => {
    setLoading(true);
    const apiUrl = 'https://vlmtrs.onrender.com/v1/vendor/fetch-all';
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json(); // Extract error data
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data = await response.json();
      setVendor(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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
      const newSelecteds = vendor.map((n) => n.vendor_id);
      setSelected(newSelecteds);
      // return;
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, vendor_id) => {
    const selectedIndex = selected.indexOf(vendor_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, vendor_id);
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
    inputData: vendor || [],
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
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setGST('');
    setAadharcard('');
    setPAN('');
    // setVendorID('');
    // setBatchNo('');
    // setColors('');
  };

  const handleAddMotor = async () => {
    const newVendor = {
      name: Name,
      address: Address,
      email: Email,
      phone_no: PhoneNumber,
      // batch_no: BatchNo,
      gst: GST,
      aadhar_card: Aadharcard,
      pan: PAN,
    };

    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/vendor/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVendor),
      });

      if (!response.ok) {
        throw new Error('Failed to add vendor');
      }

      const data = await response.json();
      console.log('Vendor added successfully:', data);

      // Reset form fields after successful submission
      setName('');
      setEmail('');
      setPhoneNumber('');
      setAddress('');
      // setVendorID('');
      // setBatchNo('');
      setGST('');
      setAadharcard('');
      setPAN('');

      // Close modal
      setOpenModal(false);

      // Show success message
      toast.success('Vendor added successfully!');

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
        <Typography variant="h4">Vendor</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenModal}
        >
          Add Vendor
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSuccess={fetchData}
          setSelected={setSelected}
          selected={selected}
          tableData={vendor}
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
                  <UserTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={vendor?.length || 0}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'VendorID', label: 'Vendor Id' },
                      // { id: 'BatchNo', label: 'Batch No' },
                      { id: 'Name', label: 'Name' },
                      { id: 'Address', label: 'Address' },
                      { id: 'Email', label: 'Email' },
                      { id: 'PhoneNumber', label: 'Phone Number' },
                      { id: 'AadharCard', label: 'Aadhar Card' },
                      { id: 'PAN', label: 'PAN' },
                      { id: 'GST', label: 'GST' },
                      { id: '' },
                    ]}
                    checked={selected.length > 0 && selected.length === vendor.length} // All selected
                    indeterminate={selected.length > 0 && selected.length < vendor.length} // Some selected
                  />
                  <TableBody>
                    {vendor === undefined || vendor.length === 0 ? ( // Check if there are no vehicles
                      <TableRow>
                        <TableCell colSpan={13} align="center">
                          {' '}
                          {/* Adjust colSpan based on your table structure */}
                          <Typography variant="body1">
                            There is no data available in the Vendor database
                          </Typography>
                          <Typography variant="h6">No data available</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <UserTableRow
                            key={row.vendor_id}
                            vendorID={row.vendor_id}
                            Name={row.name}
                            // BatchNo={row.batch_no}
                            Address={row.address}
                            Email={row.email}
                            PhoneNumber={row.phone_no}
                            Aadharcard={row.aadhar_card}
                            PAN={row.pan}
                            GST={row.gst}
                            selected={selected.indexOf(row.vendor_id) !== -1}
                            handleClick={(event) => handleClick(event, row.vendor_id)}
                            onUpdateSuccess={fetchData}
                          />
                        ))
                    )}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, vendor?.length || 0)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={vendor?.length || 0}
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
            Add Vendor
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
            label="Batch No"
            value={BatchNo}
            onChange={(e) => setBatchNo(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
          /> */}
          <TextField
            fullWidth
            label="Address"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={PhoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Aadhar Card"
            value={Aadharcard}
            onChange={(e) => setAadharcard(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="GST"
            value={GST}
            onChange={(e) => setGST(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="PAN"
            value={PAN}
            onChange={(e) => setPAN(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
          />
          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" color="inherit" onClick={handleAddMotor}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
      <Toaster />
    </Container>
  );
}
