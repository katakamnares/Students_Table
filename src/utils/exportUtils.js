import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename = 'Students_List.xlsx') => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  // Create a clean worksheet data without internal IDs if desired, 
  // though having IDs could be useful. We'll map to user-friendly columns.
  const exportData = data.map(({ name, email, age }) => ({
    Name: name,
    Email: email,
    Age: age,
  }));

  // Create a workbook and a worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

  // Trigger the download
  XLSX.writeFile(workbook, filename);
};
