'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? data.application : app))
        );
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

  if (loading) return <div className="p-6 text-gray-700">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications for {jobTitle}</h1>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="border p-4 rounded shadow space-y-2">
            <div>
  {app.user ? (
    <>
      <h2 className="font-semibold text-lg">{app.user.name}</h2>
      <p className="text-sm text-gray-600">{app.user.email}</p>
    </>
  ) : (
    <p className="text-sm text-red-500">User data unavailable</p>
  )}
</div>
            <div>
              <span className="font-medium">Answer:</span>
              <p className="text-gray-800 mt-1">{app.answer}</p>
            </div>

            {app.resumeUrl && (
              <div>
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume (PDF)
                </a>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
