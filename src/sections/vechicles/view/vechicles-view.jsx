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
import { vechicles } from 'src/_mock/vechicles';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

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

  // State for motor details
  const [vechicleID, setvechicleID] = useState('');
  const [modelName, setmodelName] = useState('');
  const [VIN, setVIN] = useState('');
  const [vendorID, setvendorID] = useState('');
  const [chassisNo, setchassisNo] = useState('');
  const [motorNo, setmotorNo] = useState('');
  const [batteryNo, setbatteryNo] = useState('');
  const [colorCode, setcolorCode] = useState('');
  const [mfgDate, setmfgDate] = useState('');
  const [unitCost, setunitCost] = useState('');
  const [barCode, setbarCode] = useState('');

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = vechicles.map((n) => n.name);
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
    setvendorID('');
    setchassisNo('');
    setmotorNo('');
    setbatteryNo('');
    setcolorCode('');
    setmfgDate('');
    setunitCost('');
    setbarCode('');
  };

  const handleAddMotor = () => {
    // Handle adding motor logic here
    // Clear input fields after adding motor
    setvechicleID('');
    setmodelName('');
    setVIN('');
    setvendorID('');
    setchassisNo('');
    setmotorNo('');
    setbatteryNo('');
    setcolorCode('');
    setmfgDate('');
    setunitCost('');
    setbarCode('');
    setOpenModal(false);
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
        />

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
                  { id: 'vendorID', label: 'Vendor Id' },
                  { id: 'chassisNo', label: 'Chassis No' },
                  { id: 'motorNo', label: 'Motor No' },
                  { id: 'batteryNo', label: 'Battery No' },
                  { id: 'colorCode', label: 'Color Code' },
                  { id: 'mfgDate', label: 'MFG Date' },
                  { id: 'unitCost', label: 'Unit Cost' },
                  { id: 'barCode', label: 'Barcode' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <VechiclesTableRow
                      key={row.id}
                      vechicleID={row.vechicleID}
                      modelName={row.modelName}
                      VIN={row.VIN}
                      vendorID={row.vendorID}
                      chassisNo={row.chassisNo}
                      motorNo={row.motorNo}
                      batteryNo={row.batteryNo}
                      colorCode={row.colorCode}
                      mfgDate={row.mfgDate}
                      unitCost={row.unitCost}
                      barCode={row.barCode}
                      selected={selected.indexOf(row.modelname) !== -1}
                      handleClick={(event) => handleClick(event, row.modelname)}
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
            Add Vechicle
          </Typography>
          <TextField
            fullWidth
            label="Vechicle Id"
            value={vechicleID}
            onChange={(e) => setvechicleID(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px", marginTop: "20px" }}
          />
          <TextField
            fullWidth
            label="Model Name"
            value={modelName}
            onChange={(e) => setmodelName(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="VIN"
            value={VIN}
            onChange={(e) => setVIN(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Vendor Id"
            value={vendorID}
            onChange={(e) => setvendorID(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Chassis No"
            value={chassisNo}
            onChange={(e) => setchassisNo(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Motor No"
            value={motorNo}
            onChange={(e) => setmotorNo(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Battery No"
            value={batteryNo}
            onChange={(e) => setbatteryNo(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Color Code"
            value={colorCode}
            onChange={(e) => setmotorNo(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="MFG Date"
            value={mfgDate}
            onChange={(e) => setmfgDate(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Unit Cost"
            value={unitCost}
            onChange={(e) => setunitCost(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Barcode"
            value={barCode}
            onChange={(e) => setbarCode(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="inherit"
              onClick={handleAddMotor}
            >
              Add Motor
            </Button>
          </div>
        </Box>
      </Modal>
    </Container>
  );
}
