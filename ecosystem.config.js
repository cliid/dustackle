module.exports = {
  apps: [
    {
      name: 'dustackle',
      script: './dist/main.js',
      interpreter_args: '-r ts-node/register/transpile-only -r tsconfig-paths/register',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
