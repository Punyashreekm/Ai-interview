import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../hooks/useAuth";
import {
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
  useCheckDocumentsQuery,
  useUploadDocumentMutation,
} from "../store/api/apiSlice";
import {
  Upload as UploadIcon,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingType, setUploadingType] = useState(null); // 'resume' or 'job_description'

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // RTK Query hooks
  const { data: documentsData, isLoading: documentsLoading } =
    useGetDocumentsQuery();
  const { data: documentStatus, isLoading: statusLoading } =
    useCheckDocumentsQuery();
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();
  const [deleteDocument, { isLoading: isDeleting }] =
    useDeleteDocumentMutation();

  const documents = documentsData?.documents || [];
  const status = documentStatus || {
    hasResume: false,
    hasJobDescription: false,
    readyForChat: false,
  };

  const onDrop = async (acceptedFiles, documentType) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadingType(documentType);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", documentType);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await uploadDocument(formData).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success(
        `${
          documentType === "resume" ? "Resume" : "Job description"
        } uploaded and processed successfully!`
      );

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadingType(null);
      }, 1000);
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      setUploadingType(null);
      toast.error(error.data?.message || "Upload failed");
    }
  };

  // Create separate dropzone configurations
  const resumeDropzone = useDropzone({
    onDrop: (files) => onDrop(files, "resume"),
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    disabled: uploading,
  });

  const jobDescriptionDropzone = useDropzone({
    onDrop: (files) => onDrop(files, "job_description"),
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    disabled: uploading,
  });

  const handleDeleteDocument = async (id) => {
    try {
      await deleteDocument(id).unwrap();
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const startChat = () => {
    if (status.readyForChat) {
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                InterviewPrep AI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Your Documents
          </h2>
          <p className="text-lg text-gray-600">
            Upload your resume and job description to start your AI-powered
            interview preparation
          </p>
        </div>

        {/* Upload Areas */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Resume Upload */}
          <div className="card">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Resume
              </h3>
              {status.hasResume && (
                <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
              )}
            </div>

            <div
              {...resumeDropzone.getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                resumeDropzone.isDragActive
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-primary-400"
              } ${
                uploading && uploadingType === "resume"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } ${status.hasResume ? "border-green-300 bg-green-50" : ""}`}
            >
              <input {...resumeDropzone.getInputProps()} />
              <UploadIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              {uploading && uploadingType === "resume" ? (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Processing resume...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {uploadProgress}% complete
                  </p>
                </div>
              ) : status.hasResume ? (
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">
                    Resume uploaded successfully
                  </p>
                  <p className="text-xs text-green-600">Click to replace</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {resumeDropzone.isDragActive
                      ? "Drop your resume here"
                      : "Drag & drop your resume"}
                  </p>
                  <p className="text-xs text-gray-600">
                    or click to select (max 2MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Job Description Upload */}
          <div className="card">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Job Description
              </h3>
              {status.hasJobDescription && (
                <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
              )}
            </div>

            <div
              {...jobDescriptionDropzone.getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                jobDescriptionDropzone.isDragActive
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-primary-400"
              } ${
                uploading && uploadingType === "job_description"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } ${
                status.hasJobDescription ? "border-green-300 bg-green-50" : ""
              }`}
            >
              <input {...jobDescriptionDropzone.getInputProps()} />
              <UploadIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              {uploading && uploadingType === "job_description" ? (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Processing job description...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {uploadProgress}% complete
                  </p>
                </div>
              ) : status.hasJobDescription ? (
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">
                    Job description uploaded successfully
                  </p>
                  <p className="text-xs text-green-600">Click to replace</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {jobDescriptionDropzone.isDragActive
                      ? "Drop job description here"
                      : "Drag & drop job description"}
                  </p>
                  <p className="text-xs text-gray-600">
                    or click to select (max 2MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Uploaded Documents
            </h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {doc.originalName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {doc.type === "resume" ? "Resume" : "Job Description"} •
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start Chat Button */}
        {status.readyForChat && (
          <div className="text-center mt-8">
            <button
              onClick={startChat}
              className="btn-primary text-lg px-8 py-3"
            >
              Start AI Interview Practice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
