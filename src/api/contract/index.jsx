import axiosClient from "../axiosClient";
import { END_POINT_API } from "../endpoint";

const contractAPI = {
  getNewContract: () => {
    return axiosClient.get(
      `${END_POINT_API.NEW_CONTRACT}`
    );
  },
  getDepositedContract: () => {
    return axiosClient.get(
        `${END_POINT_API.NEW_CONTRACT}`
      );
  }
};

export default contractAPI;
