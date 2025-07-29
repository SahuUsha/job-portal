'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserJobListPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
    const router = useRouter();

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/job/active');
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs || []);
        setFilteredJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };
const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove token or any auth info
    router.push('/'); // Redirect to login
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = jobs.filter(
      (job: any) =>
        job.title.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        job.jobType.toLowerCase().includes(term)
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-blue-50">
      {/* ✅ Navbar */}
      <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700">
            <Link href="/user/jobs" className="text-indigo-700 hover:text-yellow-500 transition">
            RecruitPro
            </Link>
            </h1>
      <div className="flex gap-4 items-center">
  <Link
    href="/user/dashboard"
    className="text-indigo-600 font-medium hover:underline"
  >
    Dashboard
  </Link>
  <button
    onClick={handleSignOut}
    className=" text-indigo-600 px-4 py-1 rounded-full text-sm hover:text-indigo-700 hover:underline transition"
  >
    Sign Out
  </button>
</div>
      </nav>

      {/* ✅ Main Content */}
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6">Available Jobs</h2>

        {/* ✅ Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by title, location, or job type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-[80%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
          />
        </div>

        {filteredJobs.length === 0 ? (
          <p className="text-gray-600">No jobs match your search.</p>
        ) : (
          <div className="flex flex-col gap-6">
           {filteredJobs.map((job) => {
  const query = new URLSearchParams({
    title: job.title,
    description: job.description,
    jobType: job.jobType,
  }).toString();

  return (
    <div
      key={job.id}
      className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-indigo-800">
          {job.title}
        </h3>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            job.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {job.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <p className="text-gray-700 line-clamp-2">{job.description}</p>
      <p className="text-sm text-gray-600">
  <strong>Location:</strong> {job.location}
</p>
<p className="text-sm text-gray-600">
  <strong>Department:</strong> {job.department}
</p>
<p className="text-sm text-gray-600">
  <strong>Type:</strong> {job.jobType}
</p>
<p className="text-sm text-gray-600">
  <strong>Requires Resume:</strong> {job.requireResume ? 'Yes' : 'No'}
</p>
<p className="text-sm text-gray-600">
  <strong>Posted On:</strong> {new Date(job.createdAt).toLocaleDateString()}
</p>


      <div className="flex gap-3 mt-2">
        <button
          onClick={() => setSelectedJob(job)}
          className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-500 transition"
        >
          View
        </button>

        <Link
          href={job.isActive ? `/job/${job.id}/apply?${query}` : '#'}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            job.isActive
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={(e) => {
            if (!job.isActive) e.preventDefault();
          }}
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
})}

          </div>
        )}
      </div>

 
      {selectedJob && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-xl w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-indigo-700 mb-2">
              {selectedJob.title}
            </h2>
            <p className="text-gray-700 mb-2">{selectedJob.description}</p>
            <p className="text-sm text-gray-600">
              <strong>Location:</strong> {selectedJob.location}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Salary:</strong> ₹{selectedJob.salary}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Type:</strong> {selectedJob.jobType}
            </p>
            <p className="text-sm text-gray-600">
  <strong>Requires Resume:</strong> {selectedJob.requireResume ? 'Yes' : 'No'}
</p>
<p className="text-sm text-gray-600">
  <strong>Posted On:</strong> {new Date(selectedJob.createdAt).toLocaleDateString()}
</p>
            {/* <Link
              href={`/job/${selectedJob.id}/apply`}
              className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Apply Now
            </Link> */}
          </div>
        </div>
      )}
    </div>
  );
}
