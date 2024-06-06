import axiosClient from '../axiosClient';
import { END_POINT_API } from '../endpoint';

const statisAPI = {
  getStatis: (month) => {
    return axiosClient.get(`${END_POINT_API.STATIC}/?month=${month}`);
  }
};

export default statisAPI;
