// src/components/Export/PDFExportButton.tsx
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFExportButtonProps {
  elementId: string;
  filename?: string;
}

export const PDFExportButton = ({ 
  elementId, 
  filename = 'expense-report.pdf' 
}: PDFExportButtonProps) => {
  const handleExport = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  };

  return (
    <Button 
      variant="contained" 
      onClick={handleExport}
      sx={{ mb: 2 }}
    >
      Export as PDF
    </Button>
  );
};