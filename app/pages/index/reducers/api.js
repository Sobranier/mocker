const data = (state = {list: []}, action) => {
  switch(action.type) {
    case 'GET_API_LIST':
      return {
        list: action.data
      };
      break;
    default:
      return state;
  }
}

export default data;
