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

import { service } from 'src/_mock/service';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './Service.css';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../service-empty-rows';
import ServiceTableRow from '../service-table-row';
import ServiceTableHead from '../service-table-head';
import ServiceTableToolbar from '../service-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function ServicePage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('Name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  const [Name, setName] = useState('');
  const [VechicleID, setVechicleId] = useState('');
  const [ServiceDate, setServiceDate] = useState('');
  // const [batteryName, setBatteryName] = useState('');
  const [Description, setDescription] = useState('');
  const [DealerID, setDealerID] = useState('');
  const [UnitCost, setUnitCost] = useState('');
  const [LeadTime, setLeadTime] = useState('');
  const [ServiceID, setServiceID] = useState('');

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = service.map((n) => n.Name);
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
    inputData: service,
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
    setServiceDate('');
    setVechicleId('');
    setDescription('');
    setDealerID('');
    setUnitCost('');
    setLeadTime('');
    setServiceID('');
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
    setDescription('');
    setServiceDate('');
    setVechicleId('');
    setDealerID('');
    setUnitCost('');
    setLeadTime('');
    setServiceID('');
    setOpenModal(false);
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
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
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
                  { id: 'Name', label: 'Name' },
                  { id: 'VehicleID', label: 'Vechicle Id' },
                  { id: 'ServiceDate', label: 'Sevice Date' },
                  // { id: 'ContactInformation', label: 'Contact Information' },
                  { id: 'Description', label: 'Description' },
                  { id: 'Cost', label: 'Cost' },
                  { id: 'DealerID', label: 'Dealer ID' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ServiceTableRow
                      key={row.id}
                      ServiceID={row.ServiceID}
                      Name={row.Name}
                      // batteryName={row.ContactInformation}
                      VehicleID={row.VehicleID}
                      ServiceDate={row.ServiceDate}
                      Description={row.Description}
                      UnitCost={row.UnitCost}
                      DealerID={row.DealerID}
                      selected={selected.indexOf(row.modelname) !== -1}
                      handleClick={(event) => handleClick(event, row.modelname)}
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
              <TextField
                fullWidth
                label="Service Id"
                value={ServiceID}
                onChange={(e) => setServiceID(e.target.value)}
                variant="outlined"
                mb={2}
                style={{ marginBottom: '10px', marginTop: '20px' }}
              />
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
                label="Vechicle Id"
                value={VechicleID}
                onChange={(e) => setVechicleId(e.target.value)}
                variant="outlined"
                mb={2}
                style={{ marginBottom: '10px', marginTop: '20px' }}
              />
              <TextField
                fullWidth
                label="Service Date"
                value={ServiceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                variant="outlined"
                mb={2}
                style={{ marginBottom: '10px', marginTop: '20px' }}
              />
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
                style={{ marginBottom: '10px' }}
              />
              <TextField
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
              />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button variant="contained" color="inherit" onClick={handleAddMotor}>
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </Container>
  );
}
