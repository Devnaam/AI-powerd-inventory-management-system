import { useState } from 'react';
import { parseCSV, parseExcel, validateProductData, downloadTemplate } from '../../utils/csvUtils';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const BulkImportModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Importing

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      let data;
      if (fileExtension === 'csv') {
        data = await parseCSV(selectedFile);
      } else {
        data = await parseExcel(selectedFile);
      }

      // Validate data
      const validationErrors = validateProductData(data);
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        toast.error(`Found ${validationErrors.length} validation errors`);
      } else {
        setErrors([]);
        toast.success('File validated successfully!');
      }

      setParsedData(data);
      setStep(2);
    } catch (error) {
      toast.error('Failed to parse file. Please check the format.');
      console.error('Parse error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (errors.length > 0) {
      toast.error('Please fix validation errors before importing');
      return;
    }

    setStep(3);
    setLoading(true);

    try {
      let successCount = 0;
      let failCount = 0;

      for (const product of parsedData) {
        try {
          await api.post('/products', {
            ...product,
            price: Number(product.price),
            quantity: Number(product.quantity),
            reorderLevel: Number(product.reorderLevel)
          });
          successCount++;
        } catch (error) {
          failCount++;
          console.error('Failed to import:', product.productId, error);
        }
      }

      toast.success(`Successfully imported ${successCount} products!`);
      if (failCount > 0) {
        toast.error(`Failed to import ${failCount} products`);
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Import failed. Please try again.');
      console.error('Import error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bulk Import Products</h2>
            <p className="text-sm text-gray-500 mt-1">Upload CSV or Excel file to import multiple products</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Download Template */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-1">Need a template?</h3>
                    <p className="text-sm text-blue-700 mb-3">Download our template to see the required format</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadTemplate('csv')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Download CSV Template
                      </button>
                      <button
                        onClick={() => downloadTemplate('xlsx')}
                        className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        Download Excel Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {loading ? 'Processing file...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500">CSV or Excel files only</p>
                </label>
              </div>

              {/* Required Fields Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Required Fields:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['productId', 'name', 'sku', 'category', 'price', 'quantity', 'reorderLevel'].map(field => (
                    <div key={field} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 font-medium">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Summary */}
              {/* <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Preview Data</h3>
                  <p className="text-sm text-gray-500">Found {parsedData.length} products</p>
                </div>
                <button
                  onClick={resetUpload}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Upload Different File
                </button>
              </div> */}

              {/* Success Message */}
              {errors.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-green-900">File validated successfully!</h4>
                      <p className="text-sm text-green-700">All {parsedData.length} products are ready to import</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Validation Errors ({errors.length})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                        <strong>Row {error.row}:</strong> {error.errors.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Preview Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-96 scrollbar-thin">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                      <tr>
                        {parsedData[0] && Object.keys(parsedData[0]).map(key => (
                          <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parsedData.slice(0, 10).map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value, i) => (
                            <td key={i} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.length > 10 && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 text-center">
                    Showing 10 of {parsedData.length} products
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Importing */}
          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Importing Products...</h3>
              <p className="text-sm text-gray-500">Please wait while we import your products</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          {step === 1 && (
            <div className="flex items-center justify-between w-full">
              <div></div>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          )}

          {step === 2 && (
            <>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={resetUpload}
                >
                  Upload Different File
                </Button>
                <Button
                  variant="primary"
                  onClick={handleImport}
                  disabled={errors.length > 0 || loading}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  }
                >
                  Import {parsedData.length} Products
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="w-full text-center">
              <p className="text-sm text-gray-500">Importing in progress...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;
