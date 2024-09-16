// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import PropTypes from 'prop-types';
import Barcode from 'react-barcode';
import { toast } from 'react-hot-toast';
import { renderToStaticMarkup } from 'react-dom/server';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function VechiclesTableToolbar({
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
      toast.error('No vechicle selected to delete!');
      return;
    }

    // Create an array of delete promises
    const deletePromises = selected.map(async (vechicleID) => {
      const apiUrl = `https://vlmtrs.onrender.com/v1/vehicle/delete/${vechicleID}`;
      try {
        const response = await fetch(apiUrl, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Failed to delete vechicle with ID: ${vechicleID}`);
        }
        return response.json();
      } catch (error) {
        console.error(`Error deleting vechicle with ID: ${vechicleID}`, error);
        throw error;
      }
    });

    try {
      // Wait for all delete requests to finish
      await Promise.all(deletePromises);
      toast.success('Vechicle deleted successfully!', {
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
      toast.error('Some vechicle could not be deleted. Please try again.');
    }
  };

  console.log(tableData);

  const generateBarcodeImage = async (value) => {
    try {
      // Render the barcode SVG
      const barcodeSvg = renderToStaticMarkup(<Barcode value={value} />);

      if (!barcodeSvg || !barcodeSvg.includes('<svg')) {
        throw new Error('Invalid SVG content generated');
      }

      // Encode the SVG to base64
      const encodedSvg = btoa(barcodeSvg);
      console.log(barcodeSvg);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = `data:image/svg+xml;base64,${encodedSvg}`;
      console.log(img);
      return new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        };

        img.onerror = (error) => {
          reject(new Error(`Error loading image: ${error.message}`));
        };
      });
    } catch (error) {
      console.error('Error generating barcode image:', error);
      throw error;
    }
  };

  const handleDownloadExcel = async () => {
    console.log('Starting to download Excel');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vehicles');

    worksheet.addRow([
      'ID',
      'Vehicle ID',
      'Model Name',
      'VIN',
      'Dealer ID',
      'Chassis No',
      'Motor No',
      'Battery No',
      'Batch No',
      'Color Code',
      'MFG Date',
      'Created At',
      'Updated At',
      'Barcode',
    ]);

    console.log('Headers added to worksheet');

    try {
      const barcodeImages = await Promise.all(
        tableData.map(async (item) => {
          if (item.barcodeImage) {
            return { id: item.id, barcodeImage: item.barcodeImage };
          }
          console.log(item.barcode);
          console.log(`Generating barcode for barcode: ${item.barcode}`);
          const barcodeImage = await generateBarcodeImage(item.barcode);
          return { id: item.id, barcodeImage };
        })
      );

      console.log('Barcode images generated');

      tableData.forEach((item, index) => {
        worksheet.addRow([
          item.id,
          item.vehicle_id,
          item.model_name,
          item.vin,
          item.dealer_id,
          item.chassis_no,
          item.motor_no,
          item.battery_no,
          item.batch_no,
          item.color_code,
          item.mfg_date,
          item.createdAt,
          item.updatedAt,
        ]);

        const barcodeImage = barcodeImages.find((img) => img.id === item.id);

        if (barcodeImage) {
          console.log(`Adding barcode for ID: ${item.id}`);
          const imageId = workbook.addImage({
            base64: barcodeImage.barcodeImage,
            extension: 'png',
          });
          worksheet.addImage(imageId, {
            tl: { col: 13, row: index + 2 },
            ext: { width: 150, height: 60 },
          });
        }
      });

      console.log('Rows and barcode images added to worksheet');

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Vehicles_${formatDateTime()}.xlsx`.replace(/ /g, '_');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('File download triggered');

      toast.success('File downloaded successfully!');
    } catch (error) {
      console.error('Error during Excel download process:', error); // Debug: Catch and log errors
      toast.error('Failed to download the file. Please try again.');
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
          placeholder="Search by Chassis No..."
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

VechiclesTableToolbar.propTypes = {
  tableData: PropTypes.array,
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};
