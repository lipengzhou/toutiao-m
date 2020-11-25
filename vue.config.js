module.exports = {
  devServer: {
    // 此代理仅针对本地开发服务（npm run serve）
    proxy: {
      '/api': {
        target: 'http://ttapi.research.itcast.cn/',
        changeOrigin: true,
        pathRewrite: {
          '^/api/': ''
        }
      }
    }
  }
}
