const path = require('path');
const dotenv = require('dotenv');
dotenv.configDotenv();

const devMode = process.env.NODE_ENV === 'development';
const isProduction = !devMode;
const outputPath = path.resolve(__dirname, isProduction ? '../server/public' : 'dist');
const SERVER = process.env.SERVER;
const publicPath = isProduction ? 'https://erikvullings.github.io/memory-trainer/' : '/';

console.log(
  `Running in ${
    isProduction ? 'production' : 'development'
  } mode, serving from ${SERVER} and public path ${publicPath}, output directed to ${outputPath}.`
);

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: './src/app.ts',
  },
  devServer: {
    port: 3399,
  },
  builtins: {
    define: {
      // 'process.env.NODE_ENV': "'development'",
      'process.env.SERVER': "'http://localhost:4545'",
      // 'process.env.SERVER': devMode ? "'http://localhost:4545'" : SERVER,
    },
    html: [
      {
        title: 'Memory Trainer',
        publicPath,
        scriptLoading: 'defer',
        minify: !devMode,
        favicon: 'favicon.ico',
        meta: {
          viewport: 'width=device-width, initial-scale=1',
          'og:title': 'Memory Trainer',
          'og:description': 'Train your memory, quickly and effectively!',
          'og:url': SERVER,
          'og:site_name': 'Memory Trainer',
          'og:image:alt': 'Memory Trainer',
          'og:image': './src/assets/logo.svg',
          'og:image:type': 'image/svg',
          'og:image:width': '200',
          'og:image:height': '200',
        },
      },
    ],
    minifyOptions: devMode
      ? undefined
      : {
          passes: 3,
          dropConsole: false,
        },
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /^BUILD_ID$/,
        type: 'asset/source',
      },
      // {
      //   test: /\.less$/,
      //   use: [
      //     {
      //       loader: 'less-loader',
      //       options: {
      //         lessOptions: {
      //           modifyVars: {
      //             // Options
      //           },
      //           javascriptEnabled: true,
      //         },
      //       },
      //     },
      //   ],
      //   type: 'css', // This is must, which tells rspack this is type of css resources
      // },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                modifyVars: {
                  // Options
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
        type: 'css', // This is must, which tells rspack this is type of css resources
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: outputPath,
  },
};
