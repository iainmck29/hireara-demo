import { AnalyticsPlaceholder } from '@/components/AnalyticsPlaceholder';
import { TimeTrackingAnalytics } from '@/components/TimeTrackingAnalytics';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">
          Insights and analytics for your team's task management and productivity.
        </p>
      </div>

      {/* Time Tracking Analytics */}
      <TimeTrackingAnalytics />

      {/* Existing Analytics Content */}
      <AnalyticsPlaceholder />
    </div>
  );
}