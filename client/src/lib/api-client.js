import { HOST } from "@/utils/constants"; // Import the base URL for the API from constants
import axios from "axios"; // Import Axios library for making HTTP requests

// Create an Axios instance with a base URL
const apiClient = axios.create({
  baseURL: HOST, // Set the base URL for all requests
});


export default apiClient;
