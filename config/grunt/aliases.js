const { env } = require('process');

module.exports = {
    build: [
        'clean:build',
        'sh:build-es2018',
        'sh:build-es5'
    ],
    lint: [
        'sh:lint-config',
        'sh:lint-src',
        'sh:lint-test'
    ],
    // @todo Reenable unit tests on Travis.
    test: (env.TRAVIS)
        ? [
            'sh:test-integration'
        ]
        : [
            'sh:test-integration',
            'sh:test-unit'
        ]
};
