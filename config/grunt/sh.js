module.exports = {
    build: {
        cmd: 'tsc -p src/tsconfig.json && rollup -c config/rollup/bundle.js && rollup -c config/rollup/worker.js'
    },
    lint: {
        cmd: 'tslint -c config/tslint/src.json --project src/tsconfig.json --type-check src/**/*.ts'
    }
};
