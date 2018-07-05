import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser
} from 'amazon-cognito-identity-js';
import qs from 'qs';
import axios from 'axios';
import { AsyncStorage, Linking } from 'react-native';
import { AuthSession } from 'expo';
import {
  ERROR_SIGN_UP,
  SIGN_UP_SUCCESS
} from './types';
import { UserPoolId, ClientId, cognitoUrl } from '../key/cognitoKey';

const poolData = {
    UserPoolId,
    ClientId
};
const userPool = new CognitoUserPool(poolData);

export const logInCognitoPool = (email, password, callback) => async(dispatch) => {
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
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
        },
        onFailure: function(err) {
            console.log(err);
        },
  });
};

export const signUpCognitoPool = (email, password, firstName, lastName, callback) => async(dispatch) => {
    let attributeList = [];
    const dataEmail = {
        Name: 'email',
        Value: email
    };
    const dataFirstName = {
      Name: 'given_name',
      Value: firstName
    };
    const dataLastName = {
      Name: 'family_name',
      Value: lastName
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributeFirstName = new CognitoUserAttribute(dataFirstName);
    const attributeLastName = new CognitoUserAttribute(dataLastName);
    attributeList.push(attributeEmail, attributeFirstName, attributeLastName);
    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
            console.log(err)
            dispatch({ type: ERROR_SIGN_UP, payload: err });
            return;
        }
        cognitoUser = result.user;
        dispatch({ type: SIGN_UP_SUCCESS, payload: cognitoUser.getUsername() });
        callback();
    });
};

export const facebookSignUp = () => async(dispatch) => {
  const redirectUrl = AuthSession.getRedirectUrl();
  const result = await AuthSession.startAsync({
    authUrl: cognitoUrl + '/login?response_type=code'+
    `&client_id=${ClientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUrl)}`
  })
  if (result.type === 'success') {
    const authCode = result.params.code;
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
    try {
      const token = await axios.post(requestUrl, qs.stringify(data), config);
      if (token.status === 200) {
        const reqUrl = cognitoUrl + '/oauth2/userInfo'
        const user = await axios.get(reqUrl,
          { headers: { Authorization: `Bearer ${token.data.access_token}` } });
          console.log(user.data);
      }
    } catch (e) {
      dispatch({ type: ERROR_SIGN_UP, payload: e });
    }
  }
  return;
};


export const facebookSignOut = () => async (dispatch) => {
  const redirectUrl = AuthSession.getRedirectUrl();
  await AuthSession.startAsync({
    authUrl: cognitoUrl + '/logout?' +
    '&client_id=6ukrc6jrth7ulvf9q1efjn6kfc' +
    `&logout_uri=${encodeURIComponent(redirectUrl)}`
  });
};

function saveUserAndToken() {
}
