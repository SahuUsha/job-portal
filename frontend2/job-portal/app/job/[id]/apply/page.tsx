// app/job/[id]/apply/page.tsx

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ApplyJobForm() {
  const { id: jobId } = useParams();
  const router = useRouter();
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
      router.push('/dashboard');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 text-center">Apply for Job</h2>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Why are you a good fit for this job?"
          required
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useResume"
            checked={usedOnsiteResume}
            onChange={(e) => setUsedOnsiteResume(e.target.checked)}
          />
          <label htmlFor="useResume" className="text-sm text-gray-700">
            Use resume from profile
          </label>
        </div>

        {!usedOnsiteResume && (
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2"
            required
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>

        {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}
      </form>
    </div>
  );
}
