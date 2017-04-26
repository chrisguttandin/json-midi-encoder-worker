import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    dest: 'build/es5/worker.js',
    entry: 'build/es2015/module.js',
    format: 'iife',
    moduleName: 'jsonMidiEncoderWorker',
    plugins: [
        babel({
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
