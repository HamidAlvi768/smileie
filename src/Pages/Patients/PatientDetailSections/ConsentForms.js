import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardBody, Table, Button, Alert } from 'reactstrap';
import { getConsentFormViewAPI } from '../../../helpers/api_helper';
import { useToast } from '../../../components/Common/ToastContext';
import ShimmerLoader from '../../../components/Common/ShimmerLoader';

const ConsentForms = ({ patientId = null, patient = null }) => {
  const showToast = useToast();
  const [consentForms, setConsentForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchConsentForms = useCallback(async () => {
    if (!patientId) return;
    
    setLoading(true);
    
    try {
      const response = await getConsentFormViewAPI(patientId);
      
      if (response?.status === 'success' && response.data) {
        setConsentForms(response.data);
      } else if (response?.status === 'error') {
        // Don't show error toast, just set empty data
        setConsentForms([]);
      } else {
        setConsentForms([]);
      }
    } catch (err) {
      console.error('Error fetching consent forms:', err);
      // Don't show error toast, just set empty data
      setConsentForms([]);
    } finally {
      setLoading(false);
    }
  }, [patientId, showToast]);

  useEffect(() => {
    if (patientId) {
      fetchConsentForms();
    }
  }, [patientId, fetchConsentForms]);

  // Memoized print content generation
  const generatePrintContent = useMemo(() => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return `
      <div class="header">
        <div class="patient-id">Public ID: ${patient?.public_id || patientId || 'Not Available'}</div>
        <div class="date">Date: ${currentDate}</div>
      </div>
      
      <div class="consent-content">
        <h1 class="form-title">Consent Form</h1>
        <table class="consent-table">
          <thead>
            <tr>
              <th class="question-number">#</th>
              <th class="question-text">Question</th>
              <th class="answer-text">Answer</th>
            </tr>
          </thead>
          <tbody>
            ${consentForms.map((form, index) => `
              <tr class="question-row">
                <td class="question-number">${index + 1}</td>
                <td class="question-text">${form.question || 'Question not available'}</td>
                <td class="answer-text">${form.answer || 'No response provided'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }, [consentForms, patientId]);

  // Memoized HTML template
  const getHtmlTemplate = useCallback((content) => `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Consent Form - ${patient?.public_id || patientId}</title>
        <meta charset="utf-8">
        <style>
          * {
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            color: #2c3e50;
            background-color: #ffffff;
            font-size: 12px;
          }
          
          /* Header Styles */
          .header {
            margin-bottom: 30px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .patient-id {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2c3e50;
          }
          
          .date {
            font-size: 1.1rem;
            color: #7f8c8d;
          }
          
          /* Content Styles */
          .consent-content {
            margin: 20px 0;
          }
          
          .form-title {
            text-align: center;
            color: #2c3e50;
            margin: 0 0 25px 0;
            font-size: 2rem;
            font-weight: 700;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
          }
          
          .consent-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .consent-table thead {
            background: linear-gradient(135deg, #3498db, #2980b9);
          }
          
          .consent-table th {
            color: white;
            font-weight: 600;
            padding: 15px 12px;
            text-align: left;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .consent-table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            vertical-align: top;
          }
          
          .consent-table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          
          .consent-table tbody tr:hover {
            background-color: #e3f2fd;
          }
          
          .question-number {
            text-align: center;
            font-weight: 600;
            color: #3498db;
            width: 60px;
          }
          
          .question-text {
            font-weight: 600;
            color: #2c3e50;
            width: 45%;
          }
          
          .answer-text {
            color: #34495e;
            width: 45%;
          }
          
          /* Print-specific styles */
          @media print {
            body { 
              margin: 0.5in;
              font-size: 10pt;
              line-height: 1.4;
            }
            
            .header {
              margin-bottom: 20px;
              padding-bottom: 15px;
            }
            
            .patient-id {
              font-size: 1.1rem;
            }
            
            .date {
              font-size: 1rem;
            }
            
            .form-title {
              font-size: 1.5rem;
              margin-bottom: 20px;
              padding-bottom: 10px;
            }
            
            .consent-table th,
            .consent-table td {
              padding: 8px 10px;
              font-size: 9pt;
            }
            
            .consent-table thead {
              background: #3498db !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            .consent-table tbody tr:nth-child(even) {
              background-color: #f8f9fa !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            /* Page breaks */
            .consent-table {
              page-break-inside: auto;
            }
            
            .consent-table tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
          
          /* PDF optimization */
          @page {
            margin: 0.5in;
            size: A4;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `, [patientId]);

  const handlePrint = useCallback(async () => {
    if (isPrinting) return;
    
    setIsPrinting(true);
    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        showToast({ message: 'Please allow popups to print', type: 'warning', title: 'Print Blocked' });
        return;
      }

      const htmlContent = getHtmlTemplate(generatePrintContent);
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load before printing
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
      
      showToast({ message: 'Print dialog opened', type: 'success', title: 'Print' });
    } catch (err) {
      console.error('Print error:', err);
      showToast({ message: 'Failed to open print dialog', type: 'error', title: 'Error' });
    } finally {
      setIsPrinting(false);
    }
  }, [isPrinting, generatePrintContent, getHtmlTemplate, showToast]);

  const handleDownload = useCallback(async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const htmlContent = getHtmlTemplate(generatePrintContent);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const formattedDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const patientIdentifier = patient?.public_id || patientId;
      link.download = `ConsentForm_${patientIdentifier}_${formattedDate}.html`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast({ message: 'Consent form downloaded successfully', type: 'success', title: 'Download' });
    } catch (err) {
      console.error('Download error:', err);
      showToast({ message: 'Failed to download consent form', type: 'error', title: 'Error' });
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, generatePrintContent, getHtmlTemplate, patientId, showToast]);

  // Memoized table rows for better performance
  const tableRows = useMemo(() => {
    return consentForms.map((form, index) => (
      <tr key={`consent-${index}`} className="consent-form-row">
        <td>
          <span className="badge bg-primary rounded-pill">{index + 1}</span>
        </td>
        <td>
          <div className="fw-semibold text-dark">
            {form.question || 'N/A'}
          </div>
        </td>
        <td>
          <div className="text-muted">
            {form.answer || 'N/A'}
          </div>
        </td>
      </tr>
    ));
  }, [consentForms]);

  if (!patientId && !patient) {
    return (
      <div className="consent-forms-section">
        <Alert color="info" className="text-center">
          <i className="ri-information-line me-2"></i>
          Please select a patient to view consent forms.
        </Alert>
      </div>
    );
  }

  return (
    <div className="consent-forms-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">Consent Forms</h4>
          <small className="text-muted">
            {patient?.name ? `${patient.name} (${patient.public_id || patientId})` : `Patient ID: ${patientId}`}
          </small>
        </div>
        {consentForms.length > 0 && (
          <div className="d-flex gap-2">
            <Button 
              color="outline-primary" 
              size="sm" 
              onClick={handlePrint}
              disabled={isPrinting}
              className="d-flex align-items-center"
            >
              {isPrinting ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Printing...
                </>
              ) : (
                <>
                  <i className="ri-printer-line me-1"></i>
                  Print
                </>
              )}
            </Button>
            <Button 
              color="outline-success" 
              size="sm" 
              onClick={handleDownload}
              disabled={isDownloading}
              className="d-flex align-items-center"
            >
              {isDownloading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Downloading...
                </>
              ) : (
                <>
                  <i className="ri-download-line me-1"></i>
                  Download
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <Card className="shadow-sm">
        <CardBody className="p-0">
          {loading ? (
            <div className="p-4">
              <ShimmerLoader type="table" lines={5} />
            </div>
          ) : consentForms.length > 0 ? (
            <div className="table-responsive">
              <Table className="table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '10%' }}>#</th>
                    <th style={{ width: '45%' }}>Question</th>
                    <th style={{ width: '45%' }}>Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted py-5">
              <div className="mb-3">
                <i className="ri-file-list-3-line" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
              </div>
              <h5 className="mb-2">No Consent Forms Available</h5>
              <p className="mb-0 text-muted">
                This patient has not completed the consent form yet.
              </p>
              <small className="text-muted">
                Consent forms will appear here once the patient submits their responses.
              </small>
            </div>
            )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ConsentForms; 