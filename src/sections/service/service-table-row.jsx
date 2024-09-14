import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select'; // Import Select component
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import './Service.css';

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
  UpdatedAt,
  onUpdateSuccess,
}) {
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
    // LeadTime,
  });

  const [deletePopoverOpen, setDeletePopoverOpen] = useState(null);
  const [dealers, setDealers] = useState([]);
  const [DealerIDD, setDealerIDD] = useState(''); // State for DealerID

  const fetchDealers = async () => {
    try {
      const response = await fetch('https://vlmtrs.onrender.com/v1/dealer/fetch-all');
      const data = await response.json();
      setDealers(data.data);
    } catch (error) {
      console.error('Error fetching dealers:', error);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleFormSubmit = async () => {
    const payload = {
      dealer_id: DealerIDD,
      vehicle_id: formData.VehicleID,
      service_date: formData.ServiceDate,
      description: formData.Description,
      cost: formData.UnitCost,
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
        throw new Error('Failed to update accessory');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update accessory');
    } finally {
      handleCloseModal();
    }
  };

  const handleFormChange = (event) => {
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
                margin="normal"
                label="Name"
                name="accessoryName"
                value={formData.Name}
                onChange={handleFormChange}
              /> */}
              <TextField
                fullWidth
                margin="normal"
                label="Vechile Id"
                name="VehicleID"
                value={formData.VehicleID}
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
            </div>
            <div className="VRModal-inner-right">
              <TextField
                fullWidth
                margin="normal"
                label="Service Date"
                name="ServiceDate"
                value={formData.ServiceDate}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Unit Cost"
                name="UnitCost"
                value={formData.UnitCost}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Dealer Id"
                name="Dealer"
                value={formData.DealerID}
                onChange={handleFormChange}
              />
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
            <Button onClick={handleFormSubmit} variant="contained" color="inherit">
              Save
            </Button>
          </Box>
        </Box>
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
  selected: PropTypes.any,
  DealerID: PropTypes.string,
  CreatedAt: PropTypes.string,
  UpdatedAt: PropTypes.string,
  onUpdateSuccess: PropTypes.func,
};
