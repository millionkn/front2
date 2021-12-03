import request from 'umi-request';

export async function queryRule(opt: { page: { index: number, size: number } }) {
  return request('api/table/person-log', {method:'POST', body: JSON.stringify(opt) });
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
