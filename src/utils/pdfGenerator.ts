import jsPDF from 'jspdf';

export const generatePDF = (type: 'snippet' | 'headlines', content: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  let yPosition = 20;
  
  // Function to clean text
  const cleanText = (text: string) => {
    return text
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
      .replace(/[Ø=ÜĒ]/g, '')         // Remove specific unwanted symbols
      .trim();
  };

  // Function to add footer
  const addFooter = () => {
    const footerText = 'Built with ❤️ by Futurelab Studios';
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const textWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - margin);
  };

  // Function to handle page breaks
  const checkPageBreak = () => {
    if (yPosition > pageHeight - margin * 2) {
      addFooter();
      doc.addPage();
      yPosition = margin;
    }
  };

  // Add title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const title = type === 'snippet' ? 'Market Snippet' : 'News Headlines';
  doc.text(title, margin, yPosition);
  yPosition += lineHeight * 2;

  // Add timestamp
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const timestamp = new Date().toLocaleString();
  doc.text(`Generated on: ${timestamp}`, margin, yPosition);
  yPosition += lineHeight * 2;

  // Set content font
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  if (type === 'snippet') {
    // Format snippet content
    const sections = content.split('\n\n');
    sections.forEach((section: string) => {
      // Skip empty sections and sections starting with @@
      if (!section.trim() || section.trim().startsWith('@@')) {
        return;
      }

      // Clean the section text
      const cleanedSection = cleanText(section);
      if (!cleanedSection) return;

      const lines = doc.splitTextToSize(cleanedSection, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        checkPageBreak();
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight; // Add space between sections
    });
  } else {
    // Format headlines content
    content.forEach(([source, headlines]: [string, string[]]) => {
      // Add source name
      doc.setFont('helvetica', 'bold');
      checkPageBreak();
      doc.text(source, margin, yPosition);
      yPosition += lineHeight * 1.5;

      // Add headlines
      doc.setFont('helvetica', 'normal');
      headlines.forEach((headline: string) => {
        // Clean the headline text
        const cleanedHeadline = cleanText(headline);
        if (!cleanedHeadline) return;

        const lines = doc.splitTextToSize(cleanedHeadline, pageWidth - 2 * margin - 5);
        lines.forEach((line: string) => {
          checkPageBreak();
          doc.text('•', margin, yPosition);
          doc.text(line, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      });
      yPosition += lineHeight; // Add space between sources
    });
  }

  // Add footer on the last page
  addFooter();

  // Save the PDF
  const fileName = `${type === 'snippet' ? 'market-snippet' : 'news-headlines'}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};