import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
// import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { users } from 'src/_mock/user';
import { vendor } from 'src/_mock/vendor';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

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

  const [Name, setName] = useState('');
  // const [batteryName, setBatteryName] = useState('');
  const [Email, setEmail] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Address, setAddress] = useState('');
  const [VendorID, setVendorID] = useState('');
  const [BatchNo, setBatchNo] = useState('');
  // const [colors, setColors] = useState('');

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = vendor.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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
    inputData: vendor,
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
    setVendorID('');
    setBatchNo('');
    // setColors('');
  };

  const handleAddMotor = () => {
    // console.log({
    //   modelName,
    //   batteryName,
    //   batteryKWH,
    //   motorName,
    //   motorKW,
    //   colors,
    // });
    setName('');
    // setBatteryName('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setVendorID('');
    setBatchNo('');
    // setColors('');
    setOpenModal(false);
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
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={vendor.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'VendorID', label: 'Vendor Id' },
                  { id: 'BatchNo', label: 'Batch No' },
                  { id: 'Name', label: 'Name' },
                  // { id: 'ContactInformation', label: 'Contact Information' },
                  { id: 'Address', label: 'Address' },
                  { id: 'Email', label: 'Email' },
                  { id: 'PhoneNumber', label: 'Phone Number' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      vendorID={row.VendorID}
                      Name={row.Name}
                      BatchNo={row.BatchNo}
                      // batteryName={row.ContactInformation}
                      Address={row.Address}
                      Email={row.Email}
                      PhoneNumber={row.PhoneNumber}
                      // colorName={row.colorName}
                      selected={selected.indexOf(row.modelname) !== -1}
                      handleClick={(event) => handleClick(event, row.modelname)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, vendor.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={vendor.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
            label="Vendor Id"
            value={VendorID}
            onChange={(e) => setVendorID(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px", marginTop: "20px" }}
          />
          <TextField
            fullWidth
            label="Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px", marginTop: "20px" }}
          />
          <TextField
            fullWidth
            label="Batch No"
            value={BatchNo}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px", marginTop: "20px" }}
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
            label="Address"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={PhoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          {/* <TextField
            fullWidth
            label="Colors"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          /> */}
          <Button
            variant="contained"
            onClick={handleAddMotor}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
