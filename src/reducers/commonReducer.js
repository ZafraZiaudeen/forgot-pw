const initialState = {
  errorMessage: {
    text: "",
    negative: false,
    animated: false,
  },
  loading: false
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_ERROR_MESSAGE":
      return {
        ...state,
        errorMessage: { ...state.errorMessage, ...action.payload },
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state;
  }
};

export default commonReducer;
