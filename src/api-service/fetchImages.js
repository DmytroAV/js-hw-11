import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api';
const SECRET_KEY_API = process.env.SECRET_KEY_API;

axios.defaults.baseURL = BASE_URL;

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Notify.failure('Something went wrong. Please try again later.');
    return Promise.reject(error);
  },
);


async function fetchImages(query, page, perPage) {
  try {
    const response = await axios.get(
      `?key=${SECRET_KEY_API}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export default { fetchImages };

