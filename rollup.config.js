import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import typeScript from 'rollup-plugin-typescript2';
import visualizer from 'rollup-plugin-visualizer';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.ts',
    output: [{ file: 'build/index.r.min.js', format: 'esm' }],
    plugins: [
      nodeResolve(),
      commonJs(),
      typeScript({ clean: true }),
      sizeSnapshot(),
      terser(),
      visualizer(),
    ],
  },
];
