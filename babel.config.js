const plugins = []

plugins.push(['import', {
  libraryName: 'vant',
  libraryDirectory: 'es',
  style: name => `${name}/style/less`
  // style: true
}, 'vant'])

if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins
}
