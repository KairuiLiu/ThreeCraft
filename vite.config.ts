import { defineConfig } from 'vite';
import path from 'path';
import styleImport from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [],
	server: {
		host: '0.0.0.0',
		proxy: {},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			pages: path.resolve(__dirname, './src/pages'),
			utils: path.resolve(__dirname, './src/utils'),
			configs: path.resolve(__dirname, './src/configs'),
		},
		extensions: ['.js', '.json', '.ts'], // 使用路径别名时想要省略的后缀名，可以自己 增减
	},
	// 由于项目./doc中有index.html, 所以要显式忽略doc文件夹并指定index.html
	optimizeDeps: {
		exclude: ['doc'],
		entries: './index.html',
	},
	build: {
		terserOptions: {
			compress: {
				//生产环境时移除console
				drop_console: true,
				drop_debugger: true,
			},
		},
		// 取消计算文件大小，加快打包速度
		brotliSize: false,
		sourcemap: true,
		// assetsDir: 'static/img',
		rollupOptions: {
			output: {
				chunkFileNames: 'js/[name]-[hash].js',
				entryFileNames: 'js/[name]-[hash].js',
				assetFileNames: '[ext]/[name]-[hash].[ext]',
			},
		},
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
			},
		},
	},
});
