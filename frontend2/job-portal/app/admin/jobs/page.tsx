'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  const fetchJobs = async () => {
    const res = await fetch('/api/job/alljob'); // You should create this route
    const data = await res.json();
    if (res.ok) setJobs(data.jobs || []);
  };

  const toggleJob = async (id: string) => {
    const res = await fetch(`/api/job/${id}`, {
      method: 'PATCH',
    });
    if (res.ok) fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <Link href="/admin/create-job" className="px-4 py-2 bg-blue-600 text-white rounded">Create Job</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border p-4 rounded shadow space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <span className={`px-2 py-1 rounded text-white ${job.isActive ? 'bg-green-600' : 'bg-red-600'}`}>
                {job.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p>{job.description}</p>
            <div className="flex gap-2">
              <button onClick={() => toggleJob(job.id)} className="text-sm bg-yellow-400 px-2 py-1 rounded">
                Toggle Active
              </button>
              <Link href={`/admin/jobs/edit/${job.id}`} className="text-sm bg-blue-500 px-2 py-1 rounded text-white">
                Edit
              </Link>
              <Link href={`/admin/jobs/applications/${job.id}`} className="text-sm bg-gray-700 px-2 py-1 rounded text-white">
                Applications
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
