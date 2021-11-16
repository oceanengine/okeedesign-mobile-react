module.exports = function (api) {
  const { BABEL_MODULE } = process.env
  const useESModules = BABEL_MODULE !== 'commonjs'
  
  api && api.cache(false)
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: useESModules ? false : 'commonjs'
        }
      ],
      '@babel/preset-typescript',
      '@babel/preset-react'
    ],
    plugins: ['transform-class-properties'] 
  }
}
