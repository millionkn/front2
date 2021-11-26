import axios from "axios";

axios.interceptors.response.use((res) => {
  const token = res.headers['set-auth-token']
  if (token) { window.localStorage.setItem('auth-token', token) }
  return res
})

axios.interceptors.request.use((req) => {
  const token = window.localStorage.getItem('auth-token')
  if (token) {
    req.headers = {
      ...req.headers,
      'auth-token': token,
    }
  }
  return req
})