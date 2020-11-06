module.exports = {
    apps: [
        {
            name: 'playground-http-server',
            script: 'dist/http-server/src/server.js',
            restart_delay: 500,
            instances: 1,
            exec_mode: 'cluster',
            env: {
                'NODE_ENV': 'dev',
            }
        },
    ]
};
