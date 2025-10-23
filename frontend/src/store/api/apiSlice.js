import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance for base query
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Document", "Chat"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // Document endpoints
    uploadDocument: builder.mutation({
      query: (formData) => ({
        url: "/documents/upload",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Document"],
    }),
    getDocuments: builder.query({
      query: () => "/documents/list",
      providesTags: ["Document"],
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Document"],
    }),
    checkDocuments: builder.query({
      query: () => "/documents/check",
      providesTags: ["Document"],
    }),

    // Chat endpoints
    startChat: builder.mutation({
      query: () => ({
        url: "/chat/start",
        method: "POST",
      }),
      invalidatesTags: ["Chat"],
    }),
    sendMessage: builder.mutation({
      query: ({ message, sessionId }) => ({
        url: "/chat/query",
        method: "POST",
        body: { message, sessionId },
      }),
      invalidatesTags: ["Chat"],
    }),
    getChatHistory: builder.query({
      query: (sessionId) => `/chat/history/${sessionId}`,
      providesTags: ["Chat"],
    }),
    getChatSessions: builder.query({
      query: () => "/chat/sessions",
      providesTags: ["Chat"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetMeQuery,
  useUploadDocumentMutation,
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
  useCheckDocumentsQuery,
  useStartChatMutation,
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useGetChatSessionsQuery,
} = apiSlice;
