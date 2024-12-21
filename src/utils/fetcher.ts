import axios from 'axios';

export const getFetcher = async (url: string) => {
  if (!url) {
    throw new Error('URL is required');
  }

  try {
    console.log('Fetching URL:', url);
    const res = await axios.get(url);
    console.log('Response status:', res.status);
    console.log('Response data:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Fetch error:', error.message);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    throw error;
  }
};
