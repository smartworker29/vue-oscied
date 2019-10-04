const path = require('path')
const express = require('express')
const url = require('url')
const config = require('./config')
const { createBundleRenderer } = require('vue-server-renderer')

const renderer = createBundleRenderer(require('./dist/vue-ssr-server-bundle.json'), {
  runInNewContext: false,
  template: require('fs').readFileSync('./dist/index.html', 'utf-8'),
  clientManifest: require('./dist/vue-ssr-client-manifest.json')
})
const resolve = file => path.resolve(__dirname, file)

const server = express()

server.use(`/asset`, express.static(resolve('./dist')))

server.get('*', (req, res) => {
  renderer.renderToString({ url: req.url }, (err, html) => {
    if (err) {
      console.log(err, html)
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
    } else {
      res.end(html)
    }
  })
})

const port = process.env.PORT || 8080

server.listen(port, '0.0.0.0', function () {
  console.log(`server started at http://localhost:${port}`)
})
