// 将js文件打包进html
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const scriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const webpack = require("webpack");
const demoViews = {};
const glob = require('glob');
const path = require('path');
const version = process.env.npm_package_version;
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
            title: '系统首页',
            inject: false,
            version: version,
            // inlineSource: '.(css)$',
            filename: 'views/index.html',
            entry: 'src/views/index/index.js',
            template: 'src/views/index/index.html',
        },
        login: { // 系统登录页
            title: '系统登录',
            inject: false,
            version: version,
            // inlineSource: '.(css)$',
            filename: 'views/login.html',
            entry: 'src/views/login/login.js',
            template: 'src/views/login/login.html',
        },
        403: { // 未授权页面
            title: '无权限',
            inject: false,
            version: version,
            inlineSource: '.(css)$',
            filename: 'views/403.html',
            entry: 'src/views/error/403/403.js',
            template: 'src/views/error/403/403.html',
        },
        404: { // 404页面
            title: '无资源',
            inject: false,
            version: version,
            inlineSource: '.(css)$',
            filename: 'views/404.html',
            entry: 'src/views/error/404/404.js',
            template: 'src/views/error/404/404.html',
        },
        500: { // 异常页面
            title: '异常错误',
            inject: false,
            version: version,
            inlineSource: '.(css)$',
            filename: 'views/500.html',
            entry: 'src/views/error/500/500.js',
            template: 'src/views/error/500/500.html',
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
                    'mockjs': 'Mock',
                    'axios': 'axios',
                    'moment': 'moment',
                    'tinymce/tinymce': 'tinymce',
                    "ant-design-vue": 'antd', // antd类库
                    // "ant-design-vue/lib/style": 'ants'
                },
                // plugins: [
                    // new scriptExtHtmlWebpackPlugin({
                    //     inline: ['403.min.js'],
                    //     custom: [
                    //         {
                    //             test: /.*/,
                    //             attribute: "type",
                    //             value: "text/javascript"
                    //         }, {
                    //             test: /.*/,
                    //             attribute: "th:inline",
                    //             value: "none"
                    //         }
                    //     ]
                    // }),
                    // new scriptExtHtmlWebpackPlugin({
                    //     inline: ['404.min.js'],
                    //     custom: [
                    //         {
                    //             test: /.*/,
                    //             attribute: "type",
                    //             value: "text/javascript"
                    //         }, {
                    //             test: /.*/,
                    //             attribute: "th:inline",
                    //             value: "none"
                    //         }
                    //     ]
                    // }),
                    // new scriptExtHtmlWebpackPlugin({
                    //     inline: ['500.min.js'],
                    //     custom: [
                    //         {
                    //             test: /.*/,
                    //             attribute: "type",
                    //             value: "text/javascript"
                    //         }, {
                    //             test: /.*/,
                    //             attribute: "th:inline",
                    //             value: "none"
                    //         }
                    //     ]
                    // }),
                    // new HtmlWebpackInlineSourcePlugin()
                // ]
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
            for(let item of [403, 404, 500, 'index', 'login', 'ivzone']) {
                config.plugins.delete('preload-'+item);
                config.plugins.delete('prefetch-'+item);
            }
            config.plugins.delete('html-ivzone');
            // config.plugins.delete('html-index');
            // config.plugins.delete('html-login');

            config.optimization.delete('splitChunks');
            // 清除css，js版本号
            config.output.filename('libs/[name].min.js').end();
            config.output.chunkFilename('libs/[name].min.js').end();

            config.plugin('extract-css').tap(args => [{
                filename: `libs/[name].min.css`,
                chunkFilename: `libs/[name].min.css`
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
    transpileDependencies: ['ismobilejs'],
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
