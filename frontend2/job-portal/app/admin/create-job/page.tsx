'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    salary: '',
    isActive: true,
    jobType: 'FULL_TIME',
    requireResume: false,
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/job/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') || '',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create job');

      setMessage('✅ Job posted successfully!');
      router.push('/admin/jobs');
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-12 px-4">
      {/* Top Bar with Dashboard Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push('/admin/jobs')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Dashboard
        </button>
      </div>

      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700">📢 Post a New Job</h2>

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full p-4 border border-gray-300 rounded-lg"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              required
              className="p-4 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
              className="p-4 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="salary"
              placeholder="Salary"
              value={form.salary}
              onChange={handleChange}
              required
              className="p-4 border border-gray-300 rounded-lg"
            />

            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className="p-4 border border-gray-300 rounded-lg"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERN">Intern</option>
              <option value="FREELANCE">Freelance</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="requireResume"
              id="requireResume"
              checked={form.requireResume}
              onChange={handleChange}
              className="h-5 w-5"
            />
            <label htmlFor="requireResume" className="text-sm text-gray-700">
              Require resume for application
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>

          {message && (
            <p
              className={`text-center text-sm font-medium mt-2 ${
                message.includes('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
