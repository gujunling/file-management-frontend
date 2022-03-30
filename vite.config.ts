import { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  return {
    root,
    resolve: {
      alias: [
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/'
        }
      ]
    },
    plugins: [
      vue(),
      viteCompression({
        //生成压缩包gz
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      })
    ],
    server: {
      host: '0.0.0.0',
      //  open: true // 自动打开浏览器
      port: 3100,
      proxy: {
        '/upload': {
          target: 'http://sweetheartjq.cn:8089',
          changeOrigin: true
        }
      }
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      terserOptions: {
        //打包后移除console和注释,适用于生产环境
        compress: {
          keep_infinity: true,
          drop_debugger: true,
          // Used to delete console in production environment
          drop_console: false
        }
      },
      // Turning off brotliSize display can slightly reduce packaging time 取消计算文件大小，可以稍微加快打包速度
      brotliSize: false,
      // 块大小警告的限制（以 kbs 为单位）
      chunkSizeWarningLimit: 1500
    }
  }
}
