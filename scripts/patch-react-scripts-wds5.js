const fs = require('fs');
const path = require('path');

const filePath = path.join(
  process.cwd(),
  'node_modules',
  'react-scripts',
  'config',
  'webpackDevServer.config.js'
);

let src = fs.readFileSync(filePath, 'utf8');

const hasLegacyHooks = src.includes('onAfterSetupMiddleware') || src.includes('onBeforeSetupMiddleware');

const re = /\s*onBeforeSetupMiddleware\(devServer\)\s*\{[\s\S]*?\n\s*\},\s*onAfterSetupMiddleware\(devServer\)\s*\{[\s\S]*?\n\s*\},/m;

if (hasLegacyHooks) {
  if (!re.test(src)) {
    console.log('Legacy dev server hooks detected but expected block not found; skipping hook migration.');
  } else {
    const replacement = `

    setupMiddlewares(middlewares, devServer) {
      // Webpack Dev Server v5 removed onBeforeSetupMiddleware/onAfterSetupMiddleware.
      // Keep CRA behavior by injecting the same middleware via setupMiddlewares.
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Keep evalSourceMapMiddleware before redirectServedPath.
      middlewares.unshift(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(devServer.app);
      }

      // Redirect to PUBLIC_URL or homepage if URL does not match.
      middlewares.push(redirectServedPath(paths.publicUrlOrPath));

      // Reset any service worker registered for the same host:port combination.
      middlewares.push(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

      return middlewares;
    },`;

    src = src.replace(re, replacement);
  }
}

// Webpack Dev Server v5 replaced the `https` option with `server`.
// CRA's `getHttpsConfig()` returns false or an object of TLS options.
if (src.includes('https: getHttpsConfig()')) {
  src = src.replace(
    /\s*https:\s*getHttpsConfig\(\),\s*/m,
    `

    server: (() => {
      const httpsConfig = getHttpsConfig();
      if (!httpsConfig) return undefined;
      return { type: 'https', options: httpsConfig };
    })(),
`
  );
}
fs.writeFileSync(filePath, src, 'utf8');
console.log('Patched react-scripts webpackDevServer.config.js for WDS v5.');
