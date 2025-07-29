'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ApplicationsPage() {
  const params = useParams();
  const [applications, setApplications] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/job/${params.id}/applications`);
      const data = await res.json();
      if (res.ok) {
        setApplications(data.applications);
        setJobTitle(data.applications[0]?.job?.title || '');
      } else {
        setError(data.message || 'Failed to load applications');
      }
    } catch (err) {
      setError('An error occurred while fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/application/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchApplications();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch {
      alert('Error updating application status');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) return <div className="p-6 text-gray-600 text-center">Loading applications...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">
              {jobTitle || 'Job'} - Applications
            </h1>
            <p className="text-sm text-gray-500 mt-1">Review and manage submitted applications</p>
          </div>

          <Link
            href="/admin/jobs"
            className="w-[12rem] bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            ⬅ Back to Dashboard
          </Link>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">No applications found for this job.</p>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md"
              >
                {/* User Info */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-indigo-800">
                      {app.user?.name || 'Unnamed Applicant'}
                    </h2>
                    <p className="text-sm text-gray-600">{app.user?.email || 'Email not available'}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      app.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-700'
                        : app.status === 'REJECTED'
                        ? 'bg-red-100 text-red-600'
                        : app.status === 'ON_HOLD'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Answer */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Applicant Response:</p>
                  <p className="text-gray-800 text-sm leading-relaxed">{app.answer}</p>
                </div>

                {/* Resume Display */}
                {app.resumeUrl ? (
                  <div className="mb-3">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      📄 View Resume (PDF)
                    </a>
                  </div>
                ) : app.resume ? (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 italic mb-1">📝 Resume submitted onsite:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64 whitespace-pre-wrap">
                      {JSON.stringify(app.resume.content, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No resume provided.</p>
                )}

                {/* Status Update */}
                <div className="flex items-center gap-3 mt-4">
                  <label className="text-sm font-medium text-gray-700">Update Status:</label>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
