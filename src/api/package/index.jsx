import axiosClient, { axiosFormClient } from '../axiosClient';
import { END_POINT_API } from '../endpoint';

const packageAPI = {
  getPackageDevices: (name) => {
    return axiosClient.get(`${END_POINT_API.DEVICE_PACKAGE}?name=${name}&status=Active&pageSize=1000`);
  },
  getPackageDevicesAll: () => {
    return axiosClient.get(`${END_POINT_API.DEVICE_PACKAGE}?status=Active`);
  },
  createDevicePage: (params) =>
    axiosFormClient.post(END_POINT_API.DEVICE_PACKAGE, params),
  getPackageDevicesById: (packageId) => {
   return axiosClient.get(`${END_POINT_API.DEVICE_PACKAGE}/${packageId}`);
  },
  updateDevicePackage: (params, packageId) => axiosFormClient.put(`${END_POINT_API.DEVICE_PACKAGE}/${packageId}`, params)
};

export default packageAPI;
