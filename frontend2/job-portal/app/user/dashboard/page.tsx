"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserDashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [resume, setResume] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    linkedin: "",
    github: "",
    education: "",
    skills: "",
    summary: "",
  });

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove token or any auth info
    router.push('/'); // Redirect to login
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, resumeRes] = await Promise.all([
          fetch("/api/user/applications"),
          fetch("/api/resume"),
        ]);

        const appsData = await appsRes.json();
        const resumeData = await resumeRes.json();

        if (appsRes.ok) setApplications(appsData.applications);
        if (resumeRes.ok && resumeData.resume?.content) {
          setResume(resumeData.resume);
          setForm(resumeData.resume.content);
        } else {
          setError(resumeData.message || "Could not fetch resume.");
        }
      } catch (err) {
        setError("Something went wrong while loading dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveResume = async () => {
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: form }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Resume saved successfully!");
      } else {
        setError(data.message || "❌ Failed to save resume");
      }
    } catch (err) {
      setError("❌ Error saving resume");
    }
  };

  if (loading) return <div className="p-6 text-gray-700">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-blue-50 pb-16">
      {/* ✅ Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700">
           <Link href="/user/jobs
           " className="text-indigo-700 hover:text-yellow-500 transition">
            HireNest
            </Link>
          </h1>
        <div className="flex gap-4">

            <div className="flex gap-4 items-center">

          <Link
            href="/user/jobs"
            className="text-indigo-600 font-medium hover:underline"
          >
            Jobs
          </Link>
           <button
    onClick={ handleSignOut}
    className=" text-indigo-600 px-4 py-1 rounded-full text-sm hover:text-indigo-700 hover:underline transition"
  >
    Sign Out
  </button>

          </div>
          {/* Placeholder for Logout or Profile */}
          {/* <button className="text-red-500 font-medium">Logout</button> */}
        </div>
      </nav>

      {/* ✅ Dashboard Content */}
      <div className="py-10 px-6 space-y-10">
        <h1 className="text-3xl font-bold text-indigo-700 text-center">Welcome to Your Dashboard</h1>

        {/* Resume Section */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-indigo-800">My Resume</h2>

          {["name", "linkedin", "github", "education", "skills"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          ))}

          <textarea
            name="summary"
            placeholder="Summary / About You"
            rows={4}
            value={form.summary}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            onClick={handleSaveResume}
            className="bg-yellow-400 text-indigo-900 px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition"
          >
            Save Resume
          </button>

          {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>

        {/* Application History */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-indigo-800">My Applications</h2>

          {applications.length === 0 ? (
            <p className="text-gray-600">You haven&apos;t applied to any jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-md p-4 space-y-1">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    {app.job?.title || "Untitled Job"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {app.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Answer:</strong> {app.answer}
                  </p>
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      View Resume
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
