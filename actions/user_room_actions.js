import axios from 'axios';

import {
  USER_ADD_ROOM,
  FETCH_USER_POST_ROOM,
  FETCH_USER_LIKE_ROOM
} from './types';

const BASE_URL = 'https://uejssrxsr1.execute-api.us-east-1.amazonaws.com/prod/user';

export const postRoom = (userId, email, desciption, phone, zip, type, price, callback) => async (dispatch) => {
  const requestURL = BASE_URL + '/addroom';
  const desc = desciption.replace(/\n/g, ' ');
  const body = {
    userId,
    email,
    desc,
    phone,
    zip,
    price,
    type
  };
  try {
    const { data } = await axios.post(requestURL, body);
    if (data.errorMessage) {
      console.log(data.errorMessage);
    } else {
      dispatch({ type: USER_ADD_ROOM, payload: data });
      callback();
      return data;
    }
  } catch (e) {
    console.log(e);
  }
};


export const getPostRoom = (userId, email, callback) => async (dispatch) => {
  const requestUrl = BASE_URL + '/roomsummary' + `?userId=${userId}` + `&email=${email}`;
  try {
    const { data } = await axios.get(requestUrl);
    if (data.errorMessage) {
      console.log(data.errorMessage);
    } else {
      dispatch({ type: FETCH_USER_POST_ROOM, payload: data });
      callback();
    }
  } catch (e) {
    console.log(e);
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
  try {
    const { data } = await axios.post(requestUrl, body);
    if (data.errorMessage) {
      console.log(data.errorMessage);
    } else {
      return data;
    }
  } catch (e) {
    console.log(e);
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
    console.log(e);
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
    console.log(e);
  }
};

export const updateRoom = (roomId, email, desciption, phone, zip, type, price) => async (dispatch) => {
  const requestURL = BASE_URL + '/updateroom';
  const desc = desciption.replace(/\n/g, ' ');
  const body = {
    roomId,
    email,
    desc,
    phone,
    zip,
    price,
    type
  };
  try {
    const { data } = await axios.post(requestURL, body);
    console.log(data);
    if (data.errorMessage) {
      console.log(data.errorMessage);
    } else {
      dispatch({ type: USER_ADD_ROOM, payload: data });
    }
  } catch (e) {
    console.log(e);
  }
};

export const romvePostRoom = (userId, roomId, email, index, zip) => async (dispatch) => {
  const requestUrl = BASE_URL + '/deleteroom';
  const body = {
    userId,
    email,
    index,
    roomId,
    zip
  };
  try {
    const { data } = await axios.post(requestUrl, body);
    if (data.errorMessage) {
      console.log(data.errorMessage);
    } else {
      return data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const uploadImage = (roomId, zip, email, images) => async(dispatch) => {
  const requestUrl = BASE_URL + '/addimages';
  const body = {
    roomId,
    zip,
    email,
    images
  };
  try {
    return axios.post(requestUrl, body);
  } catch (e) {
    console.log('error posting image', e);
  }
};
