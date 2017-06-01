import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
//https://github.com/rollup/rollup/blob/a9f342cb26d14ae8ee93a8f8f39f35dc968e3461/src/finalisers/umd.js#L83
export default {
    entry: 'src/index.js',
    format: 'umd',
    moduleName: 'NeactRouter',
    exports: 'named',
    legacy: true,
    sourceMap: true,
    //globals : ['neact'],
    external: ['neact'],
    plugins: [
        resolve(),
        commonjs(),
        json(),
        babel({
            "presets": ['react', 'stage-0'],
            "babelrc": false,
            "plugins": [
                "external-helpers",
                "transform-es3-property-literals",
                "transform-es3-member-expression-literals", "transform-es2015-shorthand-properties",
                "transform-es2015-arrow-functions",
                "transform-es2015-block-scoped-functions",
                "transform-es2015-block-scoping",
                "transform-es2015-classes",
                "transform-es2015-computed-properties",
                "transform-es2015-destructuring",
                "transform-es2015-for-of",
                "transform-es2015-literals",
                "transform-es2015-object-super",
                "transform-es2015-parameters",
                "transform-es2015-spread",
                "transform-es2015-sticky-regex",
                "transform-es2015-template-literals",
                "transform-es2015-typeof-symbol",
                "transform-es2015-unicode-regex"
            ]
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    dest: 'dist/neact-router.js'
};