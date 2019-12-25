module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // 转换的基准值，以设计稿为准
      // 375: 37.5
      // 750: 75
      // Vant 组件的样式是以 375 设计稿开发的
      // 我们的设计稿
      //    375，量多少，写多少
      //    750，量出来的尺寸 ÷ 2
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
