import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import typeScript from 'rollup-plugin-typescript2';
import visualizer from 'rollup-plugin-visualizer';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'src/index.ts',
    output: [{
      file: 'build/index.js',
      format: 'cjs',
      sourcemap: 'inline',
      name: '@yojji/core'
    }],
    plugins: [
      nodeResolve(),
      commonJs(),
      typeScript({ clean: true }),
      sizeSnapshot(),
      visualizer(),
      babel({
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              spec: true,
              forceAllTransforms: true,
              useBuiltIns: 'usage',
              corejs: 3,
              polyfills: ['es7.object.entries, es7.object.values'],
              targets: {
                node: 8,
                ie: 11
              },
            }
          ]
        ]
      })
    ],
  },
];
