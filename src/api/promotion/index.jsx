import axiosClient, { axiosFormClient } from "../axiosClient";
import { END_POINT_API } from "../endpoint";

const promotionAPI = {
  getPromotion: () => {
    return axiosClient.get(
      `${END_POINT_API.PROMOTION}?status=Active&pageSize=100`
    );
  },
  getPromotionById: (promotionId) => {
    return axiosClient.get(`${END_POINT_API.PROMOTION}/${promotionId}`)
  },
  createPromotion: (params) => 
     axiosFormClient.post(`${END_POINT_API.PROMOTION}`, params)
  ,
  updatePromotion: (params, promotionId) => axiosFormClient.put(`${END_POINT_API.PROMOTION}/${promotionId}`, params)
};

export default promotionAPI;
