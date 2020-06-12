// 定义空数据接收数据
let nowWeather = [];
// 定义value
let iptvalue = "";
// 获取当前时间
let date = new Date().getHours();


$(".delayed-title ul li").on("click",function(){
	let currentindex =  $(this).index();	
	if (currentindex == 0) {
		$(".end").hide();
		$(".start").show();
		$(".time").hide();
		$(".day").show();
	}else {
		$(".start").hide();
		$(".end").show();
		$(".time").show();
		$(".day").hide();
	}
})

// 腾讯地图定位


let licationIP = () =>{
	$.ajax({
		type: 'GET',
		url:'https://apis.map.qq.com/ws/location/v1/ip',
		data:{
			key:'6FYBZ-6PEKP-ILNDN-L4QMC-MBSKO-VUFTF',
			output:'jsonp'
		},
		dataType:'jsonp',
		success:function(result){
			console.log("result ==> ",result);
			console.log(result.result.ad_info.city);
			if (result.result.ad_info.city == "") {
				alert("获取地址失败！您可以尝试搜索");
				return;
			}
			getWeatherBycity(result.result.ad_info.city);
		},
		error:function(err){
			console.log("err ==> ",err);
		}
	})
}

licationIP();




// 获取天气
let getWeatherBycity = (city) =>{
	$.ajax({
		type:'GET',
		url:'https://api.heweather.net/s6/weather/',
		data:{
			now:'?',
			location:city,
			key:'3ef4f76a03854ac49fc086e536f4fb0f'
		},
		success:function(result){
			console.log("result ==>",result);
			nowWeather = result.HeWeather6[0];
			// console.log(nowWeather);
			// console.log(nowWeather.hourly[21]);
			if (nowWeather.status == "unknown location") {
				alert("地址输入错误");
				return;
			}
			ceatWeather();
		},
		error:function(err){
			console.log("err ==>",err);
			$(".weather-box").html("数据获取失败，请重试");
		}
	})
}

// 创建界面
let ceatWeather = () =>{
	setBackround();
	$(".time").hide();
	$(".day").show();
	// 显示地点
	$(".location-text").html(nowWeather.basic.parent_city);
	// 显示当前温度
	$(".du").html(nowWeather.daily_forecast[0].tmp_max  + "°");
	// 获取今日温度
	$(".details").html(nowWeather.daily_forecast[0].cond_txt_n + nowWeather.daily_forecast[0].tmp_min  + "~" + nowWeather.daily_forecast[0].tmp_max);
	// 获取风力级别
	$(".recommend ul li:first span:first").html(nowWeather.daily_forecast[0].wind_sc);
	// 获取风向
	$(".recommend ul li:first span:last").html(nowWeather.daily_forecast[0].wind_dir);
	// 获取可见度
	$(".recommend ul li:nth-child(2) span:first").html(nowWeather.daily_forecast[0].vis);
	// 获取湿度
	$(".recommend ul li:nth-child(3) span:first").html(nowWeather.daily_forecast[0].hum);

	if (date >= 21) {
		date = 21;
	}
	$(".recommend p").html("未来两小时" + nowWeather.hourly[date+2].cond_txt);

	// 显示未来天气开始
	// 逐日显示开始
	for (var i = 0; i < $(".content .day>li").length; i++) {
		for (var j = 0; j < 1; j++) {
			$(".content .day>li").eq(i).children().children().eq(j).html(nowWeather.daily_forecast[i].date.slice(5, 10));
			$(".content .day>li").eq(i).children().children().eq(j + 1).html(nowWeather.daily_forecast[i].cond_txt_d);
			$(".content .day>li").eq(i).children().children().eq(j + 2).html('<img src="images/'+nowWeather.daily_forecast[i].cond_code_d+'.png" alt="">')
			$(".content .day>li").eq(i).children().children().eq(j + 3).html(nowWeather.daily_forecast[i].tmp_max + "°");
		}
	}
	
	// 逐日显示结束
	// 逐时显示开始
	for (var i = 0; i < $(".content .day>li").length; i++) {
		for (var j = 0; j < 1; j++) {
			if (date >= 19) {
				date = 19;
				$(".content .time>li").eq(i).children().children().eq(j).html((date+i) + ":00");
				$(".content .time>li").eq(i).children().children().eq(j + 1).html(nowWeather.hourly[date+i].cond_txt);
				$(".content .time>li").eq(i).children().children().eq(j + 2).html('<img src="images/'+nowWeather.hourly[date+i].cond_code+'.png" alt="">')
				$(".content .time>li").eq(i).children().children().eq(j + 3).html(nowWeather.hourly[date+i].tmp + "°");
			}else {
				$(".content .time>li").eq(i).children().children().eq(j).html((date+i) + ":00");
				$(".content .time>li").eq(i).children().children().eq(j + 1).html(nowWeather.hourly[date+i].cond_txt);
				$(".content .time>li").eq(i).children().children().eq(j + 2).html('<img src="images/'+nowWeather.hourly[date+i].cond_code+'.png" alt="">')
				$(".content .time>li").eq(i).children().children().eq(j + 3).html(nowWeather.hourly[date+i].tmp + "°");
			}
			
		}
	}
	// $(".content .time>li:first ol>li:nth-child(1)").html(date + ":00");
	// $(".content .time>li:first ol>li:nth-child(2)").html(nowWeather.hourly[date].cond_txt);
	// $(".content .time>li:first ol>li:nth-child(3)").html('<img src="images/'+nowWeather.hourly[date].cond_code+'.png" alt="">');
	// $(".content .time>li:first ol>li:nth-child(4)").html(nowWeather.hourly[date].tmp + "°");
	// 逐时显示结束
	// 显示未来天气结束
	


}


// 获取输入框的值

$(".search-ipt").on("keyup",function(){
	iptvalue = "";
	iptvalue = $(this).val();
})

// 点击搜索天气
$(".search-icon").on("click",function(){
	console.log("输入城市：" ,iptvalue);
	getWeatherBycity(iptvalue);
	$(".search-ipt").val("");
})
// console.log($(".search-icon"));
// 
// 键盘确认
$("body").on("keydown",function(e){
	// console.log(e);
	if (e.code == "Enter") {
		console.log("输入城市：" ,iptvalue);
		getWeatherBycity(iptvalue);
		$(".search-ipt").val("");
	}
})


//改变背景
let setBackround = () =>{
	if (date >= 5 && date <= 11) {
		$(".weather-box").addClass("morning");
	}else if(date >11 && date <= 18) {
		$(".weather-box").addClass("afterday");
	}else {
		$(".weather-box").addClass("night");
	}
}

// console.log($("body"));

// let date = new Date().getHours()+2;
// console.log(date);
// console.log($(".content .day li:nth-child(1) ol li:nth-child(1)"));
// for (var i = 0; i < 4; i++) {
// 	for (var j = 0; j < 4; j++) {
// 		console.log($(".content .day>li").eq(i).children().children().eq(j));
// 	}
	
// }

// console.log($(".content .time>li:first ol>li:nth-child(1)"));
// 
// 

