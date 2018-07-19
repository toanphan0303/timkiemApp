import {
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';
import _ from 'lodash';
import { AsyncStorage } from 'react-native';
import { AuthSession } from 'expo';
import {
  LOGIN_SUCCESS,
  ERROR_AUTH
} from './types';
import {
  logInCognitoPool,
  invalidateToken,
  onAuthComplete,
  registerUserIntoDDB,
  checkUserInDB,
  getUserInfo,
  getTokenSocial,
  signOutSocial
} from './util/auth_function';
import { UserPoolId, ClientId, cognitoUrl } from '../key/cognitoKey';

const USER_BASE_URL = 'https://uejssrxsr1.execute-api.us-east-1.amazonaws.com/prod/user';
const poolData = {
    UserPoolId,
    ClientId
};
const userPool = new CognitoUserPool(poolData);

export const loginPoolWraper = (term, email, password, callback) => async(dispatch) => {
  return await logInCognitoPool(term, email, password, callback, dispatch);
};

export const signUpCognitoPool = (term, email, password, given_name, family_name, callback) => async(dispatch) => {
    let attributeList = [];
    const dataEmail = {
        Name: 'email',
        Value: email
    };
    const dataFirstName = {
      Name: 'given_name',
      Value: given_name
    };
    const dataLastName = {
      Name: 'family_name',
      Value: family_name
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributeFirstName = new CognitoUserAttribute(dataFirstName);
    const attributeLastName = new CognitoUserAttribute(dataLastName);
    attributeList.push(attributeEmail, attributeFirstName, attributeLastName);
    userPool.signUp(email, password, attributeList, null, async (err, result) => {
        if (err) {
            console.log('error of sign up', err);
            dispatch({ type: ERROR_AUTH, payload: err });
            return;
        }
        cognitoUser = result.user;
        try {
            await logInCognitoPool(term, email, password, callback, dispatch);
        } catch (e) {
          dispatch({ type: ERROR_AUTH, payload: e });
        }
    });
};

export const socialAuth = (term, callback) => async(dispatch) => {
  const redirectUrl = AuthSession.getRedirectUrl();
  const result = await AuthSession.startAsync({
    authUrl: cognitoUrl + '/login?response_type=code'+
    `&client_id=${ClientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUrl)}`
  });
  if (result.type === 'success') {
    try {
      const token = await getTokenSocial(result.params.code);
      if (token.status === 200) {
        const user = await getUserInfo('social', token.data.access_token);
        if (user.data) {
          const { access_token, id_token, refresh_token } = token.data;
          await onAuthComplete('social', access_token, id_token, refresh_token, dispatch);
          if (term === 'signup') {
            if (user && user.data) {
              const existedUser = await checkUserInDB(user.data.email);
              if (!_.isEmpty(existedUser)) {
                await signOutSocial();
                await invalidateToken();
                return dispatch({ type: ERROR_AUTH, payload: { message: 'Email already exist in Database' }});
              }
            }
            await registerUserIntoDDB(user.data, dispatch);
          }
          if (user && user.data) {
            const existedUser = await checkUserInDB(user.data.email);
            if (_.isEmpty(existedUser)) {
              await signOutSocial();
              await invalidateToken();
              return dispatch({ type: ERROR_AUTH, payload: { message: 'Please sign up first' } });
            }
          }
          dispatch({ type: LOGIN_SUCCESS, payload: user.data });
          dispatch({ type: ERROR_AUTH, payload: {} });
          callback();
        }
      }
    } catch (e) {
      console.log('error social auth: ', e);
      dispatch({ type: ERROR_AUTH, payload: e });
    }
  }
  return;
};


export const signOut = () => async (dispatch) => {
  const typeLogin = await AsyncStorage.getItem('typeLogin');
  if (typeLogin === 'email') {
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
    await invalidateToken();
    dispatch({ type: LOGIN_SUCCESS, payload: {} });
    dispatch({ type: ERROR_AUTH, payload: {} });
  } else {
    try {
      await signOutSocial();
      await invalidateToken();
      dispatch({ type: LOGIN_SUCCESS, payload: {} });
      dispatch({ type: ERROR_AUTH, payload: {} });
    } catch (e) {
      dispatch({ type: ERROR_AUTH, payload: e });
    }
  }
};


export const checkEmailExisted = (email) => async(dispatch) => {
  return checkUserInDB(email);
};


export const getUser = (accessToken) => async(dispatch) => {
  const typeLogin = await AsyncStorage.getItem('typeLogin');
  try {
    const userInfo = await getUserInfo(typeLogin, accessToken);
    if (userInfo && userInfo.data) {
      dispatch({ type: LOGIN_SUCCESS, payload: userInfo.data });
      dispatch({ type: ERROR_AUTH, payload: {} });
    }
  } catch (e) {
    console.log('error when get user', e);
    // get exchange token here
    dispatch({ type: ERROR_AUTH, payload: {} });
  }
};
