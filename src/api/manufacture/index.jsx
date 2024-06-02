import axiosClient, { axiosFormClient } from "../axiosClient";
import { END_POINT_API } from "../endpoint";

const manufactureAPI = {
  getManufacture: () => {
    return axiosClient.get(
      `${END_POINT_API.MANUFACTURE}`
    );
  },
  addManufacture: (params) =>
    axiosFormClient.post(END_POINT_API.MANUFACTURE, params),
};

export default manufactureAPI;
