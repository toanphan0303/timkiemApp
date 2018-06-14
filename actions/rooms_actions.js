import {
  FETCH_ROOMS_ZIP
} from './types';
import ROOM_DATA from './sortZip.json';

export const fetchRooms = () => async (dispatch) => {
  try {
    const data = ROOM_DATA;
    dispatch({ type: FETCH_ROOMS_ZIP, payload: data });
  } catch (e) {
    console.error(e);
  }
};
