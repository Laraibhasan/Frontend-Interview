import axios from 'axios';

// This matches the address where your npm run server is running
const API_URL = 'http://localhost:3001';

const api = axios.create({ 
  baseURL: API_URL 
});

// Task 1: Fetch all blogs
export const getBlogs = async () => {
  const { data } = await api.get('/blogs');
  return data;
};

// Task 2: Fetch a single blog by its ID
export const getBlogById = async (id: string) => {
  const { data } = await api.get(`/blogs/${id}`);
  return data;
};

// Task 3: Send a new blog to the server
export const createBlog = async (newBlog: any) => {
  const { data } = await api.post('/blogs', newBlog);
  return data;
};