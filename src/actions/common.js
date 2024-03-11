export const updateErrorMessage = (data) => {
  return {
    type: "UPDATE_ERROR_MESSAGE",
    payload: data,
  };
};

export const setLoadingState = (data) => {
  return {
    type: "SET_LOADING",
    payload: data
  }
}