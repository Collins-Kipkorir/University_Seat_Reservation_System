const API_BASE = 'http://localhost:8000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const auth = {
  login: (studentId, password) =>
    request('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId, password }),
    }),
  register: (data) =>
    request('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  logout: () => request('/auth/logout.php', { method: 'POST' }),
  me: () => request('/auth/me.php'),
};

export const venues = {
  list: () => request('/venues/index.php'),
};

export const reservations = {
  list: () => request('/reservations/index.php'),
  create: (data) =>
    request('/reservations/create.php', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (data) =>
    request('/reservations/update.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  cancel: (id) =>
    request('/reservations/cancel.php', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }),
};
