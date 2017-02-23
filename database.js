module.exports = {
  'development': {
    'url': 'postgres://pet:petutility!@172.18.100.10:5432/database',
    'dialect': 'postgres'
  },
  'test': {
    'use_env_variable': 'DATABASE_URL',
    'dialect': 'postgres'
  },
  'production': {
    'use_env_variable': 'DATABASE_URL',
    'dialect': 'postgres'
  }
}
