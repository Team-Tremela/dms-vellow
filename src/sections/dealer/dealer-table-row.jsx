import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
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
  DealerID,
  Name,
  Location,
  Email,
  PhoneNumber,
  Aadharcard,
  GST,
  PAN,
  CreatedAt,
  UpdatedAt,
  handleClick,
  onUpdateSuccess,
}) {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [formData, setFormData] = useState({
    DealerID,
    Name,
    Location,
    Email,
    PhoneNumber,
    Aadharcard,
    GST,
    PAN,
    CreatedAt,
    UpdatedAt,
  });

  const [deletePopoverOpen, setDeletePopoverOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const validateFields = () => {
    // Regular expressions for validation
    // const idPattern = /^[a-zA-Z0-9_]+$/; // Only letters and numbers
    const textPattern = /^[A-Za-z\s',]+$/; // Only letters and spaces for text fields
    // const numberPattern = /^[0-9]+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneNumberPattern = /^(?:\+?\d{1,3})?[-. ]?\(?\d{1,4}?\)?[-. ]?\d{1,4}[-. ]?\d{1,9}$/;
    const aadharPattern = /^\d{4}\s?\d{4}\s?\d{4}$/;
    const gstPattern = /^[0-9]{2}[A-Z]{4}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}$/;
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!Name) {
      toast.error('Please enter a name');
      return false;
    }
    if (!textPattern.test(Name)) {
      toast.error('Name must be a combination of letters');
      return false;
    }

    if (!Location) {
      toast.error('Please enter a Location');
      return false;
    }
    if (!textPattern.test(Location)) {
      toast.error('Location must be a combination of letters');
      return false;
    }

    if (!Email) {
      toast.error('Please enter a Email');
      return false;
    }
    if (!emailPattern.test(Email)) {
      toast.error('Please enter a valid Email ex@gmail.com');
      return false;
    }

    if (!PhoneNumber) {
      toast.error('Please enter a Phone number');
      return false;
    }
    if (!phoneNumberPattern.test(PhoneNumber)) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    if (!Aadharcard) {
      toast.error('Please enter a Aadhar Card number');
      return false;
    }
    if (!aadharPattern.test(Aadharcard)) {
      toast.error('Please enter a valid Aadhar Card number');
      return false;
    }

    if (!GST) {
      toast.error('Please enter a GST number');
      return false;
    }
    if (!gstPattern.test(GST)) {
      toast.error('Please enter a valid GST number');
      return false;
    }

    if (!PAN) {
      toast.error('Please enter a PAN number');
      return false;
    }
    if (!panPattern.test(PAN)) {
      toast.error('Please enter a valid PAN number');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      handleFormSubmit(); // Call the function only if validation passes
    }
  };

  const handleFormSubmit = async () => {
    const payload = {
      name: formData.Name,
      location: formData.Location,
      email: formData.UnitCost,
      phone_number: formData.PhoneNumber,
      aadhar_card: formData.Aadharcard,
      pan: formData.PAN,
      gst: formData.GST,
    };
    console.log(payload);
    console.log(DealerID);
    try {
      const response = await fetch(
        `https://vlmtrs.onrender.com/v1/dealer/update/${formData.DealerID}`,
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
        throw new Error('Failed to update dealer');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update dealer');
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
      const response = await fetch(`https://vlmtrs.onrender.com/v1/dealer/delete/${DealerID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Dealer deleted successfully', {
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
        throw new Error('Failed to delete dealer');
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to delete dealer');
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
          {DealerID}
        </TableCell>

        <TableCell>{Name}</TableCell>

        <TableCell>{Location}</TableCell>

        <TableCell>{Email}</TableCell>

        <TableCell>{PhoneNumber}</TableCell>

        <TableCell>{Aadharcard}</TableCell>

        <TableCell>{PAN}</TableCell>

        <TableCell>{GST}</TableCell>

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
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="edit-modal-title">Edit Dealer</h2>
          {/* <TextField
            fullWidth
            margin="normal"
            label="Dealer Id"
            name="DealerID"
            value={formData.DealerID}
            onChange={handleFormChange}
          /> */}
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
            label="Location"
            name="Location"
            value={formData.Location}
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
          <TextField
            fullWidth
            margin="normal"
            label="Aadhar Card"
            name="Aadharcard"
            value={formData.Aadharcard}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="PAN"
            name="PAN"
            value={formData.PAN}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="GST"
            name="GST"
            value={formData.GST}
            onChange={handleFormChange}
          />
          {/* <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="Address"
            value={formData.Address}
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
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="view-modal-title">View Dealer</h2>
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
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="Name"
            value={formData.Name}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Location"
            name="Location"
            value={formData.Location}
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
          <TextField
            fullWidth
            margin="normal"
            label="Aadhar Card"
            value={formData.Aadharcard}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="PAN"
            value={formData.PAN}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="GST"
            value={formData.GST}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="Address"
            value={formData.CreatedAt}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="Address"
            value={formData.UpdatedAt}
            InputProps={{
              readOnly: true,
            }}
          />
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

UserTableRow.propTypes = {
  PhoneNumber: PropTypes.any,
  handleClick: PropTypes.func,
  Email: PropTypes.any,
  Name: PropTypes.string,
  DealerID: PropTypes.any,
  selected: PropTypes.any,
  Location: PropTypes.string,
  Aadharcard: PropTypes.any.isRequired,
  PAN: PropTypes.any.isRequired,
  GST: PropTypes.any.isRequired,
  CreatedAt: PropTypes.string,
  UpdatedAt: PropTypes.string,
  onUpdateSuccess: PropTypes.func,
};
