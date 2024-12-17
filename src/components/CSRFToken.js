import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../services/client/baseurl"; // Import baseURL

// TODO: Refactor code and properly implement this component using api-handlers

const CSRFToken = () => {
  const [csrftoken, setCsrftoken] = useState("");

  // Function to get a specific cookie value
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie) {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
          cookieValue = decodeURIComponent(cookie.split("=")[1]);
          break;
        }
      }
    }
    console.log(`Cookie Value for ${name}:`, cookieValue); // Debug log
    return cookieValue;
  };

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        console.log("Fetching CSRF Token...");
        // Fetch the CSRF cookie from the backend
        const response = await axios.get(`${baseURL}auth/api/csrf_cookie/`, {
          withCredentials: true,
        });
        console.log("CSRF Token Response:", response);

        const token = getCookie("csrftoken");
        console.log("Fetched CSRF Token:", token); // Log fetched token
        setCsrftoken(token);
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    };

    fetchCSRFToken();
  }, []);

  return (
    <>
      <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
      <p>CSRF Token: {csrftoken}</p> {/* Display token for debugging */}
    </>
  );
};

export default CSRFToken;
