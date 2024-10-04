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
  vendorID,
  Name,
  batteryName,
  Email,
  PhoneNumber,
  Address,
  Aadharcard,
  GST,
  PAN,
  // BatchNo,
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
    Aadharcard,
    GST,
    PAN,
    // BatchNo,
  });

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
      aadhar_card: formData.Aadharcard,
      pan: formData.PAN,
      gst: formData.GST,
      // batch_no: formData.BatchNo,
    };

    try {
      const response = await fetch(
        `https://vlmtrs.onrender.com/v1/vendor/update/${formData.vendorID}`,
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
        throw new Error('Failed to update vendor');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update vendor');
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
      const response = await fetch(`https://vlmtrs.onrender.com/v1/vendor/delete/${vendorID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Vendor deleted successfully', {
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
        throw new Error('Failed to delete vendor');
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to delete vendor');
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
          {vendorID}
        </TableCell>

        {/* <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {BatchNo}
        </TableCell> */}

        <TableCell>{Name}</TableCell>

        {/* <TableCell>{batteryName}</TableCell> */}

        <TableCell>{Address}</TableCell>

        <TableCell>{Email}</TableCell>

        <TableCell>{PhoneNumber}</TableCell>

        <TableCell>{Aadharcard}</TableCell>
        
        <TableCell>{PAN}</TableCell>
        
        <TableCell>{GST}</TableCell>

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
          {/* <TextField
            fullWidth
            margin="normal"
            label="Batch No"
            name="BatchNo"
            value={formData.BatchNo}
            onChange={handleFormChange}
          /> */}
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
          <Box mt={2} display="flex" justifyContent="center">
            <Button onClick={handleFormSubmit} variant="contained" color="inherit">
              Save Changes
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
          <h2 id="view-modal-title">View Vendor</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Vendor Id"
            value={formData.vendorID}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={formData.Name}
            InputProps={{
              readOnly: true,
            }}
          />
          {/* <TextField
            fullWidth
            margin="normal"
            label="Batch No"
            value={formData.BatchNo}
            InputProps={{
              readOnly: true,
            }}
          /> */}
          {/* <TextField
            fullWidth
            margin="normal"
            label="Battery Name"
            value={formData.batteryName}
            InputProps={{
              readOnly: true,
            }}
          /> */}
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            value={formData.Address}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={formData.Email}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
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
          <Box mt={2} display="flex" justifyContent="center">
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
  selected: PropTypes.bool,
  vendorID: PropTypes.string.isRequired,
  Name: PropTypes.string.isRequired,
  batteryName: PropTypes.string,
  Email: PropTypes.string.isRequired,
  PhoneNumber: PropTypes.string.isRequired,
  Address: PropTypes.string.isRequired,
  Aadharcard: PropTypes.any.isRequired,
  PAN: PropTypes.any.isRequired,
  GST: PropTypes.any.isRequired,
  // BatchNo: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  onUpdateSuccess: PropTypes.func,
};
