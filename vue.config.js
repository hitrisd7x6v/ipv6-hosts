// 将js文件打包进html
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const scriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const webpack = require("webpack");
const demoViews = {};
const glob = require('glob');
const path = require('path');
const DEMO_PAGE_PATH = path.resolve(__dirname, 'src/views/demo');
const entryFiles = glob.sync(DEMO_PAGE_PATH + '/*.js')
// 页面js打包路口
if (process.env.NODE_ENV === 'development') {
    entryFiles.forEach((filePath) => {
        // eslint-disable-next-line no-useless-escape
        const filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        demoViews[filename] = {
            filename: 'demo/'+filename+".html",
            entry: 'src/views/demo/'+filename+".js",
            template: 'src/views/demo/'+filename+".html"
        }
    });
}

module.exports = {
    // publicPath: process.env.NODE_ENV === 'production'
    //     ? 'https://www.inebao.cn/app' : 'http://www.inebao.cn/app',
    // build时放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
    // assetsDir: '',
    // 关闭eslint提示
    lintOnSave: false,
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    productionSourceMap: false,
    // 在这个页面中包含的块，默认情况下会包含
    // 提取出来的通用 chunk 和 vendor chunk。
    // chunks: ['chunk-vendors', 'chunk-common', 'index'],
    pages: {
        ...demoViews,
        index: { // 系统首页
            inlineSource: '.(css)$',
            filename: 'views/index.html',
            entry: 'src/views/index/index.js',
            template: 'src/views/index/index.html',
        },
        login: { // 系统首页
            inlineSource: '.(css)$',
            filename: 'views/login.html',
            entry: 'src/views/login/login.js',
            template: 'src/views/login/login.html',
        },
        ivzone: {
            entry: 'src/components/ivzone.js'
        }
    },

    // eslint-disable-next-line no-unused-vars
    configureWebpack: (config)=>{
        if (process.env.NODE_ENV === 'production') {
            return {
                externals: { // 生产环境, 打包时不包含下面的类库, 使用cdn引入
                    'vue': 'Vue',
                    // 'mockjs': 'Mock',
                    // 'axios': 'axios',
                    'moment': 'moment',
                    "ant-design-vue": 'antd', // antd类库
                    // "ant-design-vue/lib/style": 'ants'
                },
                plugins: [
                    new scriptExtHtmlWebpackPlugin({
                        inline: ['index.js', 'index.css'],
                        custom: [
                            {
                                test: /.*/,
                                attribute: "type",
                                value: "text/javascript"
                            }, {
                                test: /.*/,
                                attribute: "th:inline",
                                value: "none"
                            }
                        ]
                    }),
                    new scriptExtHtmlWebpackPlugin({
                        inline: ['login.js', 'login.css'],
                        custom: [
                            {
                                test: /.*/,
                                attribute: "type",
                                value: "text/javascript"
                            }, {
                                test: /.*/,
                                attribute: "th:inline",
                                value: "none"
                            }
                        ]
                    }),
                    new HtmlWebpackInlineSourcePlugin()
                ]
            }
        }
        return {
            resolve: {
                alias: {
                    'vue$': 'vue/dist/vue.esm.js'
                }
            }
        }
    },
    // webpack配置
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.delete('splitChunks')
            // 清除css，js版本号
            config.output.filename('libs/[name].js').end();
            config.output.chunkFilename('libs/[name].js').end();
            // 为生产环境修改配置...
            config.plugin('extract-css').tap(args => [{
                filename: `libs/[name].css`,
                chunkFilename: `libs/[name].css`
            }])
            config.plugin("ignore").use(
                    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
                );

        }
    },

    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    devServer: {
        port: '8080',
        https: false,
        host: 'localhost',
        disableHostCheck: true,
        // proxy: {
        //     '/': {
        //         target: 'http://www.inebao.cn', //后台接口
        //         changeOrigin: true,
        //         ws: true,
        //         pathRewrite: {
        //             '^/': '/'
        //         }
        //     }
        // }
    }
}
