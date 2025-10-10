// pages/MyPortal.jsx
import React from "react";
import PageContainer from "../components/PageContainer";
import { Link } from "react-router-dom";

const MyPortal = () => {
  // Later we can fetch these stats dynamically from the API
  const stats = {
    totalCases: 10,
    scores: "85%",   // could be average score
    pendingReviews: 20,
  };

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">My Portal</h1>

      {/* Top stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Cases</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalCases}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Scores</h2>
          <p className="text-3xl font-bold text-green-600">{stats.scores}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Pending Reviews</h2>
          <p className="text-3xl font-bold text-red-600">{stats.pendingReviews}</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/my-cases" className="p-6 bg-white shadow rounded-lg hover:shadow-md">
          <h2 className="text-lg font-semibold">My Cases</h2>
          <p className="text-gray-600">View and manage all your assigned cases.</p>
        </Link>

        <Link to="/pending-reviews" className="p-6 bg-white shadow rounded-lg hover:shadow-md">
          <h2 className="text-lg font-semibold">Pending Reviews</h2>
          <p className="text-gray-600">Check cases awaiting supervisor review.</p>
        </Link>

        <Link to="/reports" className="p-6 bg-white shadow rounded-lg hover:shadow-md">
          <h2 className="text-lg font-semibold">Reports & Grades</h2>
          <p className="text-gray-600">Track your grades and case statistics.</p>
        </Link>

        <Link to="/absent-request" className="p-6 bg-white shadow rounded-lg hover:shadow-md">
          <h2 className="text-lg font-semibold">Absent Requests</h2>
          <p className="text-gray-600">Submit and track absence requests.</p>
        </Link>

        <Link to="/case-reviews" className="p-6 bg-white shadow rounded-lg hover:shadow-md">
          <h2 className="text-lg font-semibold">Case Reviews</h2>
          <p className="text-gray-600">See supervisor feedback on your cases.</p>
        </Link>
      </div>
    </PageContainer>
  );
};

export default MyPortal;
