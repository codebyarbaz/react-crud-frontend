import axios from "axios";

import constants from "./constants";

const axiosInstance = axios.create({
  baseURL: constants.baseURL,
});

axiosInstance.defaults.withCredentials = true;

const service = {
  async getRequest(url, headers) {
    const result = await axiosInstance.get(url, headers);
    return result.data;
  },

  async postRequest(url, data, headers) {
    try {
      if (headers) {
        const result = await axiosInstance.post(url, data, headers);
        return result.data;
      } else {
        const result = await axiosInstance.post(url, data);
        return result.data;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  async patchRequest(url, data, headers) {
    try {
      if (headers) {
        const result = await axiosInstance.patch(url, data, headers);
        return result.data;
      } else {
        const result = await axiosInstance.patch(url, data);
        return result.data;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  async deleteRequest(url, headers) {
    const result = await axiosInstance.delete(url, headers);
    return result.data;
  },

  async formDataRequest(url, type, data) {
    const result = await axiosInstance[type](url, data, {
      "Content-Type": undefined,
    });
    return result.data;
  },
};

export default service;
