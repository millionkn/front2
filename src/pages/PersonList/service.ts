import request from 'umi-request';

export async function queryRule() {
  return request('/api/rule', {});
}

export async function removeRule() {
  return request('/api/rule', {
    method: 'POST',
  });
}

export async function addRule() {
  return request('/api/rule', {
    method: 'POST',
  });
}

export async function updateRule() {
  return request('/api/rule', {
    method: 'POST',
  });
}
