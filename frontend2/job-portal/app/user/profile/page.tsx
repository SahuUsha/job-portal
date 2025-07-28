'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch('/api/resume/get');
        const data = await res.json();

        if (res.ok && data.resume?.content) {
          setContent(JSON.stringify(data.resume.content, null, 2));
        } else {
          setError(data.message || 'Failed to fetch resume');
        }
      } catch (err) {
        setError('Something went wrong while fetching resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const handleSave = async () => {
    setMessage('');
    setError('');

    try {
      const parsed = JSON.parse(content);

      const res = await fetch('/api/resume/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: parsed }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Resume saved successfully!');
      } else {
        setError(data.message || 'Failed to save resume');
      }
    } catch (err) {
      setError('❌ Invalid JSON format. Please fix and try again.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Resume</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder={`{\n  "summary": "Your intro",\n  "skills": [...],\n  "experience": [...]\n}`}
            className="w-full border rounded p-3 font-mono text-sm bg-gray-50"
          />

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Resume
          </button>

          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
