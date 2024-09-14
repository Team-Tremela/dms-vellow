import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select'; // Import Select component
// import MenuItem from '@mui/material/MenuItem'; // Import MenuItem component
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

// import { dealer } from 'src/_mock/dealer';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './dealer-view.css';
import TableNoData from '../table-no-data';
import UserTableRow from '../dealer-table-row';
import UserTableHead from '../dealer-table-head';
import TableEmptyRows from '../dealer-empty-rows';
import UserTableToolbar from '../dealer-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function DealerPage() {
  // console.log('Rendering InventoryPage');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false); // State for Modal
  const [loading, setLoading] = useState(true); // Add loading state
  const [dealer, setDealer] = useState([]);

  // State for motor details
  // const [DealerID, setDealerID] = useState('');
  const [Name, setName] = useState('');
  const [Location, setLocation] = useState('');
  const [Email, setEmail] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  // const [Address, setAddress] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  // Define fetchData function
  const fetchData = async () => {
    setLoading(true);
    const apiUrl = 'https://vlmtrs.onrender.com/v1/dealer/fetch-all';
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json(); // Extract error data
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data = await response.json();
      setDealer(data.data);
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
      const newSelecteds = dealer.map((n) => n.dealer_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, dealer_id) => {
    const selectedIndex = selected.indexOf(dealer_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, dealer_id);
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

  const dataFiltered = applyFilter({
    inputData: dealer,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // Clear input fields when closing modal
    // setDealerID('');
    setName('');
    setLocation('');
    setEmail('');
    setPhoneNumber('');
    // setAddress('');
  };

  const handleAddMotor = async () => {
    const newDealer = {
      name: Name,
      location: Location,
      email: Email,
      phone_number: PhoneNumber,
    };
    console.log(newDealer);
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/dealer/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDealer),
      });

      if (!response.ok) {
        throw new Error('Failed to add Dealer');
      }

      const data = await response.json();
      console.log('Dealer added successfully:', data);

      // Reset form fields after successful submission
      setName('');
      setLocation('');
      setEmail('');
      setPhoneNumber('');

      // Close modal
      setOpenModal(false);

      // Show success message
      toast.success('Dealer added successfully!');

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
        <Typography variant="h4">Dealer</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenModal} // Open Modal instead of Popover
        >
          Add to Dealer
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
          tableData={dealer}
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
                  <UserTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={dealer.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'DealerID', label: 'Dealer Id' },
                      { id: 'Name', label: 'Name' },
                      { id: 'Location', label: 'Location' },
                      { id: 'Email', label: 'Email' },
                      { id: 'PhoneNumber', label: 'Phone Number' },
                      { id: 'CreatedAt', label: 'Createed At' },
                      { id: 'UpdatedAt', label: 'Updated At' },
                      { id: '' },
                    ]}
                    checked={selected.length > 0 && selected.length === dealer.length} // All selected
                    indeterminate={selected.length > 0 && selected.length < dealer.length} // Some selected
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <UserTableRow
                          key={row.id}
                          DealerID={row.dealer_id}
                          Name={row.name}
                          Location={row.location}
                          Email={row.email}
                          PhoneNumber={row.phone_number}
                          CreatedAt={row.createdAt}
                          UpdatedAt={row.updatedAt}
                          selected={selected.indexOf(row.dealer_id) !== -1}
                          handleClick={(event) => handleClick(event, row.dealer_id)}
                          onUpdateSuccess={fetchData}
                        />
                      ))}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, dealer.length)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={dealer.length}
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
            borderRadius: 1, // Adding border radius
            outline: 'none', // Remove default outline
          }}
        >
          <Typography variant="h6" id="modal-title">
            Add Dealer
          </Typography>
          {/* <TextField
            fullWidth
            label="Dealer Id"
            value={DealerID}
            onChange={(e) => setDealerID(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px', marginTop: '20px' }}
          /> */}
          <TextField
            fullWidth
            label="Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px', marginTop: '20px' }}
          />
          <TextField
            fullWidth
            label="Location"
            value={Location}
            onChange={(e) => setLocation(e.target.value)}
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
          {/* <TextField
            fullWidth
            label="Address"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: '10px' }}
          /> */}
          <div style={{ textAlign: 'center' }}>
            <Button variant="contained" color="inherit" onClick={handleAddMotor}>
              Add Dealer
            </Button>
          </div>
        </Box>
      </Modal>
      <Toaster />
    </Container>
  );
}
