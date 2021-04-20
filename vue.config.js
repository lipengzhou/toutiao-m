module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://api-toutiao-web.itheima.net',
        target: 'http://ttapi.research.itcast.cn/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api/': ''
        }
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296FA',
          'text-color': '#333'
        }
      }
    }
  }
}
