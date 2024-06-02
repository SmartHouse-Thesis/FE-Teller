import axiosClient, { axiosFormClient } from '../axiosClient';
import { END_POINT_API } from '../endpoint';

const devicesAPI = {
  getSmartDevice: (manufactureId) => {
    return axiosClient.get(`${END_POINT_API.SMART_DEVICE}?manufacturerId=${manufactureId}&status=Active&pageSize=60`);
  },
  getSmartDeviceAll: (name) => {
    return axiosClient.get(`${END_POINT_API.SMART_DEVICE}?name=${name}&status=Active&pageSize=1000`);
  },
  getSmartDeviceById: (deviceId) =>
    axiosClient.get(`${END_POINT_API.SMART_DEVICE}/${deviceId}`),
  createSmartDevice: (params) =>
    axiosFormClient.post(`${END_POINT_API.SMART_DEVICE}`, params),
  updateSmartDevice: (params, deviceId) =>
    axiosFormClient.put(`${END_POINT_API.SMART_DEVICE}/${deviceId}`, params),
};

export default devicesAPI;
