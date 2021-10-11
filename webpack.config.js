const path = require( 'path' );
require( 'dotenv' ).config( { path: './.env' } ); 
const webpack = require('webpack')

module.exports = {
    entry: path.resolve( __dirname, './src/index.js' ),
    module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
    plugins: [
        new webpack.DefinePlugin({
  "process.env": JSON.stringify(process.env)
}),
    ],
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  devServer: {
    static: path.resolve(__dirname, './dist')
  }
};
