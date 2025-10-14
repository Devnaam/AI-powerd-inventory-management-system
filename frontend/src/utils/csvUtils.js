import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// CSV Template Structure
export const productTemplate = [
  {
    productId: 'PROD001',
    name: 'Sample Product',
    sku: 'SKU-001',
    category: 'Electronics',
    price: 100,
    quantity: 50,
    supplier: 'Sample Supplier',
    reorderLevel: 10,
    description: 'Product description here'
  }
];

// Validate Product Data
export const validateProductData = (data) => {
  const errors = [];
  const requiredFields = ['productId', 'name', 'sku', 'category', 'price', 'quantity', 'reorderLevel'];

  data.forEach((row, index) => {
    const rowErrors = [];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!row[field] || row[field].toString().trim() === '') {
        rowErrors.push(`Missing ${field}`);
      }
    });

    // Validate data types
    if (row.price && isNaN(Number(row.price))) {
      rowErrors.push('Price must be a number');
    }
    if (row.quantity && isNaN(Number(row.quantity))) {
      rowErrors.push('Quantity must be a number');
    }
    if (row.reorderLevel && isNaN(Number(row.reorderLevel))) {
      rowErrors.push('Reorder level must be a number');
    }

    // Validate positive numbers
    if (row.price && Number(row.price) < 0) {
      rowErrors.push('Price cannot be negative');
    }
    if (row.quantity && Number(row.quantity) < 0) {
      rowErrors.push('Quantity cannot be negative');
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: index + 2, // +2 because Excel/CSV starts at row 1 and has headers
        errors: rowErrors
      });
    }
  });

  return errors;
};

// Parse CSV File
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Parse Excel File
export const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Export to CSV
export const exportToCSV = (data, filename = 'products.csv') => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

// Export to Excel
export const exportToExcel = (data, filename = 'products.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  
  // Auto-size columns
  const maxWidth = 20;
  const wscols = Object.keys(data[0] || {}).map(() => ({ wch: maxWidth }));
  worksheet['!cols'] = wscols;
  
  XLSX.writeFile(workbook, filename);
};

// Download Template
export const downloadTemplate = (format = 'csv') => {
  if (format === 'csv') {
    exportToCSV(productTemplate, 'product_template.csv');
  } else {
    exportToExcel(productTemplate, 'product_template.xlsx');
  }
};

// Format products for export
export const formatProductsForExport = (products) => {
  return products.map(p => ({
    productId: p.productId,
    name: p.name,
    sku: p.sku,
    category: p.category,
    price: p.price,
    quantity: p.quantity,
    supplier: p.supplier,
    reorderLevel: p.reorderLevel,
    description: p.description || ''
  }));
};
