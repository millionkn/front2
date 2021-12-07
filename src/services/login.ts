import axios from 'axios';

export type LoginParamsType = {
  username: string;
  password: string;
};

export async function fakeAccountLogin(params: LoginParamsType) {
  return axios.post('api/status/login', params).then((x)=>x.data);
}