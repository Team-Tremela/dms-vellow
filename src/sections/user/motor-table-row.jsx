import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Popover from '@mui/material/Popover';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  vendorID,
  Name,
  batteryName,
  Email,
  PhoneNumber,
  Address,
  BatchNo,
  // colorName,
  handleClick,
  onUpdateSuccess,
}) {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [formData, setFormData] = useState({
    vendorID,
    Name,
    batteryName,
    Address,
    Email,
    PhoneNumber,
    BatchNo,
    // colorName,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleFormSubmit = async () => {
    const payload = {
      name: formData.Name,
      address: formData.Address,
      email: formData.Email,
      phone_no: formData.PhoneNumber,
      batch_no: formData.BatchNo,
    };

    try {
      const response = await fetch(`https://vlmtrs.onrender.com/v1/vendor/update/${formData.vendorID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAlertType('success');
        setAlertMessage('Vendor updated successfully');
        if (onUpdateSuccess) {
          onUpdateSuccess(); // Notify the parent component to fetch updated data
        }
      } else {
        throw new Error('Failed to update vendor');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.message || 'An error occurred');
    } finally {
      setSnackbarOpen(true);
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
      const response = await fetch(`https://vlmtrs.onrender.com/v1/vendor/delete/${vendorID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlertType('success');
        setAlertMessage('Vendor deleted successfully');
        if (onUpdateSuccess) {
          onUpdateSuccess(); // Notify the parent component to fetch updated data
        }
      } else {
        throw new Error('Failed to delete vendor');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.message || 'An error occurred');
    } finally {
      setSnackbarOpen(true);
      handleCloseMenu();
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

        <TableCell style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100px"}}>{vendorID}</TableCell>

        <TableCell style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100px"}}>{BatchNo}</TableCell>

        <TableCell>{Name}</TableCell>


        {/* <TableCell>{batteryName}</TableCell> */}

        <TableCell>{Address}</TableCell>

        <TableCell>{Email}</TableCell>

        <TableCell>
          {PhoneNumber}
        </TableCell>

        {/* <TableCell>
          <div style={{ display: "flex" }}>
            {colorName.map((color, index) => (
              <div
                key={index}
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: color,
                  marginRight: index < colorName.length - 1 ? "4px" : "4px",
                }}
              />
            ))}
          </div>
        </TableCell> */}

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
        <MenuItem onClick={handleDelete}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Confirm Delete
        </MenuItem>
        <MenuItem onClick={handleCloseDeletePopover} sx={{ color: 'error.main' }}>
          Cancel
        </MenuItem>
      </Popover>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}>
          <h2 id="edit-modal-title">Edit Vendor</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Vendor Id"
            name="VendorID"
            value={formData.vendorID}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="Name"
            value={formData.Name}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Batch No"
            name="BatchNo"
            value={formData.BatchNo}
            onChange={handleFormChange}
          />
          {/* <TextField
            fullWidth
            margin="normal"
            label="Battery Name"
            name="batteryName"
            value={formData.batteryName}
            onChange={handleFormChange}
          /> */}
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="Address"
            value={formData.Address}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="Email"
            value={formData.Email}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            name="PhoneNumber"
            value={formData.PhoneNumber}
            onChange={handleFormChange}
          />
          {/* <TextField
            fullWidth
            margin="normal"
            label="Color"
            name="colorName"
            value={formData.colorName}
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
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}>
          <h2 id="view-modal-title">View Vendor</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Vendor Id"
            name="VendorID"
            value={formData.vendorID}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="modelname"
            value={formData.Name}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Batch No"
            name="BatchNo"
            value={formData.BatchNo}
            InputProps={{
              readOnly: true,
            }}
          />
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
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="Address"
            value={formData.Address}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="Email"
            value={formData.Email}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            name="PhoneNumber"
            value={formData.PhoneNumber}
            InputProps={{
              readOnly: true,
            }}
          />
          {/* <TextField
            fullWidth
            margin="normal"
            label="Color"
            name="colorName"
            value={formData.colorName}
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

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={alertType}>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

UserTableRow.propTypes = {
  batteryName: PropTypes.string,
  handleClick: PropTypes.func,
  Email: PropTypes.any,
  Name: PropTypes.string,
  BatchNo: PropTypes.any,
  Address: PropTypes.any,
  selected: PropTypes.any,
  PhoneNumber: PropTypes.string,
  vendorID: PropTypes.string,
  onUpdateSuccess: PropTypes.func,
  // colorName: PropTypes.arrayOf(
  //   PropTypes.arrayOf(PropTypes.string)  // Array of arrays of strings
  // ),
};
