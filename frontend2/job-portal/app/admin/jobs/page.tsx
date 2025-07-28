'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const router = useRouter();

  const fetchJobs = async () => {
    const res = await fetch('/api/job/alljob');
    const data = await res.json();
    if (res.ok) setJobs(data.jobs || []);
  };

  const fetchApplicationCount = async (jobId: string) => {
    const res = await fetch(`/api/job/${jobId}/count`);
    const data = await res.json();
    if (res.ok) {
      setApplicationCounts(prev => ({
        ...prev,
        [jobId]: data.applicationCount || 0,
      }));
    }
  };

  const toggleJob = async (id: string) => {
    const res = await fetch(`/api/job/${id}`, {
      method: 'PATCH',
    });
    if (res.ok) fetchJobs();
  };

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove token or any auth info
    router.push('/'); // Redirect to login
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    jobs.forEach((job) => {
      fetchApplicationCount(job.id);
    });
  }, [jobs]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 space-y-6">
      {/* Top Navbar */}
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700">Manage Jobs</h1>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/create-job"
            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition"
          >
            + Create Job
          </Link>

          <button
            onClick={handleSignOut}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-gray-200 p-6 rounded-xl shadow space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-indigo-800">{job.title}</h2>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {job.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <p className="text-gray-700 line-clamp-3">{job.description}</p>

            <p className="text-sm text-gray-500">
              <strong>Applications:</strong>{' '}
              <span className="text-indigo-700 font-semibold">
                {applicationCounts[job.id] !== undefined
                  ? applicationCounts[job.id]
                  : '...'}
              </span>
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => toggleJob(job.id)}
                className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-500 transition"
              >
                Toggle Active
              </button>

              <Link
                href={`/admin/jobs/applications/${job.id}`}
                className="bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
              >
                View Applications
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
