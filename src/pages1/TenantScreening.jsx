import { FiUserCheck, FiSearch } from 'react-icons/fi';

export default function TenantScreening() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tenant Screening</h1>
        <p className="text-gray-400">Screen potential tenants with comprehensive background checks</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <FiUserCheck className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-white">Screen a new tenant</h3>
          <p className="mt-2 text-sm text-gray-300">
            Get a comprehensive background check including credit, criminal, and eviction history.
          </p>
          <div className="mt-6">
            <div className="max-w-lg mx-auto">
              <div className="flex rounded-md shadow-sm">
                <div className="relative flex-grow focus-within:z-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-l-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter applicant's email or phone number"
                  />
                </div>
                <button
                  type="button"
                  className="-ml-px relative inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  Begin Screening
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                By proceeding, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h4 className="text-sm font-medium text-gray-300">Recent Screenings</h4>
            <div className="mt-4 text-sm text-gray-500">
              No recent screenings. Screen your first applicant to see results here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
