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

import './vechicles-table-row.css';

// ----------------------------------------------------------------------

export default function VechiclesTableRow({
  selected,
  vechicleID,
  modelName,
  VIN,
  vendorID,
  chassisNo,
  motorNo,
  batteryNo,
  colorCode,
  mfgDate,
  unitCost,
  barCode,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [formData, setFormData] = useState({
    vechicleID,
    modelName,
    VIN,
    vendorID,
    chassisNo,
    motorNo,
    batteryNo,
    colorCode,
    mfgDate,
    unitCost,
    barCode,
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
  console.log({ colorCode });
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
          {vechicleID}
        </TableCell>

        <TableCell>{modelName}</TableCell>

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {VIN}
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

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {chassisNo}
        </TableCell>

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {motorNo}
        </TableCell>

        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {batteryNo}
        </TableCell>

        <TableCell>
          <div style={{ display: 'flex' }}>
            {colorCode.map((color, index) => (
              <div
                key={index}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: color,
                  marginRight: index < colorCode.length - 1 ? '4px' : '0',
                  marginBottom: '10px',
                }}
              />
            ))}
          </div>
        </TableCell>

        <TableCell>{mfgDate}</TableCell>

        {/* <TableCell>{unitCost}</TableCell> */}

        <TableCell>{barCode}</TableCell>

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
          <h2 id="edit-modal-title">Edit Vechicles</h2>
          <div className='VRModel-style'>
            <div className='VRModal-inner-left'>
              <TextField
                fullWidth
                margin="normal"
                label="Vechicle Id"
                name="vechicleID"
                value={formData.vechicleID}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Model Name"
                name="modelName"
                value={formData.modelName}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="VIN"
                name="VIN"
                value={formData.VIN}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Vendor Id"
                name="vendorID"
                value={formData.vendorID}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Chassis No"
                name="chassisNo"
                value={formData.chassisNo}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Motor No"
                name="motorNo"
                value={formData.motorNo}
                onChange={handleFormChange}
              />
            </div>
            <div className='VRModal-inner-right'>
              <TextField
                fullWidth
                margin="normal"
                label="Battery No"
                name="batteryNo"
                value={formData.batteryNo}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Color Code"
                name="colorCode"
                value={formData.colorCode}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="MFG Date"
                name="mfgDate"
                value={formData.mfgDate}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Unit Cost"
                name="unitCost"
                value={formData.unitCost}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Barcode"
                name="barCode"
                value={formData.barCode}
                onChange={handleFormChange}
              />
            </div>
          </div>
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
          <h2 id="view-modal-title">View Vechicles</h2>
          <div className="VRModel-style">
            <div className="VRModal-inner-left">
              <TextField
                fullWidth
                margin="normal"
                label="Vechicle Id"
                name="vechicleID"
                value={formData.vechicleID}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Model Name"
                name="modelName"
                value={formData.modelName}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="VIN"
                name="VIN"
                value={formData.VIN}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Vendor Id"
                name="vendorID"
                value={formData.vendorID}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Chassis No"
                name="chassisNo"
                value={formData.chassisNo}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Motor No"
                name="motorNo"
                value={formData.motorNo}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="VRModal-inner-right">
              <TextField
                fullWidth
                margin="normal"
                label="Battery No"
                name="batteryNo"
                value={formData.batteryNo}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Color Code"
                name="colorCode"
                value={formData.colorCode}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="MFG Date"
                name="mfgDate"
                value={formData.mfgDate}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Unit Cost"
                name="unitCost"
                value={formData.unitCost}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Barcode"
                name="barCode"
                value={formData.barCode}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </div>
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

VechiclesTableRow.propTypes = {
  handleClick: PropTypes.func,
  vechicleID: PropTypes.any,
  modelName: PropTypes.any,
  VIN: PropTypes.string,
  vendorID: PropTypes.any,
  chassisNo: PropTypes.string,
  motorNo: PropTypes.string,
  batteryNo: PropTypes.string,
  colorCode: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string) // Array of arrays of strings
  ),
  mfgDate: PropTypes.string,
  unitCost: PropTypes.string,
  barCode: PropTypes.string,
  selected: PropTypes.any,
};
