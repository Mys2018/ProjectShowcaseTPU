// Проверяет, что API не отдаёт персональные данные запросу без cookie.
// Значения полей не выводятся: только адрес, код ответа и названия полей.
//
//   npm run check:anonymous-access
//   API_URL=https://tpu.community.design/dev/api USER_ID=1 npm run check:anonymous-access
//
// Закрытый список /users не даёт узнать существующий id, поэтому для точной
// проверки /users/{id} укажите USER_ID: на несуществующий id API отвечает 422.

const API_URL = process.env.API_URL ?? 'https://tpu.community.design/dev/api';

const USER_FIELDS = ['email', 'capabilities', 'roles'];
// У проекта своё поле roles — это роли в команде, а не роли пользователя.
const PROJECT_FIELDS = ['email', 'capabilities'];

const findForbiddenFields = (value, forbidden, found = new Set()) => {
  if (Array.isArray(value)) {
    value.forEach((item) => findForbiddenFields(item, forbidden, found));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, nested]) => {
      if (forbidden.includes(key)) found.add(key);
      findForbiddenFields(nested, forbidden, found);
    });
  }
  return found;
};

const request = async (path) => {
  const response = await fetch(`${API_URL}${path}`, { redirect: 'manual' });
  const text = await response.text();
  try {
    return { status: response.status, body: JSON.parse(text) };
  } catch {
    return { status: response.status, body: null };
  }
};

const { body: usersBody } = await request('/users?limit=1');
const { body: projectsBody } = await request('/projects?limit=20');

const userId = process.env.USER_ID ?? usersBody?.users?.[0]?.userId ?? '1';
const projectIds = (projectsBody?.hits ?? []).map((project) => project.id);

const checks = [
  ['/users?limit=1', USER_FIELDS],
  [`/users/${userId}`, USER_FIELDS],
  [`/users/${userId}/scores`, USER_FIELDS],
  ['/applications', USER_FIELDS],
  ['/complaints', USER_FIELDS],
  ['/moderation/complaints', USER_FIELDS],
  ['/projects?limit=20', PROJECT_FIELDS],
];

// Пустая команда ничего не доказывает, поэтому ищем проект с участниками.
let teamPath;
for (const projectId of projectIds) {
  teamPath = `/projects/${projectId}/team`;
  const { body } = await request(teamPath);
  if (Array.isArray(body) && body.length > 0) break;
}

if (teamPath) {
  checks.push([teamPath, USER_FIELDS]);
} else {
  console.log('Проекты не найдены: /projects/{id}/team не проверен');
}

let failed = false;

for (const [path, forbidden] of checks) {
  const { status, body } = await request(path);
  const fields = status < 300 ? [...findForbiddenFields(body, forbidden)] : [];
  const isExposed = fields.length > 0;
  failed ||= isExposed;
  console.log(`${isExposed ? 'FAIL' : 'ok  '} ${status} ${path}${isExposed ? ` — поля: ${fields.join(', ')}` : ''}`);
}

process.exit(failed ? 1 : 0);
