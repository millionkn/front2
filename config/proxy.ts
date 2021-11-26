/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/wshfw2_dev/main/api/': {
      target: 'http://192.168.56.3:3000',
      changeOrigin: true,
      pathRewrite: { '^/wshfw2_dev/main/api': '/api' },
    },
    '/wshfw2_dev/main/socket.io/': {
      target: 'http://192.168.56.3:3000',
      changeOrigin: true,
      ws: true,
      pathRewrite: { '^/wshfw2_dev/main/socket.io': '/socket.io' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};