import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName, selected, setSelected, onDeleteSuccess }) {

  const handleDelete = async () => {
    if (selected.length === 0) {
      toast.error("No vendors selected to delete!");
      return;
    }
  
    // Create an array of delete promises
    const deletePromises = selected.map(async (vendorID) => {
      const apiUrl = `https://vlmtrs.onrender.com/v1/vendor/delete/${vendorID}`;
      try {
        const response = await fetch(apiUrl, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Failed to delete vendor with ID: ${vendorID}`);
        }
        return response.json();
      } catch (error) {
        console.error(`Error deleting vendor with ID: ${vendorID}`, error);
        throw error;
      }
    });
  
    try {
      // Wait for all delete requests to finish
      await Promise.all(deletePromises);
      toast.success('Vendors deleted successfully!',{
        style: {
          backgroundColor: '#B43F3F', // Change toast background to red
          color: 'white', // Change text color to white for contrast
        },
        iconTheme: {
          primary: 'white', // Change tick icon color to white
          secondary: '#B43F3F', // Change the secondary color of the icon (background) to red
        },
      });
      
      // Reset selected rows after deletion
      setSelected([]);  // This will uncheck all checkboxes

      // Refresh the vendor list
      onDeleteSuccess();
    } catch (error) {
      toast.error("Some vendors could not be deleted. Please try again.");
    }
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search vendor..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};
