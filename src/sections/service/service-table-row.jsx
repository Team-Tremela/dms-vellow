import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select'; // Import Select component
import Popover from '@mui/material/Popover';
// import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import './Service.css';
// import { vechicles } from 'src/_mock/vechicles';

// ----------------------------------------------------------------------

export default function ServiceTableRow({
  selected,
  ServiceID,
  Name,
  VehicleID,
  ServiceDate,
  Description,
  UnitCost,
  DealerID,
  handleClick,
  CreatedAt,
  Registrationno,
  UpdatedAt,
  onUpdateSuccess,
  totalPrice,
}) {
  const [totalPartsCost, setTotalPartsCost] = useState(0);
  const [parts, setParts] = useState([]);
  // const [selectedParts, setSelectedParts] = useState([]);
  // const [selectedPart, setSelectedPart] = useState('');
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [formData, setFormData] = useState({
    ServiceID,
    Name,
    VehicleID,
    ServiceDate,
    // batteryName,
    UnitCost,
    Description,
    DealerID,
    Registrationno,
  });

  const [deletePopoverOpen, setDeletePopoverOpen] = useState(null);
  const [dealers, setDealers] = useState([]);
  const [DealerIDD, setDealerIDD] = useState(''); // State for DealerID
  const [vechicles, setVechicles] = useState([]);
  const [vechicleIDD, setVechicleIDD] = useState(''); // State for DealerID

  const [selectedPartsArray, setSelectedPartsArray] = useState([]);

  const selctedarrayvalue = Array.isArray(selectedPartsArray)
    ? selectedPartsArray
    : [selectedPartsArray];

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

  useEffect(() => {
    fetchParts();
  }, [totalPartsCost]);

  const fetchDealers = async () => {
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/dealer/fetch-all');
      const data = await response.json();
      // Check if data is undefined or if data.data is not an array
      if (!data || !Array.isArray(data.data)) {
        setDealers([]); // Set dealers to an empty array
      } else {
        setDealers(data.data); // Set dealers to the fetched data
      }
    } catch (error) {
      console.error('Error fetching dealers:', error);
    }
  };

  const fetchVechicles = async () => {
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/vehicle/fetch-all');
      const data = await response.json();
      // Check if data is undefined or if data.data is not an array
      if (!data || !Array.isArray(data.data)) {
        setVechicles([]); // Set dealers to an empty array
      } else {
        setVechicles(data.data); // Set dealers to the fetched data
      }
    } catch (error) {
      console.error('Error fetching dealers:', error);
    }
  };

  useEffect(() => {
    fetchDealers();
    fetchVechicles();
  }, []);

  const validateFields = () => {
    let isValid = true;

    // // Dealer ID validation
    // if (!DealerIDD) {
    //   toast.error('Please select a Dealer.');
    //   isValid = false;
    //   return isValid;
    // }

    // // Vehicle ID validation
    // if (!vechicleIDD) {
    //   toast.error('Please select a Vehicle.');
    //   isValid = false;
    //   return isValid;
    // }

    // Registration number validation (alphanumeric)
    const registrationPattern = /^[a-zA-Z0-9]+$/;
    if (!formData.Registrationno || !registrationPattern.test(formData.Registrationno)) {
      toast.error('Please enter a valid Registration Number (letters and numbers only).');
      isValid = false;
      return isValid;
    }

    // Description validation (only text)
    const descriptionPattern = /^[a-zA-Z\s]+$/;
    if (!formData.Description || !descriptionPattern.test(formData.Description)) {
      toast.error('Please enter a valid Description (text only).');
      isValid = false;
      return isValid;
    }

    // Service date validation (current or future date)
    const today = dayjs();
    if (!formData.ServiceDate || dayjs(formData.ServiceDate).isBefore(today, 'day')) {
      toast.error('Service Date should be today or a future date.');
      isValid = false;
      return isValid;
    }

    // Parts selection validation
    if (selectedPartsArray.length === 0) {
      toast.error('Please select at least one part.');
      isValid = false;
      return isValid;
    }

    // Unit cost validation
    if (
      !formData.totalPartsCost ||
      Number.isNaN(Number(formData.totalPartsCost)) ||
      formData.totalPartsCost <= 0
    ) {
      toast.error('Please enter a valid positive Unit Cost.');
      isValid = false;
      return isValid;
    }

    return isValid;
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleFormSubmit = async () => {
    const payload = {
      dealer_id: DealerIDD,
      vehicle_id: formData.vechicleIDD,
      service_date: formData.ServiceDate,
      description: formData.Description,
      cost: formData.UnitCost,
      registration_no: formData.Registrationno,
    };
    console.log(payload);
    console.log(ServiceID);
    try {
      const response = await fetch(
        `https://vlmtrs.onrender.com/v1/service/update/${formData.ServiceID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success('Update successful', {
          style: {
            backgroundColor: '#ECDFCC', // Change toast background to red
            color: '#3C3D37', // Change text color to white for contrast
          },
          iconTheme: {
            primary: '#3C3D37', // Change tick icon color to white
            secondary: '#ECDFCC', // Change the secondary color of the icon (background) to red
          },
        });
        if (onUpdateSuccess) {
          onUpdateSuccess(); // Notify the parent component to fetch updated data
        }
      } else {
        throw new Error('Failed to update service');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update service');
    } finally {
      handleCloseModal();
    }
  };

  const handleSubmit = () => {
    if (validateFields()) {
      handleFormSubmit(); // Call the function only if validation passes
    }
  };

  const handleFormChange = (event) => {
    if (formData.UnitCost === UnitCost) {
      handleFormChange({ target: { name: 'UnitCost', value: '' } });
    }
    const { name: fieldName, value } = event.target;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    handleCloseMenu();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenViewModal = () => {
    setOpenViewModal(true);
    handleCloseMenu();
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://vlmtrs.onrender.com/v1/service/delete/${ServiceID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Service deleted successfully', {
          style: {
            backgroundColor: '#B43F3F', // Change toast background to red
            color: 'white', // Change text color to white for contrast
          },
          iconTheme: {
            primary: 'white', // Change tick icon color to white
            secondary: '#B43F3F', // Change the secondary color of the icon (background) to red
          },
        });
        if (onUpdateSuccess) {
          onUpdateSuccess(); // Notify the parent component to fetch updated data
        }
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to delete service');
    } finally {
      handleCloseDeletePopover(); // Ensure this is called after Snackbar is triggered
    }
  };

  const handleOpenDeletePopover = (event) => {
    setDeletePopoverOpen(event.currentTarget);
  };

  const handleCloseDeletePopover = () => {
    setDeletePopoverOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {ServiceID}
        </TableCell>

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {VehicleID}
        </TableCell>

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {Registrationno}
        </TableCell>

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {ServiceDate}
        </TableCell>

        {/* <TableCell>{batteryName}</TableCell> */}

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px',
          }}
        >
          {Description}
        </TableCell>

        <TableCell>{UnitCost}</TableCell>

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {DealerID}
        </TableCell>

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {CreatedAt}
        </TableCell>

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {UpdatedAt}
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleOpenModal}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleOpenDeletePopover} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>

        <MenuItem onClick={handleOpenViewModal}>
          <Iconify icon="ph:eye-duotone" sx={{ mr: 2 }} />
          View
        </MenuItem>
      </Popover>

      <Popover
        open={Boolean(deletePopoverOpen)}
        anchorEl={deletePopoverOpen}
        onClose={handleCloseDeletePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={handleDelete} style={{ color: '#E4003A' }}>
          {/* <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} /> */}
          Yes
        </MenuItem>
        <MenuItem onClick={handleCloseDeletePopover} sx={{ color: '#3C3D37' }}>
          No
        </MenuItem>
      </Popover>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
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
              borderRadius: 1,
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2 id="edit-modal-title">Edit Service</h2>
            <div className="VRModel-style">
              <div className="VRModal-inner-left">
                <Select
                  fullWidth
                  value={DealerIDD}
                  onChange={(e) => setDealerIDD(e.target.value)}
                  displayEmpty
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px', marginTop: '10px' }}
                >
                  <MenuItem value="">
                    <em>{DealerID}</em>
                  </MenuItem>
                  {dealers.map((dealer) => (
                    <MenuItem key={dealer.dealer_id} value={dealer.dealer_id}>
                      {dealer.dealer_id}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  fullWidth
                  value={vechicleIDD}
                  onChange={(e) => setVechicleIDD(e.target.value)}
                  displayEmpty
                  variant="outlined"
                  mb={2}
                  style={{ marginBottom: '10px' }}
                >
                  <MenuItem value="">
                    <em>{VehicleID}</em>
                  </MenuItem>
                  {vechicles.map((vechicle) => (
                    <MenuItem key={vechicle.vehicle_id} value={vechicle.vehicle_id}>
                      {vechicle.vehicle_id}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Registration no"
                  name="Registrationno"
                  value={formData.Registrationno}
                  onChange={handleFormChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Description"
                  name="Description"
                  value={formData.Description}
                  onChange={handleFormChange}
                  variant="outlined"
                  mb={2}
                  multiline
                  rows={4} // Number of rows for the textarea
                  style={{ marginBottom: '10px' }}
                />
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
              </div>
              <div className="VRModal-inner-right">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Previously added parts"
                  name="Description"
                  value={formData.Description}
                  onChange={handleFormChange}
                  variant="outlined"
                  mb={2}
                  multiline
                  rows={4} // Number of rows for the textarea
                  style={{ marginBottom: '10px' }}
                />
                <DesktopDatePicker
                  label="Service Date"
                  inputFormat="YYYY-MM-DD"
                  value={formData.ServiceDate ? dayjs(formData.ServiceDate) : null} // Format it to dayjs object
                  onChange={(newValue) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      ServiceDate: newValue ? newValue.format('YYYY-MM-DD') : '',
                    }))
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
                <TextField
                  fullWidth
                  margin="normal"
                  label="Unit Cost"
                  name="UnitCost"
                  value={totalPartsCost === 0 ? UnitCost : totalPartsCost}
                  onChange={handleFormChange}
                  // defaultValue={UnitCost}
                  disabled
                />
                {/* <TextField
                fullWidth
                margin="normal"
                label="Dealer Id"
                name="Dealer"
                value={formData.DealerID}
                onChange={handleFormChange}
              /> */}
              </div>
            </div>

            {/* <TextField
            fullWidth
            margin="normal"
            label="Battery Name"
            name="batteryName"
            value={formData.batteryName}
            onChange={handleFormChange}
          /> */}
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={handleCloseModal} color="primary" sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} variant="contained" color="inherit">
                Save
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Modal>

      <Modal
        open={openViewModal}
        onClose={handleCloseViewModal}
        aria-labelledby="view-modal-title"
        aria-describedby="view-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="view-modal-title">View Service</h2>
          <div className="VRModel-style">
            <div className="VRModal-inner-left">
              <TextField
                fullWidth
                margin="normal"
                label="Service Id"
                name="ServiceID"
                value={formData.ServiceID}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Vechile Id"
                name="VehicleID"
                value={formData.VehicleID}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Registration no"
                name="Registrationno"
                value={formData.Registrationno}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="Description"
                value={formData.Description}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                mb={2}
                multiline
                rows={4} // Number of rows for the textarea
                style={{ marginBottom: '10px' }}
              />
            </div>
            <div className="VRModal-inner-right">
              <TextField
                fullWidth
                margin="normal"
                label="Service Date"
                name="ServiceDate"
                value={formData.ServiceDate}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Unit Cost"
                name="UnitCost"
                value={formData.UnitCost}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Dealer Id"
                name="DealerID"
                value={formData.DealerID}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </div>

          {/* <TextField
            fullWidth
            margin="normal"
            label="Battery Name"
            name="batteryName"
            value={formData.batteryName}
            InputProps={{
              readOnly: true,
            }}
          /> */}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseViewModal} variant="contained" color="inherit">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

ServiceTableRow.propTypes = {
  handleClick: PropTypes.func,
  Description: PropTypes.any,
  Name: PropTypes.string,
  ServiceID: PropTypes.any,
  VehicleID: PropTypes.any,
  ServiceDate: PropTypes.any,
  UnitCost: PropTypes.any,
  Registrationno: PropTypes.any,
  selected: PropTypes.any,
  DealerID: PropTypes.string,
  CreatedAt: PropTypes.string,
  UpdatedAt: PropTypes.string,
  onUpdateSuccess: PropTypes.func,
  totalPrice: PropTypes.any,
};
