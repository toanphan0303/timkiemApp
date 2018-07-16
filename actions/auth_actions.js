import { CognitoUserPool } from 'amazon-cognito-identity-js';
import _ from 'lodash';
import { AsyncStorage } from 'react-native';
import { AuthSession } from 'expo';
import {
  ERROR_SIGN_UP,
  LOGIN_SUCCESS,
  ERROR_LOGIN,
} from './types';
import {
  logInCognitoPool,
  invalidateToken,
  onAuthComplete,
  registerUserIntoDDB,
  checkUserInDB,
  getUserInfo,
  getTokenSocial
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
            dispatch({ type: ERROR_SIGN_UP, payload: err });
            return;
        }
        cognitoUser = result.user;
        try {
            await logInCognitoPool(term, email, password, callback, dispatch);
        } catch (e) {
          dispatch({ type: ERROR_LOGIN, payload: err });
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
  console.log('result ', result)
  if (result.type === 'success') {
    try {
      const token = await getTokenSocial(result.params.code);
      console.log('token ', token)
      if (token.status === 200) {
        const user = await getUserInfo('social', token.data.access_token);
        console.log('user ', user);
        if (user.data) {
          const { access_token, id_token, refresh_token } = token.data;
          await onAuthComplete('social', access_token, id_token, refresh_token);
          if (term === 'signup') {
            await registerUserIntoDDB(user.data);
          }
          dispatch({ type: LOGIN_SUCCESS, payload: user.data });
          callback();
        }
      }
    } catch (e) {
      console.log('error social auth: ', e);
      dispatch({ type: ERROR_SIGN_UP, payload: e });
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
  } else {
    const redirectUrl = AuthSession.getRedirectUrl();
    try {
      await AuthSession.startAsync({
        authUrl:   cognitoUrl + '/logout?' +
        `&client_id=${ClientId}` +
        `&logout_uri=${encodeURIComponent(redirectUrl)}`
      });
      await invalidateToken();
      dispatch({ type: LOGIN_SUCCESS, payload: {} });
    } catch (e) {
      console.error(e);
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
    dispatch({ type: LOGIN_SUCCESS, payload: userInfo.data });
  } catch (e) {
    console.log('get user error', e);
  }
};
