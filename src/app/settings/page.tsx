export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your application settings and preferences.
        </p>
      </div>

      {/* Settings Content */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
          <p className="text-gray-500">
            Application settings and configuration options will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}