import * as XLSX from 'xlsx';
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

export default function ServiceTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  selected,
  setSelected,
  onDeleteSuccess,
  tableData,
}) {
  // Function to format the current date and time
  const formatDateTime = () => {
    const now = new Date();
    const options = {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    const formattedDate = now.toLocaleDateString('en-GB', options).replace(',', '');
    return formattedDate;
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      toast.error('No service selected to delete!');
      return;
    }

    // Create an array of delete promises
    const deletePromises = selected.map(async (ServiceID) => {
      const apiUrl = `https://vlmtrs.onrender.com/v1/service/delete/${ServiceID}`;
      try {
        const response = await fetch(apiUrl, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Failed to delete service with ID: ${ServiceID}`);
        }
        return response.json();
      } catch (error) {
        console.error(`Error deleting service with ID: ${ServiceID}`, error);
        throw error;
      }
    });

    try {
      // Wait for all delete requests to finish
      await Promise.all(deletePromises);
      toast.success('Service deleted successfully!', {
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
      setSelected([]); // This will uncheck all checkboxes

      // Refresh the vendor list
      onDeleteSuccess();
    } catch (error) {
      toast.error('Some service could not be deleted. Please try again.');
    }
  };

  // Function to export table data to Excel
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData); // Convert table data to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Service'); // Append the worksheet to the workbook

    // Format the date and time
    const dateTimeString = formatDateTime();
    const fileName = `Service_${dateTimeString}.xlsx`.replace(/ /g, '_'); // Replace spaces with underscores

    XLSX.writeFile(workbook, fileName); // Download the Excel file

    // Show a success toast message after download
    toast.success('File downloaded successfully!');
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
          placeholder="Search by vechicle id..."
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

      <div>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <Iconify icon="eva:trash-2-fill" />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <Tooltip title="Filter list">
              <IconButton>
                <Iconify icon="ic:round-filter-list" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download as Excel">
              <IconButton onClick={handleDownloadExcel}>
                <Iconify icon="eva:download-fill" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>
    </Toolbar>
  );
}

ServiceTableToolbar.propTypes = {
  tableData: PropTypes.array,
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};
