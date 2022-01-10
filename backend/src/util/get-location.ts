import axios from 'axios';
import HttpError from '../models/http-error';

export const getLocation = async (address: string) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
      address
    )}&key=${process.env.API_KEY}`
  );
  const data = await response.data;
  if (!data || data.status === 'ZERO_RESULTS') {
    return new HttpError('Status responded with not OK', 500);
  }
  return data.results[0].geometry.location;
};
