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

import { users } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../report-table-row';
import UserTableHead from '../report-table-head';
import TableEmptyRows from '../report-empty-rows';
import UserTableToolbar from '../report-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';


// ----------------------------------------------------------------------

export default function ReportPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false); // State for Modal

  // State for motor details
  const [modelName, setModelName] = useState('');
  const [batteryName, setBatteryName] = useState('');
  const [batteryKWH, setBatteryKWH] = useState('');
  const [motorName, setMotorName] = useState('');
  const [motorKW, setMotorKW] = useState('');
  const [colors, setColors] = useState('');

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
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
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // Clear input fields when closing modal
    setModelName('');
    setBatteryName('');
    setBatteryKWH('');
    setMotorName('');
    setMotorKW('');
    setColors('');
  };

  const handleAddMotor = () => {
    // Handle adding motor logic here
    console.log({
      modelName,
      batteryName,
      batteryKWH,
      motorName,
      motorKW,
      colors,
    });
    // Clear input fields after adding motor
    setModelName('');
    setBatteryName('');
    setBatteryKWH('');
    setMotorName('');
    setMotorKW('');
    setColors('');
    setOpenModal(false);
  };


  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Reports</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-circle-down-outline" />}
          onClick={handleOpenModal} // Open Modal instead of Popover
        >
          Download reports
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
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'modelname', label: 'Model Name' },
                  { id: 'batteryName', label: 'Battery Name' },
                  { id: 'batteryKWH', label: 'Battery KWH' },
                  { id: 'motorName', label: 'Motor Name' },
                  { id: 'motorkw', label: 'Motor KW' },
                  { id: 'colorName', label: 'Colors' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      modelName={row.modelName}
                      batteryName={row.batteryName}
                      motorkw={row.motorkw}
                      batteryKWH={row.batteryKWH}
                      motorName={row.motorName}
                      colorName={row.colorName}
                      selected={selected.indexOf(row.modelname) !== -1}
                      handleClick={(event) => handleClick(event, row.modelname)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
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
            Add Motor
          </Typography>
          <TextField
            fullWidth
            label="Model Name"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px", marginTop: "20px" }}
          />
          <TextField
            fullWidth
            label="Battery Name"
            value={batteryName}
            onChange={(e) => setBatteryName(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Battery KWH"
            value={batteryKWH}
            onChange={(e) => setBatteryKWH(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Motor Name"
            value={motorName}
            onChange={(e) => setMotorName(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Motor KW"
            value={motorKW}
            onChange={(e) => setMotorKW(e.target.value)}
            variant="outlined"
            mb={2}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Colors"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
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
