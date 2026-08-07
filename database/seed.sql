-- Local demonstration data only.
-- Seeded users have deliberately unusable password placeholders and cannot sign in.
-- Register a new user through the API when testing authentication.

INSERT INTO users (
  id,
  name,
  email,
  password_hash
)
VALUES
  (
    '10000000-0000-4000-8000-000000000001',
    'Samuel Demo',
    'samuel.demo@example.com',
    'authentication-not-enabled'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Ana Demo',
    'ana.demo@example.com',
    'authentication-not-enabled'
  )
ON CONFLICT DO NOTHING;

INSERT INTO projects (
  id,
  owner_id,
  name,
  description
)
VALUES (
  '20000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  'Nexo Projects Demo',
  'Demonstration workspace for the Nexo Projects API.'
)
ON CONFLICT DO NOTHING;

INSERT INTO project_members (
  project_id,
  user_id,
  role
)
VALUES
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'owner'
  ),
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000002',
    'member'
  )
ON CONFLICT DO NOTHING;

INSERT INTO tasks (
  id,
  project_id,
  assigned_to,
  created_by,
  title,
  description,
  status,
  priority,
  due_date
)
VALUES
  (
    '30000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001',
    'Design the project dashboard',
    'Create the first dashboard wireframe and define its main metrics.',
    'in_progress',
    'high',
    NOW() + INTERVAL '7 days'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000001',
    NULL,
    '10000000-0000-4000-8000-000000000001',
    'Document the REST API',
    'Add endpoint examples and local setup instructions.',
    'todo',
    'medium',
    NOW() + INTERVAL '14 days'
  )
ON CONFLICT DO NOTHING;

INSERT INTO comments (
  id,
  task_id,
  created_by,
  content
)
VALUES (
  '40000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002',
  'The first dashboard draft is ready for review.'
)
ON CONFLICT DO NOTHING;