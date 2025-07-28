'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export default function ApplyJobForm() {
  const { id: jobId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const jobTitle = searchParams.get('title');
  const jobDescription = searchParams.get('description');
  const jobType = searchParams.get('jobType');

  const [answer, setAnswer] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [usedOnsiteResume, setUsedOnsiteResume] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('answer', answer);
    formData.append('usedOnsiteResume', String(usedOnsiteResume));
    if (resume && !usedOnsiteResume) {
      formData.append('resume', resume);
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/job/${jobId}/apply`, {
        method: 'POST',
        headers: {
          Authorization: token || '',
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      setMessage('Application submitted successfully.');
      setAnswer('');
      setResume(null);
      setUsedOnsiteResume(false);
      router.push('/user/dashboard');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-400 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          Apply for <span className="text-yellow-400">{jobTitle}</span>
        </h2>

        <p className="text-sm text-gray-600 text-center">{jobDescription}</p>
        <p className="text-sm text-indigo-600 text-center font-medium">
          Job Type: {jobType}
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Why are you a good fit?
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Explain your strengths and qualifications..."
            required
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useResume"
            checked={usedOnsiteResume}
            onChange={(e) => setUsedOnsiteResume(e.target.checked)}
            className="accent-indigo-600"
          />
          <label htmlFor="useResume" className="text-sm text-gray-700">
            Use resume from profile
          </label>
        </div>

        {!usedOnsiteResume && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="block w-full border border-gray-300 rounded-lg p-2 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-indigo-900 py-2 rounded-full font-semibold hover:bg-yellow-500 transition duration-200"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>

        {message && (
          <p className={`text-center text-sm mt-2 ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
