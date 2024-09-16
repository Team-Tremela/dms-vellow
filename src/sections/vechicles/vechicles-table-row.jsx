import dayjs from 'dayjs';
import JsBarcode from 'jsbarcode';
import PropTypes from 'prop-types';
// import Barcode from 'react-barcode';
import { toast } from 'react-hot-toast';
import { useRef, useState, useEffect } from 'react';

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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import './vechicles-table-row.css';

// ----------------------------------------------------------------------

export default function VechiclesTableRow({
  selected,
  vechicleID,
  modelName,
  VIN,
  dealerID,
  chassisNo,
  motorNo,
  batteryNo,
  colorCode,
  mfgDate,
  // unitCost,
  barCode,
  handleClick,
  CreatedAt,
  UpdatedAt,
  onUpdateSuccess,
  batchNo,
}) {
  const barcodeRef = useRef(null);
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [formData, setFormData] = useState({
    vechicleID,
    modelName,
    VIN,
    dealerID,
    chassisNo,
    motorNo,
    batteryNo,
    colorCode,
    mfgDate,
    batchNo,
    // unitCost,
    barCode,
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
      vin: formData.VIN,
      chassis_no: formData.chassisNo,
      motor_no: formData.motorNo,
      battery_no: formData.batteryNo,
      color_code: formData.colorCode,
      mfg_date: formData.mfgDate,
      model_name: formData.modelName,
      barcode: formData.barCode,
      batch_no: formData.batchNo,
    };
    console.log(payload);
    console.log(vechicleID);
    try {
      const response = await fetch(
        `https://vlmtrs.onrender.com/v1/vehicle/update/${formData.vechicleID}`,
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
        throw new Error('Failed to update vechicle');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update vechicle');
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
  // console.log({ colorCode });

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://vlmtrs.onrender.com/v1/vehicle/delete/${vechicleID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Vechicle deleted successfully', {
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
        throw new Error('Failed to delete vechicle');
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to delete vechicle');
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

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, barCode, {
        height: 30, // Adjust height here
        width: 2,
      });
    }
  }, [barCode]);

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
          {dealerID}
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
        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {batchNo}
        </TableCell>

        {/* <TableCell>
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
        </TableCell> */}

        <TableCell>{colorCode}</TableCell>
        <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {mfgDate}
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

        {/* <TableCell>{unitCost}</TableCell> */}

        <TableCell id='barCode'>
          <svg ref={barcodeRef} />
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
            <h2 id="edit-modal-title">Edit Vechicles</h2>
            <div className="VRModel-style">
              <div className="VRModal-inner-left">
                <Select
                  fullWidth
                  value={DealerIDD}
                  onChange={(e) => setDealerIDD(e.target.value)}
                  displayEmpty
                  variant="outlined"
                  mb={2}
                  style={{ marginTop: '14px' }}
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
                  label="Vechicle Id"
                  name="vechicleID"
                  value={formData.vechicleID}
                  onChange={handleFormChange}
                /> */}
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
              <div className="VRModal-inner-right">
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
                  label="Batch No"
                  name="batchNo"
                  value={formData.batchNo}
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
                <DesktopDatePicker
                  label="Manufacturing Date"
                  inputFormat="YYYY-MM-DD"
                  value={mfgDate ? dayjs(mfgDate) : null} // Format it to dayjs object
                  onChange={(newValue) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      mfgDate: newValue ? newValue.format('YYYY-MM-DD') : '',
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
  dealerID: PropTypes.any,
  chassisNo: PropTypes.string,
  motorNo: PropTypes.string,
  batteryNo: PropTypes.string,
  batchNo: PropTypes.string,
  // colorCode: PropTypes.arrayOf(
  //   PropTypes.arrayOf(PropTypes.string) // Array of arrays of strings
  // ),
  colorCode: PropTypes.any,
  mfgDate: PropTypes.string,
  // unitCost: PropTypes.string,
  barCode: PropTypes.string,
  CreatedAt: PropTypes.string,
  UpdatedAt: PropTypes.string,
  selected: PropTypes.any,
  onUpdateSuccess: PropTypes.func,
};
