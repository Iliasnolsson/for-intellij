import * as path from 'path'
import typescript2 from 'rollup-plugin-typescript2';
import dts from "vite-plugin-dts";
import vue from '@vitejs/plugin-vue';
import {defineConfig} from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
    plugins: [
        vue(),
        cssInjectedByJsPlugin(),
        dts({
            insertTypesEntry: true,
        }),
        // @ts-ignore
        typescript2({
            check: false,
            include: ["src/**/*.vue"],
            tsconfigOverride: {
                compilerOptions: {
                    outDir: "dist",
                    sourceMap: true,
                    declaration: true,
                    declarationMap: true,
                },
            },
            exclude: ["vite.config.ts", "src/*.vue"]
        })
    ],
    build: {
        cssCodeSplit: true,
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: "src/package.ts",
            name: 'package',
            formats: ["es", "cjs", "umd"],
            fileName: format => `package.${format}.js`
        },
        rollupOptions: {
            // make sure to externalize deps that should not be bundled
            // into your library
            input: {
                package: path.resolve(__dirname, "src/package.ts"),
            },
            external: [
                "vue",
                "idb"
            ],
            output: {
                exports: "named",
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})