module.exports={
    devServer:{
        port:9527,
        host:"localhost",
        https:false,
        open:true,
        proxy:{
            [process.env.VUE_APP_BASE_API]:{
                target:process.env.VUE_APP_SERVICE_URL,
                changeOrigin:true,
                pathRewrite:{
                    ['^'+process.env.VUE_APP_BASE_API]:''
                }
            }
        }
    },
    lintOnSave:false,
    productionSourceMap:false
}