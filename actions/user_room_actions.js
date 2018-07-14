import axios from 'axios';
import _ from 'lodash';

import {
  USER_ADD_ROOM,
  FETCH_USER_POST_ROOM,
  FETCH_USER_LIKE_ROOM
} from './types';

const BASE_URL = 'https://uejssrxsr1.execute-api.us-east-1.amazonaws.com/prod/user';

export const postRoom = (userId, email, desciption, phone, zip, type, price, callback) => async (dispatch) => {
  const requestURL = BASE_URL + '/addroom';
  const body = {
    userId,
    email,
    desc: desciption,
    phone,
    zip,
    price,
    type
  };
  console.log(body);
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

export const addLikeRoom = (userId, roomId, userEmail, expire, price, type, zip, creatorEmail) => async (dispatch) => {
  const requestUrl = BASE_URL + '/addroomlike';
  const body = {
    userId,
    roomId,
    userEmail,
    expire,
    price,
    type,
    zip,
    creatorEmail
  };
  console.log(body)
  try {
    const { data } = await axios.post(requestUrl, body);
    if (data.errorMessage) {
      console.log(data.errorMessage);
    } else {
      return data;
    }
  } catch (e) {
    console.error(e);
  }
};

export const romveLikeRoom = (userId, email, index) => async (dispatch) => {
  const requestUrl = BASE_URL + '/removeroomlike';
  const body = {
    userId,
    email,
    index
  };
  try {
    const { data } = await axios.post(requestUrl, body);
    if (data.errorMessage) {
      console.log(data.errorMessage);
    } else {
      return data;
    }
  } catch (e) {
    console.error(e);
  }
};

export const getLikeRooms = (userId, email, callback) => async (dispatch) => {
  const requestUrl = BASE_URL + '/getroomlike' + `?userId=${userId}` + `&userEmail=${email}`;
  try {
    const { data } = await axios.get(requestUrl);
    if (data.errorMessage) {
      console.log(data.errorMessage);
    } else {
      dispatch({ type: FETCH_USER_LIKE_ROOM, payload: data });
      callback();
    }
  } catch (e) {
    console.error(e);
  }
};
