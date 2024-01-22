import axios from "axios";
import config from "../config/config";

console.log(config.serverUrl)

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
      let _config = {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      };
      delete data["token"]; // remove token from body
      console.log(data);

      let result = await axios.post(
        config.serverUrl + "auth/reset-password/" + data?.email,
        data,
        _config
      );
      resolve(result);
    }),
};

export default user;
