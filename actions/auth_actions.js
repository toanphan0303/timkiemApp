import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser
} from 'amazon-cognito-identity-js';

import qs from 'qs';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { AuthSession } from 'expo';
import {
  ERROR_SIGN_UP,
  SIGN_UP_SUCCESS,
  SIGN_UP_FACEBOOK_SUCCESS,
  LOGIN_SUCCESS,
  ERROR_LOGIN,
  GET_USER_SUCCESS
} from './types';
import { UserPoolId, ClientId, cognitoUrl } from '../key/cognitoKey';

const poolData = {
    UserPoolId,
    ClientId
};
const userPool = new CognitoUserPool(poolData);
export const loginPoolWraper = (term, email, password, callback) => async(dispatch) => {
  return await logInCognitoPool(term, email, password, callback, dispatch);
};

async function logInCognitoPool(term, email, password, callback, dispatch){
  const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
    });

    const userData = {
        Username: email,
        Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async function (result) {
            try {
              await onAuthComplete(result.getAccessToken().getJwtToken(), result.getIdToken().getJwtToken(), result.getRefreshToken().getToken());
              const userInfo = result.idToken.payload;
              const { family_name, given_name, email, sub } = userInfo;
              dispatch({ type: LOGIN_SUCCESS, payload: {email, given_name, family_name, sub}});
              if(term === 'signup') {
                  await registerUserIntoDDB({family_name, given_name, email, sub, username: email});
              }
              callback();
            } catch(e){
              console.err('here is error in logInCognitoPool', e)
            }
        },
        onFailure: function(err) {
            console.log('error of authenticateUser', err);
        },
  });
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
            console.log('error of sign up', err)
            dispatch({ type: ERROR_SIGN_UP, payload: err });
            return;
        }
        cognitoUser = result.user;
        try {
            await logInCognitoPool(term, email, password, callback, dispatch);
        } catch(e) {
          dispatch({ type: ERROR_LOGIN, payload: err });
        }
    });
};

export const facebookAuth = (term, callback) => async(dispatch) => {
  const redirectUrl = AuthSession.getRedirectUrl();
  const result = await AuthSession.startAsync({
    authUrl: cognitoUrl + '/login?response_type=code'+
    `&client_id=${ClientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUrl)}`
  })
  if (result.type === 'success') {
    try {
      const token = await getTokenFacebook(result.params.code);
      if (token.status === 200) {
        const user = await getUserInfo(token.data.access_token)
        if (user.data) {
          const { access_token, id_token, refresh_token } = token.data;
          await onAuthComplete(access_token, id_token, refresh_token)
          if(term === 'signup'){
            await registerUserIntoDDB(user.data)
          }
          dispatch({ type: LOGIN_SUCCESS, payload: user.data });
          callback();
        }
      }
    } catch (e) {
      dispatch({ type: ERROR_SIGN_UP, payload:{}, error: e });
    }
  }
  return;
};


export const signOut = () => async (dispatch) => {
  const redirectUrl = AuthSession.getRedirectUrl();
  try {
    await AuthSession.startAsync({
      authUrl:   cognitoUrl + '/logout?' +
      `&client_id=${ClientId}` +
      `&logout_uri=${encodeURIComponent(redirectUrl)}`
    })
    await invalidateToken();
    dispatch({ type: LOGIN_SUCCESS, payload: {} });
  } catch(e) {
    console.error(e);
  }
};

async function getTokenFacebook(authCode) {
  const requestUrl = cognitoUrl + '/oauth2/token';
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  const data = {
    grant_type: 'authorization_code',
    scope: 'email openid profile',
    redirect_uri: 'https://auth.expo.io/@nein0303/timkiem',
    client_id: `${ClientId}`,
    code: authCode
  };
  return await axios.post(requestUrl, qs.stringify(data), config);
}
async function getUserInfo(accessToken) {
  const reqUrl = cognitoUrl + '/oauth2/userInfo'
  return await axios.get(reqUrl,
    { headers: { Authorization: `Bearer ${accessToken}` } });
}

export const getUser = (accessToken) => async(dispatch) => {
  try{
    const userInfo = await getUserInfo(accessToken)
    dispatch({ type: LOGIN_SUCCESS, payload: userInfo.data });
  } catch(e) {
    console.log(e)
  }
}
async function registerUserIntoDDB(user) {
  const requestUrl = 'https://uejssrxsr1.execute-api.us-east-1.amazonaws.com/prod/user';
  const { sub, email, username, given_name, family_name } = user;
  const body = {
    sub,
    email,
    given_name,
    family_name,
    username
  }
  try {
    await axios.post(requestUrl, body);
  } catch (e) {
    console.error(e);
  }
}
// save user and token in local storage
async function onAuthComplete(access_token, id_token, refresh_token) {
  const data = []
  const accessToken = ['access_token', access_token ];
  const idToken = ['id_token', id_token];
  const refreshToken = ['refresh_token', refresh_token];
  data.push(accessToken,idToken, refreshToken)
  try {
    await AsyncStorage.multiSet(data);
  } catch(e) {
    console.error(e);
  }
}
async function invalidateToken() {
  return await AsyncStorage.multiRemove(['access_token', 'id_token', 'refresh_token' ])
}
