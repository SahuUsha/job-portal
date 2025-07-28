'use client';

import Link from 'next/link';

export default function Home() {
   return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-grow bg-gradient-to-br from-indigo-600 to-blue-400 flex items-center justify-center py-20 px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-white text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            Welcome to <span className="text-yellow-300">HireNest</span>
          </h1>
          <p className="text-white text-xl sm:text-2xl mb-10">
            Your one-stop job portal. Find jobs, apply effortlessly, and take your career to the next level.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/signin">
              <button className="bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-200">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="bg-yellow-300 text-indigo-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition duration-200">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8">Why Choose HireNest?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="bg-indigo-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Easy Job Search</h3>
            <p className="text-gray-700">Filter by skills, location, or type. Get jobs that match your profile instantly.</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Smart Applications</h3>
            <p className="text-gray-700">Apply in one click and track application status directly from your dashboard.</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Verified Employers</h3>
            <p className="text-gray-700">Work with trusted companies. All job posts are screened for authenticity.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-indigo-100 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">About HireNest</h2>
          <p className="text-gray-800 text-lg">
            HireNest is designed to bridge the gap between top talent and great companies. Whether you're a fresher or a seasoned professional, our portal offers tools to simplify your job search journey.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-700 text-white py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div>© {new Date().getFullYear()} HireNest. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
