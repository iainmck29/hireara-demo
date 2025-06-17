import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Task Insights</h1>
        <p className="mt-2 text-gray-600">
          AI-powered analytics and insights for your team's task management and productivity optimization.
        </p>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />
    </div>
  );
}