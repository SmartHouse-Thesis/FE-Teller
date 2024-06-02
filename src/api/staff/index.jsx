import axiosClient from '../axiosClient';
import { END_POINT_API } from '../endpoint';

const staffAPI = {
  getStaffList: (page) => {
    return axiosClient.get(`${END_POINT_API.STAFF}?status=Active`);
  },
  getStaffLeaderList: (page) => {
    return axiosClient.get(`${END_POINT_API.STAFF}/leader?status=Active`);
  },
  createStaff: (params) => axiosClient.post(`${END_POINT_API.STAFF}`, params),
  updateStaff: (params, staffId) =>
    axiosClient.put(`${END_POINT_API.STAFF}/${staffId}`, params),
  getStaffDetail: (staffId) => {
    return axiosClient.get(`${END_POINT_API.STAFF}/${staffId}`);
  }
};

export default staffAPI;
