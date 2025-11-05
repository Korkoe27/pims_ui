import React, { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";

const Documentation = () => {
  const [expandedSection, setExpandedSection] = useState("getting-started");

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "getting-started",
      title: "🚀 Getting Started",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Welcome to PIMS</h4>
            <p className="text-gray-700">
              PIMS (Patient Information Management System) is designed to streamline clinical 
              consultations, patient records, and case reviews. This guide will help you navigate 
              the system efficiently.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Dashboard Overview</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Dashboard:</strong> View overview of all appointments and pending tasks</li>
              <li><strong>Appointments:</strong> Access general and special clinic appointments</li>
              <li><strong>Pending Reviews:</strong> View consultations awaiting review (Lecturers)</li>
              <li><strong>Clinic Schedule:</strong> Manage clinic schedules and availability</li>
              <li><strong>Patients:</strong> View and manage patient information</li>
              <li><strong>Reports:</strong> Generate and view system reports</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "student-consultation",
      title: "📋 Student Consultation Guide",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Starting a Consultation</h4>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Navigate to <strong>Appointments</strong> in the sidebar</li>
              <li>Select an appointment with status "scheduled" or "in progress"</li>
              <li>Click <strong>Start Consultation</strong> button</li>
              <li>Fill in the consultation details by completing each tab</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Consultation Tabs</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div>
                <strong className="text-blue-900">Case History:</strong>
                <p className="text-gray-700 text-sm">Record patient's medical history and chief complaint</p>
              </div>
              <div>
                <strong className="text-blue-900">Personal History:</strong>
                <p className="text-gray-700 text-sm">Document personal and lifestyle information</p>
              </div>
              <div>
                <strong className="text-blue-900">Visual Acuity:</strong>
                <p className="text-gray-700 text-sm">Record vision measurements (corrected/uncorrected)</p>
              </div>
              <div>
                <strong className="text-blue-900">Externals:</strong>
                <p className="text-gray-700 text-sm">Document external eye examination findings</p>
              </div>
              <div>
                <strong className="text-blue-900">Internals:</strong>
                <p className="text-gray-700 text-sm">Record internal eye examination findings</p>
              </div>
              <div>
                <strong className="text-blue-900">Refraction:</strong>
                <p className="text-gray-700 text-sm">Document refraction test results</p>
              </div>
              <div>
                <strong className="text-blue-900">Extra Tests:</strong>
                <p className="text-gray-700 text-sm">Add additional test results or images</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Diagnosis & Management</h4>
            <p className="text-gray-700 mb-2">
              After completing examinations:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Go to <strong>Diagnosis</strong> tab and select appropriate diagnoses</li>
              <li>Move to <strong>Management</strong> tab to prescribe treatment</li>
              <li>Select management options (medications, refractive correction, etc.)</li>
              <li>Review Case Management Guide if required</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Submitting for Review</h4>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>After completing management, click <strong>Submit</strong> tab</li>
              <li>Review all entered information</li>
              <li>Click <strong>Submit for Review</strong> button</li>
              <li>Your consultation will be sent to a lecturer for review</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "lecturer-review",
      title: "👨‍🏫 Lecturer Review Guide",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Accessing Pending Reviews</h4>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Navigate to <strong>Pending Reviews</strong> in the sidebar</li>
              <li>View all consultations awaiting your review</li>
              <li>Click <strong>Continue Review</strong> or <strong>Start Review</strong> button</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Review Workflow</h4>
            <p className="text-gray-700 mb-2">When reviewing a consultation, you have access to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Management:</strong> View and modify management recommendations</li>
              <li><strong>Management Plan:</strong> Review the case management guide</li>
              <li><strong>Logs:</strong> View consultation history and timestamps</li>
              <li><strong>Complete:</strong> Finalize and complete the review</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Review Features</h4>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
              <p className="text-gray-700">
                ✅ <strong>Continue Review:</strong> Resume an ongoing review for a case
              </p>
              <p className="text-gray-700">
                ✅ <strong>Start Review:</strong> Begin reviewing a new consultation
              </p>
              <p className="text-gray-700">
                ✅ <strong>Complete Review:</strong> Finalize the review and mark consultation as complete
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Completing Reviews</h4>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Review all student findings and management</li>
              <li>Make any necessary adjustments or corrections</li>
              <li>Click the <strong>Complete</strong> tab</li>
              <li>Confirm completion - consultation status will be updated</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "clinician-workflow",
      title: "⚕️ Clinician Workflow",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Professional Consultation</h4>
            <p className="text-gray-700">
              Clinicians can conduct professional consultations independent of student consultations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Available Tasks</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Create and manage appointments</li>
              <li>Add management and prescriptions</li>
              <li>Complete consultations directly</li>
              <li>Manage patient records</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Completing Consultations</h4>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Navigate to the consultation</li>
              <li>Fill in management details</li>
              <li>Click the <strong>Complete</strong> tab</li>
              <li>Confirm completion to mark consultation as done</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "tips-and-tricks",
      title: "💡 Tips & Tricks",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Saving Your Work</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>All data is automatically saved as you progress through tabs</li>
              <li>Your position is remembered - you can return to where you left off</li>
              <li>Use "Save & Next" buttons to progress through sections</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Navigating Between Tabs</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Tab order follows the logical clinical workflow</li>
              <li>Click any tab to jump directly to that section</li>
              <li>Complete tabs are marked with visual indicators</li>
              <li>Required fields are marked with asterisks (*)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Using Dropdowns & Searches</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Type to search in dropdown fields for faster selection</li>
              <li>Press Enter to confirm your selection</li>
              <li>Click the dropdown arrow to see all available options</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Managing Medications</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Filter medications by type in the Management section</li>
              <li>Add multiple medications to prescriptions</li>
              <li>Save prescriptions for future reference</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Viewing Logs</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Logs tab shows complete history of all changes</li>
              <li>View who made changes and when</li>
              <li>Useful for tracking consultation progress</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      title: "🔧 Troubleshooting",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Common Issues</h4>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">❓ Data not saving?</p>
                <p className="text-gray-700 text-sm">
                  Check your internet connection. Click "Save & Next" to ensure data is persisted.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">❓ Can't find an appointment?</p>
                <p className="text-gray-700 text-sm">
                  Use filters in Appointments section. Check if you have the required permissions.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">❓ Review button not showing?</p>
                <p className="text-gray-700 text-sm">
                  Only lecturers can review. Ensure the appointment status is "submitted for review" or "under review".
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">❓ Can't modify management?</p>
                <p className="text-gray-700 text-sm">
                  Some fields may be locked based on appointment status. Request changes through proper channels.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Getting Help</h4>
            <p className="text-gray-700">
              If you encounter issues not covered here, please contact your system administrator or technical support team.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "keyboard-shortcuts",
      title: "⌨️ Keyboard Shortcuts",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <table className="w-full text-sm">
              <tbody className="space-y-2">
                <tr>
                  <td className="font-semibold text-gray-900 py-1">Tab</td>
                  <td className="text-gray-700">Move to next form field</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-900 py-1">Shift + Tab</td>
                  <td className="text-gray-700">Move to previous form field</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-900 py-1">Enter</td>
                  <td className="text-gray-700">Confirm selection or submit form</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-900 py-1">Esc</td>
                  <td className="text-gray-700">Close dropdown or modal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-6 px-4 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PIMS Documentation</h1>
          <p className="text-gray-600">
            Comprehensive guide to help you navigate and use the Patient Information Management System
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-blue-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className="text-left px-4 py-2 rounded bg-white hover:bg-blue-100 text-blue-700 font-medium transition-colors"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow border border-gray-200">
              {/* Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                <HiOutlineChevronDown
                  className={`text-gray-600 transition-transform ${
                    expandedSection === section.id ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {/* Content */}
              {expandedSection === section.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-700">
            📧 For additional support or feature requests, please contact the development team
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Last updated: November 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
