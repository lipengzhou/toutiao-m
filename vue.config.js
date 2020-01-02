module.exports = {
  publicPath: '/',
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/topline-mobile-preview/'
  //   : '/',
  devServer: {
    port: 8081
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'blue': '#3296FA',
          'text-color': '#333'
        }
      }
    }
  }
}
