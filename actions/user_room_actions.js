import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';
import {
  USER_ADD_ROOM,
  FETCH_USER_POST_ROOM
} from './types';

const BASE_URL = 'https://uejssrxsr1.execute-api.us-east-1.amazonaws.com/prod/user'

export const postRoom = (userId, email, desciption, phone, zip, type, price, callback) => async (dispatch) => {
  const requestURL = BASE_URL + '/addroom';
  const body = {
    userId,
    email,
    desciption,
    phone,
    zip,
    price,
    type
  };
  try {
    const { data } = await axios.post(requestURL, body);
    if (data.errorMessage) {
      console.error(data.errorMessage);
    } else {
      dispatch({ type: USER_ADD_ROOM, payload: data });
      callback();
    }
  } catch (e) {
    console.error(e);
  }
};


export const getPostRoom = (userId, email, callback) => async (dispatch) => {
  const requestUrl = BASE_URL + '/roomsummary' + `?userId=${userId}` + `&email=${email}`;
  try {
    const { data } = await axios.get(requestUrl);
    console.log(data);
    if (data.errorMessage) {
      console.error(data.errorMessage);
    } else {
      dispatch({ type: FETCH_USER_POST_ROOM, payload: data });
      callback();
    }
  } catch (e) {
    console.error(e);
  }
};

export const addLikeRoom = (userId, roomId, email, expire, price, type, zip) => async (dispatch) => {
  const requestUrl = BASE_URL + '/addroomlike';
  const body = {
    userId,
    roomId,
    email,
    expire,
    price,
    type,
    zip
  };
  try {
    const { data } = await axios.post(requestUrl, body);
    console.log(data);
    if (data.errorMessage) {
      console.log(data.errorMessage);
    }
  } catch (e) {
    console.error(e);
  }
};
