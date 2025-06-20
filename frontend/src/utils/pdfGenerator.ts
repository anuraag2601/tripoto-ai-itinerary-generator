import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function createPDFItineraryObject(itinerary: any) {
  return {
    title: itinerary.title || `${itinerary.destination?.name || 'Unknown'} Adventure`,
    description: itinerary.description || 'A personalized travel itinerary crafted just for you',
    destination: {
      name: itinerary.destination?.name || 'Unknown Destination',
      country: itinerary.destination?.country || 'Unknown Country'
    },
    duration: {
      days: itinerary.duration?.days || (itinerary.activities || []).length || 1,
      startDate: itinerary.duration?.startDate,
      endDate: itinerary.duration?.endDate
    },
    budget: {
      total: itinerary.budget?.total || 0,
      currency: itinerary.budget?.currency || 'USD'
    },
    activities: (itinerary.activities || []).map(activity => ({
      id: activity.id || `activity-${Math.random()}`,
      name: activity.name || 'Unnamed Activity',
      description: activity.description,
      type: activity.type || 'general',
      location: {
        name: activity.location?.name || 'Unknown Location'
      },
      day: activity.day || 1,
      timeSlot: activity.timeSlot,
      cost: activity.cost ? {
        amount: activity.cost.amount,
        currency: activity.cost.currency
      } : undefined
    }))
  };
}

export interface Itinerary {
  title: string;
  description: string;
  destination: {
    name: string;
    country: string;
  };
  duration: {
    days: number;
    startDate?: string;
    endDate?: string;
  };
  budget: {
    total: number;
    currency: string;
  };
  activities: Array<{
    id: string;
    name: string;
    description?: string;
    type: string;
    location: {
      name: string;
    };
    day: number;
    timeSlot?: string;
    cost?: {
      amount: number;
      currency: string;
    };
  }>;
}

export async function generateSimpleItineraryPDF(itinerary: Itinerary): Promise<void> {
  try {
    console.log('Generating simple PDF for itinerary:', itinerary.title);
    
    // Create a new PDF document
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 7;
    let yPosition = 30;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFont('helvetica', 'normal');
      }
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yPosition > 270) { // Check if we need a new page
          pdf.addPage();
          yPosition = 30;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 3; // Extra spacing after each section
    };

    // Add title
    addText(itinerary.title, 20, true);
    yPosition += 5;

    // Add destination and duration
    addText(`Destination: ${itinerary.destination.name}, ${itinerary.destination.country}`, 14, true);
    addText(`Duration: ${itinerary.duration.days} days`, 12);
    
    if (itinerary.duration.startDate && itinerary.duration.endDate) {
      addText(`Dates: ${itinerary.duration.startDate} to ${itinerary.duration.endDate}`, 12);
    }
    
    addText(`Budget: ${itinerary.budget.currency} ${itinerary.budget.total}`, 12);
    yPosition += 10;

    // Add description
    if (itinerary.description) {
      addText('Description:', 14, true);
      addText(itinerary.description, 12);
      yPosition += 5;
    }

    // Group activities by day - add safety check for activities array
    const activityByDay: { [key: number]: typeof itinerary.activities } = {};
    (itinerary.activities || []).forEach(activity => {
      if (!activityByDay[activity.day]) {
        activityByDay[activity.day] = [];
      }
      activityByDay[activity.day].push(activity);
    });

    // Add activities day by day - add safety check for empty activities
    if (itinerary.activities && itinerary.activities.length > 0) {
      Object.keys(activityByDay)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .forEach(dayKey => {
          const day = parseInt(dayKey);
          const activities = activityByDay[day];
          
          addText(`Day ${day}:`, 16, true);
          
          activities.forEach(activity => {
            let activityText = `• ${activity.name}`;
            if (activity.location?.name) {
              activityText += ` (${activity.location.name})`;
            }
            if (activity.timeSlot) {
              activityText += ` - ${activity.timeSlot}`;
            }
            addText(activityText, 12);
            
            if (activity.description) {
              addText(`  ${activity.description}`, 10);
            }
            
            if (activity.cost) {
              addText(`  Cost: ${activity.cost.currency} ${activity.cost.amount}`, 10);
            }
          });
          
          yPosition += 5;
        });
    } else {
      addText('No activities scheduled yet.', 12);
    }

    // Save the PDF
    const fileName = `${itinerary.destination.name.replace(/\s+/g, '-')}-itinerary.pdf`;
    pdf.save(fileName);
    
    console.log('Simple PDF generated successfully:', fileName);
  } catch (error) {
    console.error('Error generating simple PDF:', error);
    throw error;
  }
}

export async function generateItineraryPDF(itinerary: Itinerary, elementId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Add a delay to ensure content is rendered
    setTimeout(async () => {
      try {
        console.log('Starting PDF generation for element:', elementId);
        
        const element = document.getElementById(elementId);
        if (!element) {
          throw new Error(`Element with ID "${elementId}" not found`);
        }

        // Check if element has visible content
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          throw new Error('Element has no visible content');
        }

        // Temporarily activate overview tab for PDF generation
        const overviewTab = document.querySelector('[data-tab="overview"]') as HTMLElement;
        const overviewContent = document.querySelector('[data-content="overview"]') as HTMLElement;
        
        if (overviewTab && overviewContent) {
          // Click overview tab to ensure it's active
          overviewTab.click();
          
          // Wait a bit for tab switch
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('Element found, creating canvas...');
        
        // Create canvas from element
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          height: element.scrollHeight,
          width: element.scrollWidth
        });

        console.log('Canvas created, generating PDF...');

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Save the PDF
        const fileName = `${itinerary.destination.name.replace(/\s+/g, '-')}-itinerary.pdf`;
        pdf.save(fileName);
        
        console.log('PDF generated successfully:', fileName);
        resolve();
      } catch (error) {
        console.error('Error generating PDF:', error);
        reject(error);
      }
    }, 1000);
  });
}  