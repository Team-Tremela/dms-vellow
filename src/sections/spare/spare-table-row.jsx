import { useState } from 'react';
import PropTypes from 'prop-types';

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

export default function SpareTableRow({
  selected,
  spareID,
  Name,
  partNumber,
  Description,
  VendorID,
  UnitCost,
  LeadTime,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [formData, setFormData] = useState({
    Name,
    spareID,
    partNumber,
    UnitCost,
    Description,
    VendorID,
    LeadTime,
  });

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleFormSubmit = () => {
    // Add form submission logic here
    console.log('Form data:', formData);
    handleCloseModal();
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
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100px"}}>{spareID}</TableCell>

        <TableCell>{Name}</TableCell>

        <TableCell>{partNumber}</TableCell>

        <TableCell>{UnitCost}</TableCell>

        <TableCell style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"200px"}}>{Description}</TableCell>

        <TableCell style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100px"}}>
          {VendorID}
        </TableCell>

        <TableCell>
          {LeadTime}
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

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>

        <MenuItem onClick={handleOpenViewModal}>
          <Iconify icon="ph:eye-duotone" sx={{ mr: 2 }} />
          View
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
          <h2 id="edit-modal-title">Edit Spare</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Spare Id"
            name="SpareID"
            value={formData.spareID}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="accessoryName"
            value={formData.Name}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Part Number"
            name="partNumber"
            value={formData.partNumber}
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
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Vendor Id"
            name="VendorID"
            value={formData.VendorID}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Lead Time"
            name="LeadTime"
            value={formData.LeadTime}
            onChange={handleFormChange}
          />
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
          <h2 id="view-modal-title">View Spare</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Spare Id"
            name="spareID"
            value={formData.spareID}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="accessoryname"
            value={formData.Name}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Part Number"
            name="PartNumber"
            value={formData.partNumber}
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
            label="Description"
            name="Description"
            value={formData.Description}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Vendor Id"
            name="VendorID"
            value={formData.VendorID}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Lead Time"
            name="LeadTime"
            value={formData.LeadTime}
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

SpareTableRow.propTypes = {
  partNumber: PropTypes.string,
  handleClick: PropTypes.func,
  Description: PropTypes.any,
  Name: PropTypes.string,
  UnitCost: PropTypes.any,
  selected: PropTypes.any,
  VendorID: PropTypes.string,
  LeadTime: PropTypes.any,
  spareID: PropTypes.any,
};
