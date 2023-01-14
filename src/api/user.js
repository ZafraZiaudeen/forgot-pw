import axios from "axios";
import config from "../config/config";

const user = {
  updateStripeCustomer: (data) =>
    new Promise(async (resolve) => {
      let result = await axios.post(
        config.serverUrl + "/api/v1/users/paymentSuccess",
        data
      );
      resolve(result);
    }),

  changePassword: (data) =>
    new Promise(async (resolve) => {
      let config = {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      };
      delete data["token"]; // remove token from body
      let result = await axios.post(
        config.serverUrl + "/api/v1/users/",
        data,
        config
      );
      resolve(result);
    }),
};

export default user;
