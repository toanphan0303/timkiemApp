import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken
} from 'amazon-cognito-identity-js';
import _ from 'lodash';
import qs from 'qs';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { AuthSession } from 'expo';
import {
  ERROR_SIGN_UP,
  SIGN_UP_SUCCESS,
  LOGIN_SUCCESS,
  ERROR_LOGIN,
  GET_USER_SUCCESS
} from '../types';
import { UserPoolId, ClientId, cognitoUrl } from '../../key/cognitoKey';

const USER_BASE_URL = 'https://uejssrxsr1.execute-api.us-east-1.amazonaws.com/prod/user';
const poolData = {
    UserPoolId,
    ClientId
};
const userPool = new CognitoUserPool(poolData);

export async function logInCognitoPool(term, email, password, callback, dispatch){
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
              const userInfo = result.idToken.payload;
              const { family_name, given_name, email, sub } = userInfo;
              await onAuthComplete('email',result.getAccessToken().getJwtToken(), result.getIdToken().getJwtToken(), result.getRefreshToken().getToken());
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
            if(err.code === 'UnknownError'){
              callback();
            }
            console.log('error of authenticateUser', err);
        },
  });
};

async function validateUserPool(){
    const userInfo = {}
    return new Promise((resolve, reject) => {
      userPool.storage.sync((err, result) => {
        if(err) {
          console.log('unable to load user to local storage', err)
        } else if( result === 'SUCCESS') {
          const cognitoUser = userPool.getCurrentUser();
          if (cognitoUser != null) {
               cognitoUser.getSession(function(err, session) {
                   if (err) {
                       console.log('error when get user session ', err)
                       return;
                   }
                   cognitoUser.getUserAttributes(function(err, attributes) {
                       if (err) {
                         console.log('error on validate session ', err)
                       } else {
                         for (item of attributes) {
                            userInfo[item.Name] = item.Value;
                         }
                          return resolve({data: userInfo });
                       }
                   });
               });
           }
        }
      })
    })
}

export async function invalidateToken() {
  return await AsyncStorage.multiRemove(['type','access_token', 'id_token', 'refresh_token' ])
}
// save user and token in local storage
export async function onAuthComplete(type, access_token, id_token, refresh_token) {
  const data = []
  const typeLogin = ['typeLogin', type ]
  const accessToken = ['access_token', access_token ];
  const idToken = ['id_token', id_token];
  const refreshToken = ['refresh_token', refresh_token];
  data.push(typeLogin, accessToken,idToken, refreshToken)
  try {
    await AsyncStorage.multiSet(data);
  } catch(e) {
    console.error(e);
  }
}

export async function registerUserIntoDDB(user) {
  const requestUrl = USER_BASE_URL;
  const { sub, email, username, given_name, family_name } = user;
  const existedUser = await checkUserInDB(email);
  if ( !_.isEmpty(existedUser)) {
    return;
  };
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

export async function checkUserInDB(email){
  const requestUrl = USER_BASE_URL + '/checkemailexisted' +`?email=${email}`
  try{
    const { data } =  await axios.get(requestUrl)
    return data.result;
  } catch(e) {
    console.log('check user  in DB error ', e)
  }
}

export async function getUserInfo(type, accessToken) {
  if( type === 'email'){
    return await validateUserPool();
  } else if ( type === 'social' ){
    const reqUrl = cognitoUrl + '/oauth2/userInfo'
    return await axios.get(reqUrl,
      { headers: { Authorization: `Bearer ${accessToken}` } });
  }
}

export async function getTokenSocial(authCode) {
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
    return await axios.post(requestUrl, qs.stringify(data), config);
  } catch (e) {
    console.log('error on get token for social auth ', e)
  }
}
