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
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// import { users } from 'src/_mock/user';
// import { vechicles } from 'src/_mock/vechicles';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './vechicles-view.css';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../vechicles-empty-rows';
import VechiclesTableRow from '../vechicles-table-row';
import VechiclesTableHead from '../vechicles-table-head';
import VechiclesTableToolbar from '../vechicles-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function VechiclesPage() {
  // console.log('Rendering InventoryPage');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false); // State for Modal
  const [loading, setLoading] = useState(true); // Add loading state
  const [vechicles, setVechicles] = useState([]);
  const [dealers, setdealers] = useState([]);

  // State for motor details
  const [vechicleID, setvechicleID] = useState('');
  const [modelName, setmodelName] = useState('');
  const [VIN, setVIN] = useState('');
  const [dealerID, setdealerID] = useState('');
  const [chassisNo, setchassisNo] = useState('');
  const [motorNo, setmotorNo] = useState('');
  const [batteryNo, setbatteryNo] = useState('');
  const [batchNo, setbatchNo] = useState('');
  const [colorCode, setcolorCode] = useState('');
  const [mfgDate, setmfgDate] = useState('');
  // const [unitCost, setunitCost] = useState('');
  const [barCode, setbarCode] = useState('');

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

  useEffect(() => {
    fetchData();
    fetchDealers();
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
      const newSelecteds = vechicles.map((n) => n.vehicle_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, vehicle_id) => {
    const selectedIndex = selected.indexOf(vehicle_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, vehicle_id);
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
    inputData: vechicles,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // Clear input fields when closing modal
    setvechicleID('');
    setmodelName('');
    setVIN('');
    setdealerID('');
    setchassisNo('');
    setmotorNo('');
    setbatteryNo('');
    setcolorCode('');
    setmfgDate('');
    setbatchNo('');
    // setunitCost('');
    setbarCode('');
  };

  const handleAddMotor = async () => {
    const newVechicle = {
      vehicle_id: vechicleID,
      dealer_id: dealerID,
      vin: VIN,
      chassis_no: chassisNo,
      motor_no: motorNo,
      battery_no: batteryNo,
      color_code: colorCode,
      mfg_date: mfgDate,
      model_name: modelName,
      barcode: barCode,
      batch_no: batchNo,
    };
    console.log(newVechicle);
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/vehicle/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVechicle),
      });

      if (!response.ok) {
        throw new Error('Failed to add vechicle');
      }

      const data = await response.json();
      console.log('vechicle added successfully:', data);

      // Reset form fields after successful submission
      setvechicleID('');
      setmodelName('');
      setVIN('');
      setdealerID('');
      setchassisNo('');
      setmotorNo('');
      setbatteryNo('');
      setcolorCode('');
      setmfgDate('');
      setbarCode('');
      setbatchNo('');
      setOpenModal(false);

      // Show success message
      toast.success('Vechicle added successfully!');

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
        <Typography variant="h4">Vechicles</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenModal} // Open Modal instead of Popover
        >
          Add to vechicles
        </Button>
      </Stack>

      <Card>
        <VechiclesTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSuccess={fetchData}
          setSelected={setSelected}
          selected={selected}
          tableData={vechicles}
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
                  <VechiclesTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={vechicles.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'vechicleID', label: 'Vechicle Id' },
                      { id: 'modelName', label: 'Model Name' },
                      { id: 'VIN', label: 'VIN' },
                      { id: 'dealerID', label: 'Dealer Id' },
                      { id: 'chassisNo', label: 'Chassis No' },
                      { id: 'motorNo', label: 'Motor No' },
                      { id: 'batteryNo', label: 'Battery No' },
                      { id: 'batchNo', label: 'Batch No' },
                      { id: 'colorCode', label: 'Color Code' },
                      { id: 'mfgDate', label: 'MFG Date' },
                      { id: 'CreatedAt', label: 'Created At' },
                      { id: 'UpdatedAt', label: 'Updated At' },
                      // { id: 'unitCost', label: 'Unit Cost' },
                      { id: 'barCode', label: 'Barcode' },
                      { id: '' },
                    ]}
                    checked={selected.length > 0 && selected.length === vechicles.length} // All selected
                    indeterminate={selected.length > 0 && selected.length < vechicles.length} // Some selected
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <VechiclesTableRow
                          key={row.id}
                          vechicleID={row.vehicle_id}
                          modelName={row.model_name}
                          VIN={row.vin}
                          dealerID={row.dealer_id}
                          chassisNo={row.chassis_no}
                          motorNo={row.motor_no}
                          batteryNo={row.battery_no}
                          batchNo={row.batch_no}
                          colorCode={row.color_code}
                          mfgDate={row.mfg_date}
                          CreatedAt={row.createdAt}
                          UpdatedAt={row.updatedAt}
                          // unitCost={row.unitCost}
                          barCode={row.barcode}
                          selected={selected.indexOf(row.vehicle_id) !== -1}
                          handleClick={(event) => handleClick(event, row.vehicle_id)}
                          onUpdateSuccess={fetchData}
                        />
                      ))}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, vechicles.length)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={vechicles.length}
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
              borderRadius: 1, // Adding border radius
              outline: 'none', // Remove default outline
            }}
          >
            <Typography variant="h6" id="modal-title">
              Add Vechicle
            </Typography>
            <div className="VModal-style">
              <div className="VModal-inner-left">
                <Select
                  fullWidth
                  value={dealerID}
                  onChange={(e) => setdealerID(e.target.value)}
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
                {/* <TextField
                  fullWidth
                  label="Vechicle Id"
                  value={vechicleID}
                  onChange={(e) => setvechicleID(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px', marginTop: '20px' }}
                /> */}
                <TextField
                  fullWidth
                  label="Model Name"
                  value={modelName}
                  onChange={(e) => setmodelName(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
                <TextField
                  fullWidth
                  label="VIN"
                  value={VIN}
                  onChange={(e) => setVIN(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
                <TextField
                  fullWidth
                  label="Chassis No"
                  value={chassisNo}
                  onChange={(e) => setchassisNo(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
                <TextField
                  fullWidth
                  label="Motor No"
                  value={motorNo}
                  onChange={(e) => setmotorNo(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
              </div>
              <div className="VModal-inner-right">
                <TextField
                  fullWidth
                  label="Battery No"
                  value={batteryNo}
                  onChange={(e) => setbatteryNo(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
                <TextField
                  fullWidth
                  label="Batch No"
                  value={batchNo}
                  onChange={(e) => setbatchNo(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
                <TextField
                  fullWidth
                  label="Color Code"
                  value={colorCode}
                  onChange={(e) => setcolorCode(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
                <DesktopDatePicker
                  label="Manufacturing Date"
                  inputFormat="YYYY-MM-DD"
                  value={mfgDate ? dayjs(mfgDate) : null} // Format it to dayjs object
                  onChange={(newValue) => setmfgDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
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
                {/* <TextField
                fullWidth
                label="MFG Date"
                value={mfgDate}
                onChange={(e) => setmfgDate(e.target.value)}
                variant="outlined"
                mb={2}
                style={{ marginBottom: '10px' }}
              /> */}
                {/* <TextField
                  fullWidth
                  label="Unit Cost"
                  value={unitCost}
                  onChange={(e) => setunitCost(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                /> */}
                <TextField
                  fullWidth
                  label="Barcode"
                  value={barCode}
                  onChange={(e) => setbarCode(e.target.value)}
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button variant="contained" color="inherit" onClick={handleAddMotor}>
                Add Motor
              </Button>
            </div>
          </Box>
        </LocalizationProvider>
      </Modal>
      <Toaster />
    </Container>
  );
}
