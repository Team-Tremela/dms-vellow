// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { useState } from 'react';
import JsBarcode from 'jsbarcode';
import PropTypes from 'prop-types';
// import Barcode from 'react-barcode';
import { toast } from 'react-hot-toast';
// import { renderToStaticMarkup } from 'react-dom/server';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Popover from '@mui/material/Popover';
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

  const [deletePopoverOpen, setDeletePopoverOpen] = useState(null);

  // const id = open ? 'delete-popover' : undefined;
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

  console.log(tableData);

  const generateBarcodeImage = (value) =>
    new Promise((resolve, reject) => {
      // Create a temporary canvas element
      const canvas = document.createElement('canvas');

      try {
        JsBarcode(canvas, value, {
          format: 'CODE128',
          height: 30, // Adjust height here
          width: 4,
          displayValue: true, // Enable displaying the value below the barcode
          fontSize: 24, // Adjust the font size as needed
          textMargin: 10, // Margin between the barcode and the text
        });

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        console.error('Error generating barcode image:', error);
        reject(error);
      }
    });

  const handleDownloadExcel = async () => {
    console.log('Starting to download Excel');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vehicles');

    // Define center alignment style
    const centerAlignStyle = {
      alignment: {
        vertical: 'middle',
        horizontal: 'center',
      },
    };

    // Add headers
    const headerRow = worksheet.addRow([
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

    // Apply center alignment to header row
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.style = centerAlignStyle;
    });

    console.log('Headers added to worksheet');

    // Set column width and row height
    worksheet.columns = [
      { width: 20 }, // Adjust widths as needed for other columns
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 60 },
      { width: 20 },
      { width: 40 },
      { width: 40 },
    ];

    worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
      if (rowIndex > 1) {
        // Skip header row
        worksheet.getRow(rowIndex).height = 200; // Set height for each row

        // Apply center alignment style to each cell
        row.eachCell(centerAlignStyle);
      }
    });

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
        worksheet
          .addRow([
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
          ])
          .eachCell({ includeEmpty: true }, (cell) => {
            cell.style = centerAlignStyle;
          }); // Apply center alignment to each row

        const barcodeImage = barcodeImages.find((img) => img.id === item.id);

        if (barcodeImage) {
          console.log(`Adding barcode for ID: ${item.id}`);
          const imageId = workbook.addImage({
            base64: barcodeImage.barcodeImage,
            extension: 'png',
          });

          const rowIndex = index + 1; // Since row index starts from 2 (1 for header)
          const rowIndexs = index + 2; // Since row index starts from 2 (1 for header)
          console.log(rowIndex);

          // Calculate the cell where the image should be placed
          worksheet.addImage(imageId, {
            tl: { col: 13, row: rowIndex }, // Top-left corner of image (cell B2 is col 1, row 1)
            ext: { width: 200, height: 100 }, // Adjust image dimensions to fit within cell
          });

          // Adjust column width and row height to match the image size
          worksheet.getColumn(13).width = 30; // Width of column B (Adjust as needed)
          worksheet.getColumn(14).width = 30; // Width of column B (Adjust as needed)
          worksheet.getRow(rowIndexs).height = 100; // Height of row 2 (Adjust as needed)
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

  // const handleDownloadExcel = async () => {
  //   console.log('Starting to download Excel');

  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Vehicles');

  //   // Add headers
  //   worksheet.addRow([
  //     'ID',
  //     'Vehicle ID',
  //     'Model Name',
  //     'VIN',
  //     'Dealer ID',
  //     'Chassis No',
  //     'Motor No',
  //     'Battery No',
  //     'Batch No',
  //     'Color Code',
  //     'MFG Date',
  //     'Created At',
  //     'Updated At',
  //     'Barcode',
  //   ]);

  //   console.log('Headers added to worksheet');
  //   // Set column width and row height
  //   worksheet.columns = [
  //     { width: 20 }, // Adjust widths as needed for other columns
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 20 },
  //     { width: 40 },
  //     { width: 40 },
  //   ];

  //   try {
  //     const barcodeImages = await Promise.all(
  //       tableData.map(async (item) => {
  //         if (item.barcodeImage) {
  //           return { id: item.id, barcodeImage: item.barcodeImage };
  //         }
  //         console.log(item.barcode);
  //         console.log(`Generating barcode for barcode: ${item.barcode}`);
  //         const barcodeImage = await generateBarcodeImage(item.barcode);
  //         return { id: item.id, barcodeImage };
  //       })
  //     );

  //     console.log('Barcode images generated');

  //     tableData.forEach((item, index) => {
  //       worksheet.addRow([
  //         item.id,
  //         item.vehicle_id,
  //         item.model_name,
  //         item.vin,
  //         item.dealer_id,
  //         item.chassis_no,
  //         item.motor_no,
  //         item.battery_no,
  //         item.batch_no,
  //         item.color_code,
  //         item.mfg_date,
  //         item.createdAt,
  //         item.updatedAt,
  //       ]);

  //       const barcodeImage = barcodeImages.find((img) => img.id === item.id);

  //       if (barcodeImage) {
  //         console.log(`Adding barcode for ID: ${item.id}`);
  //         const imageId = workbook.addImage({
  //           base64: barcodeImage.barcodeImage,
  //           extension: 'png',
  //         });

  //         const rowIndex = index + 1; // Since row index starts from 2 (1 for header)
  //         const rowIndexs = index + 2; // Since row index starts from 2 (1 for header)
  //         console.log(rowIndex);

  //         // Calculate the cell where the image should be placed
  //         worksheet.addImage(imageId, {
  //           tl: { col: 13, row: rowIndex }, // Top-left corner of image (cell B2 is col 1, row 1)
  //           ext: { width: 100, height: 100 }, // Adjust image dimensions to fit within cell
  //         });

  //         // Adjust column width and row height to match the image size
  //         worksheet.getColumn(13).width = 30; // Width of column B (Adjust as needed)
  //         worksheet.getColumn(14).width = 30; // Width of column B (Adjust as needed)
  //         worksheet.getRow(rowIndexs).height = 100; // Height of row 2 (Adjust as needed)

  //         // worksheet.addImage(imageId, {
  //         //   tl: { col: 13, row: rowIndex }, // Column N is 13 (0-indexed), dynamic row
  //         //   ext: { width: 150, height: 60 },
  //         // });
  //       }
  //     });

  //     console.log('Rows and barcode images added to worksheet');

  //     const buffer = await workbook.xlsx.writeBuffer();
  //     const blob = new Blob([buffer], {
  //       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     });

  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `Vehicles_${formatDateTime()}.xlsx`.replace(/ /g, '_');
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     console.log('File download triggered');

  //     toast.success('File downloaded successfully!');
  //   } catch (error) {
  //     console.error('Error during Excel download process:', error); // Debug: Catch and log errors
  //     toast.error('Failed to download the file. Please try again.');
  //   }
  // };

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
          <>
            <Tooltip title="Delete">
              <IconButton onClick={handleOpenDeletePopover}>
                <Iconify icon="eva:trash-2-fill" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mail">
              <IconButton>
                <Iconify icon="eva:email-fill" />
              </IconButton>
            </Tooltip>

            <Popover
              open={Boolean(deletePopoverOpen)}
              anchorEl={deletePopoverOpen}
              onClose={handleCloseDeletePopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              <Typography sx={{ p: 2 }}>Are you sure you want to delete?</Typography>
              <div style={{ display: 'flex', padding: '10px', justifyContent:"center" }}>
                <Button variant="contained" color="inherit" onClick={handleDelete} style={{marginRight:"10px"}}>
                  Yes
                </Button>
                <Button color="primary" onClick={handleCloseDeletePopover} style={{marginLeft:"10px"}}>
                  No
                </Button>
              </div>
            </Popover>
          </>
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
