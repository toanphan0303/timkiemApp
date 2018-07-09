import axios from 'axios';
import {
  FETCH_USER_INFO
} from './types';

const BASE_URL = 'https://uejssrxsr1.execute-api.us-east-1.amazonaws.com/prod/user'

export const fetchUserInfo = (userId, email) => async (dispatch) => {
  const requestURL = BASE_URL + '/userinfo' + `?userId=${userId}` + `&email=${email}`;
  try {
    const { data } = await axios.get(requestURL);
    if (data.errorMessage) {
      console.error(data.errorMessage);
    } else {
      return dispatch({ type: FETCH_USER_INFO, payload: data.result[0] });
    }
  } catch (e) {
    console.error(e);
  }
};
