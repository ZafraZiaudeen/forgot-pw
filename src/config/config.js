const { REACT_APP_SERVER_URL } = process.env;

module.exports = {
  serverUrl: REACT_APP_SERVER_URL || "http://localhost:5000",
};
