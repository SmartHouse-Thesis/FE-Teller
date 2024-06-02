import axiosClient from '../axiosClient';
import { END_POINT_API } from '../endpoint';

const tellerAPI = {
  getTellerList: (page) => {
    return axiosClient.get(`${END_POINT_API.TELLER}?status=Active`);
  },
  createTeller: (params) => axiosClient.post(`${END_POINT_API.TELLER}`, params),
  getTellerDetail: (tellerId) => {
    return axiosClient.get(`${END_POINT_API.TELLER}/${tellerId}`)
  },
  updateTeller: (params, tellerId) => axiosClient.put(`${END_POINT_API.TELLER}/${tellerId}`, params),
};

export default tellerAPI;
