'use client';

import { useState } from 'react';
import { ExportOptions } from '@/types';
import { Download, FileText, Table, Code, Settings, Calendar } from 'lucide-react';
import { exportToPDF, exportToCSV, exportToJSON, ExportData } from '@/lib/exportUtils';

interface ExportControlsProps {
  data: ExportData;
  className?: string;
}

export default function ExportControls({ data, className = '' }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    includeCharts: true,
    sections: ['overview', 'team', 'insights', 'recommendations'],
  });

  const formatOptions = [
    { 
      value: 'pdf' as const, 
      label: 'PDF Report', 
      icon: FileText, 
      description: 'Comprehensive formatted report',
      color: 'text-red-600'
    },
    { 
      value: 'csv' as const, 
      label: 'CSV Data', 
      icon: Table, 
      description: 'Raw data for analysis',
      color: 'text-green-600'
    },
    { 
      value: 'json' as const, 
      label: 'JSON Export', 
      icon: Code, 
      description: 'Structured data format',
      color: 'text-blue-600'
    },
  ];

  const sectionOptions = [
    { id: 'overview', label: 'Overview Metrics', description: 'Basic task statistics and completion rates' },
    { id: 'team', label: 'Team Performance', description: 'Individual and team productivity metrics' },
    { id: 'insights', label: 'Key Insights', description: 'Productivity trends and analysis' },
    { id: 'recommendations', label: 'AI Recommendations', description: 'Suggested actions and improvements' },
    { id: 'charts', label: 'Charts & Visualizations', description: 'Graphical data representations (PDF only)' },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      switch (exportOptions.format) {
        case 'pdf':
          await exportToPDF(data, exportOptions);
          break;
        case 'csv':
          exportToCSV(data, exportOptions);
          break;
        case 'json':
          exportToJSON(data, exportOptions);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    setExportOptions(prev => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter(id => id !== sectionId)
        : [...prev.sections, sectionId],
    }));
  };

  const getEstimatedSize = () => {
    const baseSize = exportOptions.sections.length * 0.5;
    const chartSize = exportOptions.includeCharts ? 2 : 0;
    const formatMultiplier = exportOptions.format === 'pdf' ? 3 : exportOptions.format === 'json' ? 1.5 : 0.5;
    
    return Math.round(baseSize + chartSize * formatMultiplier * 100) / 100;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Export Analytics</h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
        </button>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {formatOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setExportOptions(prev => ({ ...prev, format: option.value }))}
                className={`p-4 rounded-lg border transition-all ${
                  exportOptions.format === option.value
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${exportOptions.format === option.value ? 'text-blue-600' : option.color}`} />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-6 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={exportOptions.dateRange.start}
                  onChange={(e) => setExportOptions(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={exportOptions.dateRange.end}
                  onChange={(e) => setExportOptions(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Include Charts Option */}
          {exportOptions.format === 'pdf' && (
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={exportOptions.includeCharts}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Include Charts</span>
                  <p className="text-xs text-gray-500">Embed chart visualizations in the PDF report</p>
                </div>
              </label>
            </div>
          )}

          {/* Section Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Sections</label>
            <div className="space-y-2">
              {sectionOptions.map(section => {
                // Skip charts option for non-PDF formats
                if (section.id === 'charts' && exportOptions.format !== 'pdf') {
                  return null;
                }
                
                return (
                  <label key={section.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={exportOptions.sections.includes(section.id)}
                      onChange={() => handleSectionToggle(section.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">{section.label}</span>
                      <p className="text-xs text-gray-500">{section.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Export Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Export Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Format:</span>
            <span className="ml-2 font-medium text-blue-900">
              {formatOptions.find(f => f.value === exportOptions.format)?.label}
            </span>
          </div>
          <div>
            <span className="text-blue-700">Estimated Size:</span>
            <span className="ml-2 font-medium text-blue-900">{getEstimatedSize()} MB</span>
          </div>
          <div>
            <span className="text-blue-700">Sections:</span>
            <span className="ml-2 font-medium text-blue-900">{exportOptions.sections.length} selected</span>
          </div>
          <div>
            <span className="text-blue-700">Date Range:</span>
            <span className="ml-2 font-medium text-blue-900">
              {Math.ceil((new Date(exportOptions.dateRange.end).getTime() - new Date(exportOptions.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days
            </span>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting || exportOptions.sections.length === 0}
        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
          isExporting || exportOptions.sections.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
      >
        <Download className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} />
        <span>
          {isExporting 
            ? 'Generating Export...' 
            : `Export ${formatOptions.find(f => f.value === exportOptions.format)?.label}`
          }
        </span>
      </button>

      {exportOptions.sections.length === 0 && (
        <p className="text-center text-sm text-red-600 mt-2">
          Please select at least one section to export.
        </p>
      )}
    </div>
  );
}