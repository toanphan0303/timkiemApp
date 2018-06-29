import axios from 'axios';
import _ from 'lodash';
import {
  FETCH_ROOMS_AMOUNT_IN_ZIP,
  FETCH_ROOMS_IN_ZIP,
  FETCH_ROOMS_IN_MULTI_ZIPS,
  FETCH_DETAIL_ROOM
} from './types';

const baseURL = 'https://uejssrxsr1.execute-api.us-east-1.amazonaws.com/prod/roomszip';

export const fetchRoomsAmountInZip = (latitude, longitude) => async (dispatch) => {
  const requestURL = baseURL + '?latitude=' + latitude + '&longitude=' + longitude;
  try {
    const { data } = await axios.get(requestURL);
    dispatch({ type: FETCH_ROOMS_AMOUNT_IN_ZIP, payload: data });
  } catch (e) {
    console.error(e);
  }
};

export const fetchRoomsInSingleZip = (zip, callback) => async (dispatch) => {
  const requestURL = baseURL + '/zip' + '?zipcode=' + zip;
  try {
    const { data } = await axios.get(requestURL);
    dispatch({ type: FETCH_ROOMS_IN_ZIP, payload: data });
    callback();
  } catch (e) {
    console.error(e);
  }
};

export const fetchRoomInMultiZips = (zip, state, callback) => async (dispatch) => {
  const requestURL = baseURL + '/multizip' + '?zipcode=' + zip + '&state=' + state;
  try {
    const { data } = await axios.get(requestURL);
    let temp = [];
    if (!_.isEmpty(data.data)) {
      for (const item of data.data) {
        temp = _.concat(temp, item.table.Items);
      }
    }
    dispatch({ type: FETCH_ROOMS_IN_MULTI_ZIPS, payload: { Items: temp } });
    callback();
  } catch (e) {
    console.error(e);
  }
};

export const fetchDetailRoom = (zip, id, callback) => async (dispatch) => {
  const requestURL = baseURL + '/roomdetail' + '?zipcode=' + zip + '&id=' + id;
  try {
    const { data } = await axios.get(requestURL);
    dispatch({ type: FETCH_DETAIL_ROOM, payload: data });
    callback();
  } catch (e) {
    console.error(e);
  }
};
