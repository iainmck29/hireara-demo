import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Analytics, 
  TeamMetrics, 
  Recommendation, 
  ProductivityInsight, 
  ExportOptions,
  TrendData 
} from '@/types';

export interface ExportData {
  analytics: Analytics;
  teamMetrics: TeamMetrics[];
  recommendations: Recommendation[];
  insights: ProductivityInsight[];
  trends: TrendData[];
}

export async function exportToPDF(
  data: ExportData, 
  options: ExportOptions
): Promise<void> {
  const { analytics, teamMetrics, recommendations, insights } = data;
  const { dateRange, includeCharts, sections } = options;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageHeight = pdf.internal.pageSize.height;
  const pageWidth = pdf.internal.pageSize.width;
  let yPosition = 20;

  // Helper function to check if we need a new page
  const checkNewPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TaskFlow Analytics Report', 20, yPosition);
  yPosition += 15;

  // Date range
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Report Period: ${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;

  pdf.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, yPosition);
  yPosition += 20;

  // Overview Section
  if (sections.includes('overview')) {
    checkNewPage(40);
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Overview', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const overviewData = [
      ['Total Tasks', analytics.overview.totalTasks.toString()],
      ['Completed Tasks', analytics.overview.completedTasks.toString()],
      ['In Progress', analytics.overview.inProgressTasks.toString()],
      ['Overdue Tasks', analytics.overview.overdueTasks.toString()],
      ['Completion Rate', `${Math.round((analytics.overview.completedTasks / analytics.overview.totalTasks) * 100)}%`],
    ];

    overviewData.forEach(([label, value]) => {
      pdf.text(`${label}: ${value}`, 25, yPosition);
      yPosition += 6;
    });
    
    yPosition += 10;
  }

  // Team Performance Section
  if (sections.includes('team') && teamMetrics.length > 0) {
    checkNewPage(60);
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Team Performance', 20, yPosition);
    yPosition += 15;

    // Table headers
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const headers = ['Member', 'Completed', 'In Progress', 'Productivity', 'Completion Rate'];
    const colWidths = [50, 25, 25, 25, 35];
    let xPos = 20;
    
    headers.forEach((header, index) => {
      pdf.text(header, xPos, yPosition);
      xPos += colWidths[index];
    });
    yPosition += 8;

    // Table data
    pdf.setFont('helvetica', 'normal');
    teamMetrics.forEach(member => {
      checkNewPage(6);
      xPos = 20;
      const rowData = [
        member.userName,
        member.tasksCompleted.toString(),
        member.tasksInProgress.toString(),
        `${member.productivityScore} pts`,
        `${member.completionRate}%`
      ];
      
      rowData.forEach((data, index) => {
        pdf.text(data, xPos, yPosition);
        xPos += colWidths[index];
      });
      yPosition += 6;
    });
    
    yPosition += 15;
  }

  // Insights Section
  if (sections.includes('insights') && insights.length > 0) {
    checkNewPage(40);
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Insights', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    insights.forEach(insight => {
      checkNewPage(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text(insight.metric, 25, yPosition);
      yPosition += 6;
      
      pdf.setFont('helvetica', 'normal');
      const trendIcon = insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : '→';
      pdf.text(`Current: ${insight.value} ${insight.change !== 0 ? `(${trendIcon} ${Math.abs(insight.change)})` : ''}`, 30, yPosition);
      yPosition += 6;
      pdf.text(`Period: ${insight.period} ${insight.comparison}`, 30, yPosition);
      yPosition += 10;
    });
  }

  // Recommendations Section
  if (sections.includes('recommendations') && recommendations.length > 0) {
    checkNewPage(40);
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommendations', 20, yPosition);
    yPosition += 15;

    recommendations.forEach((rec, index) => {
      checkNewPage(25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${rec.title}`, 25, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Description
      const splitDescription = pdf.splitTextToSize(rec.description, pageWidth - 50);
      pdf.text(splitDescription, 30, yPosition);
      yPosition += splitDescription.length * 4 + 3;
      
      // Impact and confidence
      pdf.text(`Impact: ${rec.impact.toUpperCase()} | Confidence: ${rec.confidence}%`, 30, yPosition);
      yPosition += 6;
      
      // Suggested action
      if (rec.suggestedAction) {
        pdf.setFont('helvetica', 'italic');
        const splitAction = pdf.splitTextToSize(`Action: ${rec.suggestedAction}`, pageWidth - 50);
        pdf.text(splitAction, 30, yPosition);
        yPosition += splitAction.length * 4 + 8;
      } else {
        yPosition += 8;
      }
    });
  }

  // Charts Section (if enabled)
  if (includeCharts && sections.includes('charts')) {
    // Note: In a real implementation, you would capture chart images
    // For this demo, we'll add a placeholder
    checkNewPage(30);
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Charts and Visualizations', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Charts would be captured and included here in a full implementation.', 25, yPosition);
    pdf.text('This requires additional client-side canvas capture functionality.', 25, yPosition + 6);
  }

  // Footer
  const pageCount = pdf.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
    pdf.text('Generated by TaskFlow Analytics', 20, pageHeight - 10);
  }

  // Save the PDF
  const fileName = `taskflow-analytics-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}

export function exportToCSV(data: ExportData, options: ExportOptions): void {
  const { teamMetrics, analytics, insights } = data;
  const { sections } = options;
  
  let csvContent = 'data:text/csv;charset=utf-8,';
  
  // Overview data
  if (sections.includes('overview')) {
    csvContent += 'TaskFlow Analytics Report\n';
    csvContent += `Generated,${new Date().toISOString()}\n`;
    csvContent += `Report Period,${options.dateRange.start} to ${options.dateRange.end}\n\n`;
    
    csvContent += 'Overview Metrics\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Total Tasks,${analytics.overview.totalTasks}\n`;
    csvContent += `Completed Tasks,${analytics.overview.completedTasks}\n`;
    csvContent += `In Progress Tasks,${analytics.overview.inProgressTasks}\n`;
    csvContent += `Overdue Tasks,${analytics.overview.overdueTasks}\n`;
    csvContent += `Completion Rate,${Math.round((analytics.overview.completedTasks / analytics.overview.totalTasks) * 100)}%\n\n`;
  }

  // Team performance data
  if (sections.includes('team') && teamMetrics.length > 0) {
    csvContent += 'Team Performance\n';
    csvContent += 'Member,Department,Completed Tasks,In Progress,Avg Completion Time,Productivity Score,Completion Rate\n';
    
    teamMetrics.forEach(member => {
      csvContent += `"${member.userName}","${member.department}",${member.tasksCompleted},${member.tasksInProgress},${member.averageCompletionTime},${member.productivityScore},${member.completionRate}\n`;
    });
    csvContent += '\n';
  }

  // Insights data
  if (sections.includes('insights') && insights.length > 0) {
    csvContent += 'Key Insights\n';
    csvContent += 'Metric,Value,Change,Trend,Period,Comparison\n';
    
    insights.forEach(insight => {
      csvContent += `"${insight.metric}",${insight.value},${insight.change},"${insight.trend}","${insight.period}","${insight.comparison}"\n`;
    });
  }

  // Create and download file
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `taskflow-analytics-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: ExportData, options: ExportOptions): void {
  const exportData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      reportPeriod: options.dateRange,
      sections: options.sections,
      includeCharts: options.includeCharts,
    },
    ...data,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `taskflow-analytics-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export async function captureChartAsImage(chartElement: HTMLElement): Promise<string> {
  try {
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing chart:', error);
    return '';
  }
}