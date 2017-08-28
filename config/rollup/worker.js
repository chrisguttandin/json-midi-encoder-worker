import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'build/es2015/module.js',
    output: {
        file: 'build/es5/worker.js',
        format: 'iife',
        name: 'jsonMidiEncoderWorker'
    },
    plugins: [
        babel({
            plugins: [
                'external-helpers'
            ],
            presets: [
                [
                    'es2015',
                    {
                        modules: false
                    }
                ]
            ]
        }),
        nodeResolve()
    ]
};
