const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
  // 创建代理对象并转发请求
  createProxyMiddleware({
    target: 'http://ttapi.research.itcast.cn/',
    changeOrigin: true,
    pathRewrite: {
      // 通过路径重写，去除请求路径中的 /api
      //   例如 /api/xxx 将被转发到 http://ttapi.research.itcast.cn/xxx
      '^/api/': ''
    }
  })(req, res)
}
