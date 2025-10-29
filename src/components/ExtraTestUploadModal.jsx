import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { showToast } from "../components/ToasterHelper";
import { useCreateExtraTestMutation } from "../redux/api/features/extraTestsApi";
import { baseURL } from "../redux/api/base_url/baseurl";
import { createExtraTestUrl } from "../redux/api/end_points/endpoints";

const TEST_OPTIONS = [
  "OCT",
  "Perimetry",
  "Color Vision",
  "Visual Field Test",
  "B-Scan",
  "Pachymetry",
  "Tonometry",
];

const ExtraTestUploadModal = ({
  isOpen,
  onClose,
  appointmentId,
  onUploadSuccess,
}) => {
  const [testName, setTestName] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Tonometry-specific fields
  const [method, setMethod] = useState("");
  const [iopOd, setIopOd] = useState("");
  const [iopOs, setIopOs] = useState("");
  const [recordedAt, setRecordedAt] = useState("");

  const [createExtraTest, { isLoading }] = useCreateExtraTestMutation();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isTonometry = testName.toLowerCase().includes("tonometry");

    if (!testName || (!file && !isTonometry)) {
      showToast("Test name and file are required.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", testName);
    formData.append("notes", notes || "");
    formData.append("appointment", appointmentId);

    if (file) formData.append("file", file);
    if (isTonometry) {
      formData.append("method", method);
      formData.append("iop_od", iopOd);
      formData.append("iop_os", iopOs);
      formData.append("recorded_at", recordedAt);
    }

    // 🧠 DEBUG: Log what we’re sending
    console.groupCollapsed("🚀 Payload sent to Extra Test endpoint");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File]`, value.name, value.type, `${(value.size / 1024).toFixed(2)}KB`);
      } else {
        console.log(`${key}:`, value);
      }
    }
    console.groupEnd();

    try {
      const uploadUrl = `${baseURL}${createExtraTestUrl(appointmentId)}`;
      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadUrl);
      xhr.setRequestHeader(
        "Authorization",
        `Bearer ${localStorage.getItem("access_token")}`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          showToast("Extra test uploaded successfully!", "success");
          onUploadSuccess?.();
          onClose();
        } else {
          console.error("❌ Server error:", xhr.status, xhr.responseText);
          showToast("Failed to upload test.", "error");
        }
      };

      xhr.onerror = () => showToast("Network error during upload.", "error");
      xhr.send(formData);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      showToast("Failed to upload test.", "error");
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload Extra Test
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="border p-3 rounded"
            required
          >
            <option value="">Select a test</option>
            {TEST_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Tonometry Fields */}
          {testName.toLowerCase().includes("tonometry") && (
            <>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="border rounded p-3"
                required
              >
                <option value="">Select Tonometry Method</option>
                <option value="Applanation">Applanation</option>
                <option value="Tonopen">Tonopen</option>
                <option value="Non-Contact">Non-Contact</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={iopOd}
                  onChange={(e) => setIopOd(e.target.value)}
                  placeholder="IOP OD"
                  className="border rounded p-3 w-full"
                  required
                />
                <input
                  type="number"
                  value={iopOs}
                  onChange={(e) => setIopOs(e.target.value)}
                  placeholder="IOP OS"
                  className="border rounded p-3 w-full"
                  required
                />
              </div>
              <input
                type="datetime-local"
                value={recordedAt}
                onChange={(e) => setRecordedAt(e.target.value)}
                className="border rounded p-3"
                required
              />
            </>
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter notes (optional)"
            rows={3}
            className="border rounded p-3"
          />

          {!testName.toLowerCase().includes("tonometry") && (
            <label className="border rounded p-3 cursor-pointer bg-gray-50 text-sm text-gray-700 hover:bg-gray-100">
              {file ? "Change File" : "Upload File"}
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {file && (
            <div className="relative border rounded p-3 bg-gray-100 mt-2">
              <button
                onClick={handleRemoveFile}
                type="button"
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                <IoClose size={18} />
              </button>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-40 object-contain rounded"
                />
              ) : (
                <p className="text-sm text-gray-600">{file.name}</p>
              )}
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#2f3192] h-2.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <button
            type="submit"
            className="bg-[#2f3192] text-white py-2 px-4 rounded hover:bg-[#1e217a]"
            disabled={isLoading}
          >
            {uploadProgress > 0
              ? `Uploading... ${uploadProgress}%`
              : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExtraTestUploadModal;
