// services/api.js
const BASE_URL = 'https://apis.allsoft.co/api/documentManagement/';

export async function generateOTP(mobile) {
  const res = await fetch(`${BASE_URL}generateOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile_number: mobile }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to generate OTP');
  }
  // No need to parse JSON, assume success if OK
  return;
}

export async function validateOTP(mobile, otp) {
  const res = await fetch(`${BASE_URL}validateOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile_number: mobile, otp }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to validate OTP');
  }
  return res.json();
}

export async function getTags(term, token) {
  const res = await fetch(`${BASE_URL}documentTags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token },
    body: JSON.stringify({ term }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to get tags');
  }
  return res.json();
}

export async function uploadDocument(file, data, token) {
  const formData = new FormData();
  formData.append('file', { uri: file.uri, type: file.mimeType || 'application/octet-stream', name: file.name || 'file' });
  formData.append('data', JSON.stringify(data));
  const res = await fetch(`${BASE_URL}saveDocumentEntry`, {
    method: 'POST',
    headers: { token },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to upload');
  }
  return res.json();
}

export async function searchDocuments(params, token) {
  const res = await fetch(`${BASE_URL}searchDocumentEntry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token },
    body: JSON.stringify({
      major_head: params.major_head,
      minor_head: params.minor_head,
      from_date: params.from_date,
      to_date: params.to_date,
      tags: params.tags.map(t => ({ tag_name: t })),
      uploaded_by: '',
      start: 0,
      length: 10,
      filterId: '',
      search: { value: '' },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to search');
  }
  const data = await res.json();
  return data.data || [];
}