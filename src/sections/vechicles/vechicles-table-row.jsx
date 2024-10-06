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
  // VIN,
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
    // VIN,
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

  useEffect(() => {
    fetchDealers();
  }, []);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const validateFields = () => {
    // Regular expressions for validation
    const idPattern = /^[a-zA-Z0-9_]+$/; // Only letters and numbers
    const textPattern = /^[A-Za-z\s']+$/; // Only letters and spaces for text fields
    // const numberPattern = /^[0-9]+$/;
    const hexColorPattern =
      /^(#[0-9A-Fa-f]{3}(?:[,\s]*#[0-9A-Fa-f]{3})*|#[0-9A-Fa-f]{6}(?:[,\s]*#[0-9A-Fa-f]{6})*)$/;
    const currentDate = dayjs().format('YYYY-MM-DD');
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Date format YYYY-MM-DD
    const barcodePattern = /^[0-9]+$/;

    // if (!DealerIDD) {
    //   toast.error('Please select Dealer Id');
    //   return false;
    // }
    // if (!idPattern.test(DealerIDD)) {
    //   toast.error('Dealer ID must be a combination of letters and numbers');
    //   return false;
    // }

    if (!modelName) {
      toast.error('Please enter a name');
      return false;
    }
    if (!textPattern.test(modelName)) {
      toast.error('Name must be a combination of letters');
      return false;
    }

    if (!chassisNo) {
      toast.error('Please enter a Chassis No');
      return false;
    }
    if (!idPattern.test(chassisNo)) {
      toast.error('Enter a valid Chassis No');
      return false;
    }

    if (!motorNo) {
      toast.error('Please enter a Motor No');
      return false;
    }
    if (!idPattern.test(motorNo)) {
      toast.error('Enter a valid Motor No');
      return false;
    }

    if (!batchNo) {
      toast.error('Please enter a Motor No');
      return false;
    }
    if (!idPattern.test(batchNo)) {
      toast.error('Enter a valid Motor No');
      return false;
    }

    if (!colorCode) {
      toast.error('Please enter a Color code');
      return false;
    }
    if (!hexColorPattern.test(colorCode)) {
      toast.error('Enter a valid Color Code');
      return false;
    }

    if (!mfgDate) {
      toast.error('Please select a mfg date');
      return false;
    }
    if (!datePattern.test(mfgDate)) {
      toast.error('Mfg date must be in YYYY-MM-DD format');
      return false;
    }
    // Check if the selected date is in the future
    if (dayjs(mfgDate).isAfter(currentDate)) {
      toast.error('Mfg date cannot be in the future. Please select today or a past date.');
      return false;
    }

    console.log(typeof(barCode),barCode);
    // Convert barcode to number
    const barcodeAsNumber = Number(barCode);
    console.log(typeof (barcodeAsNumber),barcodeAsNumber);
    // Check if the conversion is valid
    if (Number.isNaN(barcodeAsNumber)) {
      throw new Error('Invalid barcode number conversion.');
    }

    if (!barcodeAsNumber) {
      toast.error('Please enter a barcode');
      return false;
    }
    // Check if the conversion is successful and matches the pattern
    if (Number.isNaN(barcodeAsNumber) || !barcodePattern.test(barcodeAsNumber)) {
      toast.error('Barcode must be 12 or 13 digits long');
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
      dealer_id: DealerIDD,
      // vin: formData.VIN,
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
    // If the colorCode field is being changed, split the value by comma into an array
    if (fieldName === 'colorCode') {
      setFormData({
        ...formData,
        [fieldName]: value.split(','), // Split by commas to create an array
      });
    } else {
      setFormData({
        ...formData,
        [fieldName]: value,
      });
    }
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
        height: 25, // Adjust height here
        width: 2,
        fontSize: 12,
      });
    }
  }, [barCode]);

  console.log(colorCode);

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

        {/* <TableCell
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px',
          }}
        >
          {VIN}
        </TableCell> */}

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

        <TableCell>
          {
            colorCode && colorCode.length > 0 ? (
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
            ) : null // Render nothing if no color data is available
          }
        </TableCell>

        {/* <TableCell>{colorCode}</TableCell> */}
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

        <TableCell style={{ padding: '0px' }}>
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
                    <em>{dealerID}</em>
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
                {/* <TextField
                  fullWidth
                  margin="normal"
                  label="VIN"
                  name="VIN"
                  value={formData.VIN}
                  onChange={handleFormChange}
                /> */}
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
                <TextField
                  fullWidth
                  margin="normal"
                  label="Battery No"
                  name="batteryNo"
                  value={formData.batteryNo}
                  onChange={handleFormChange}
                />
              </div>
              <div className="VRModal-inner-right">
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
              {/* <TextField
                fullWidth
                margin="normal"
                label="VIN"
                name="VIN"
                value={formData.VIN}
                InputProps={{
                  readOnly: true,
                }}
              /> */}
              {/* <TextField
                fullWidth
                margin="normal"
                label="Vendor Id"
                name="vendorID"
                value={formData.vendorID}
                InputProps={{
                  readOnly: true,
                }}
              /> */}
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
  // VIN: PropTypes.string,
  dealerID: PropTypes.any,
  chassisNo: PropTypes.string,
  motorNo: PropTypes.string,
  batteryNo: PropTypes.string,
  batchNo: PropTypes.string,
  colorCode: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string) // Array of arrays of strings
  ),
  // colorCode: PropTypes.any,
  mfgDate: PropTypes.string,
  // unitCost: PropTypes.string,
  barCode: PropTypes.string,
  CreatedAt: PropTypes.string,
  UpdatedAt: PropTypes.string,
  selected: PropTypes.any,
  onUpdateSuccess: PropTypes.func,
};
