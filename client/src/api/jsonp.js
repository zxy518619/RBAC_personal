import jsonp from 'jsonp'

export function reqWeather(city) {
    const url = `https://www.yiketianqi.com/free/day?appid=65839279&appsecret=htFP7lyP&city=${city}`
    return new Promise((resolve, reject) => {
        jsonp(url, {
            param: "callback"
        }, (error, response) => {
            console.log(response);
            if (!error && response.cityid) {
                const {
                    tem_day,
                    tem_night,
                    wea,
                    wea_img
                } = response
                resolve({
                    tem_day,
                    tem_night,
                    wea,
                    wea_img
                })
            } else {
                alert("获取天气信息失败")
            }
        })
    })
}