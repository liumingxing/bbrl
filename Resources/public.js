///////////////////////共用函数////////////////////////////////////

function logEvent(event, params){
	Ti.App.fireEvent("flurry_event", {event: event, params: params});
}

//判断是否登陆
function check_login() {
	if(Ti.App.Properties.getString("email", "").length > 0)
		return true;
	else
		return false;
}

function emoji_name(){
	return "";
}

//清除窗体上的所有子窗体
function clear_window(win){
	if (!win)
		return;
	Ti.API.log("clear_window " + win);
	
	if (win.actionbar)
		win.actionbar = null;
	
	//scrollableviews
	if (win.views && win.views.length > 0){
		for(var i=win.views.length-1; i>=0; i--){
			clear_window(win.views[i])
		}
		win = null;
		return;
	}
	
	//window or view
	if (win.children){		
		for(var i=win.children.length-1; i>=0; i--){
			var t = win.children[i]
			if (t)
				win.remove(t)
		}
	}
}

//判断2012－1－2这样的字符串是否是今天
function is_today(today_str){
	var now = new Date;
	if (now.getFullYear() != parseInt(today_str.split("-")[0])){
		return false;
	}
	
	if (now.getMonth() != parseInt(today_str.split("-")[1], 10) - 1){
		return false;
	}
	
	if (now.getDate() != parseInt(today_str.split("-")[2], 10)){
		return false;
	}
	
	return true;
}

//将2012-01-01这样的日期转换成2012-1-1的格式
function human_date(today_str){
	var ts = today_str.split('-')
	var year = ts[0]
	var month = parseInt(ts[1], 10)
	var date = parseInt(ts[2], 10)
	
	return year + "-" + month + '-' + date
}

//转到登录界面
function to_login(){
	show_window('login', {title: '请登录'});
}
//获取当前用户登录userid
function user_id(){
	return Ti.App.Properties.getString("userid", "")
}

//获取当前用户信息json
function user_json(){
	var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id())	
	if (!record.blank){
		return JSON.parse(record.json)
	}
	else{
		return false;
	}
}

function account_str(){
	var str = "";
	if (!check_login()){
		str += "login=false";
		return str;
	}
		
	if (Ti.App.Properties.getString("token_type", "") == "sina"){
		str = "username=" + Ti.App.Properties.getString("email", "") + "&password=" + Ti.App.Properties.getString("password", "") + "&token=" + Ti.App.Properties.getString("token", "") + "&secret=" + Ti.App.Properties.getString("secret", "") + "&token_type=" + Ti.App.Properties.getString("token_type", "");
	}	
	else if (Ti.App.Properties.getString("token_type", "") == "tencent"){
		str = "username=" + Ti.App.Properties.getString("email", "") + "&password=" + Ti.App.Properties.getString("password", "") + "&token=" + Ti.App.Properties.getString("tencent_token", "") + "&secret=" + Ti.App.Properties.getString("tencent_secret", "") + "&token_type=" + Ti.App.Properties.getString("token_type", "");
	}
	else if (Ti.App.Properties.getString("token_type", "") == "taobao"){
		str = "username=" + Ti.App.Properties.getString("email", "") + "&password=" + Ti.App.Properties.getString("password", "") + "&token=" + Ti.App.Properties.getString("taobao_token", "") + "&secret=" + Ti.App.Properties.getString("taobao_secret", "") + "&token_type=" + Ti.App.Properties.getString("token_type", "");
	}
	else if (Ti.App.Properties.getString("token_type", "") == "qzone"){
		str = "username=" + Ti.App.Properties.getString("email", "") + "&password=" + Ti.App.Properties.getString("password", "") + "&token=" + Ti.App.Properties.getString("qzone_token", "") + "&secret=" + Ti.App.Properties.getString("qzone_secret", "") + "&token_type=" + Ti.App.Properties.getString("token_type", "");
	}
	else if (Ti.App.Properties.getString("token_type", "") == "weixin"){
		str = "username=" + Ti.App.Properties.getString("email", "") + "&password=" + Ti.App.Properties.getString("password", "") + "&token=" + Ti.App.Properties.getString("weixin_token", "") + "&secret=" + Ti.App.Properties.getString("weixin_secret", "") + "&token_type=" + Ti.App.Properties.getString("token_type", "");
	}
	else{
		str = "username=" + Ti.App.Properties.getString("email", "") + "&password=" + Ti.App.Properties.getString("password", "") + "&token=" + Ti.App.Properties.getString("token", "") + "&secret=" + Ti.App.Properties.getString("secret", "") + "&token_type=" + Ti.App.Properties.getString("token_type", "");
	}
	return decodeURI(str);
}

//显示正在加载
function show_loading(tip) {
	Titanium.App.fireEvent('show_indicator', {tip : tip});
}

//获得tableview的总行数
function get_row_count(tableview) {
	var total = 0;
	for(var i = 0; i < tableview.data.length; i++) {
		total = total + tableview.data[i].rowCount;
	}
	return total;
}

//关闭正在加载
function hide_loading() {
	Titanium.App.fireEvent('hide_indicator');
}

//显示提示信息
function show_notice(notice) {
	Titanium.App.fireEvent('show_notice', {
		notice : notice
	});
}

//将date类型转换为2012-01-23的字符串
function date_str(date){
	var year = date.getFullYear()
	var month = (date.getMonth()<9) ? ("0" + (date.getMonth()+1)) : (date.getMonth()+1)
	var day = (date.getDate()<10) ? ("0" + date.getDate()) : date.getDate()
	return year + "-" + month +  "-" +  day
}

function datetime_str(date){
	var hour = date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours();
	var minute = date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes();
	var second = date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds();
	
	return date_str(date) + ' ' + hour + ":" + minute + ":" + second
}

//将日期转换成 2011-1-2日这样的字符串
function formatDate(str) {
	return str.substr(2, 8)
}

function date_from_str(date_str){
	var t = new Date();
	var t2 = date_str.split('-');
	t.setFullYear(parseInt(t2[0], 10), parseInt(t2[1], 10)-1, parseInt(t2[2], 10));
	
	return t;
}

//将日期转换成 2011年1月这样的字符串
function referMonth(str){
	if (typeof(str) == "undefined")
		return "";
		
	var datetime = str.substr(0, 19).replace("T", " ")
	var now = new Date().getTime();

	var t1 = datetime.split(" ");
	var t2 = t1[0].split('-');
	
	var t = new Date();
	t.setFullYear(t2[0], parseInt(t2[1], 10)-1, parseInt(t2[2], 10));
	
	return t.getFullYear() + "年" + (t.getMonth() + 1) + "月"
}

//将日期转换成 2011年1月2日这样的字符串
function referDay(str){
	if (typeof(str) == "undefined")
		return "";
		
	var datetime = str.substr(0, 19).replace("T", " ")
	var now = new Date().getTime();

	var t1 = datetime.split(" ");
	var t2 = t1[0].split('-');
	
	var t = new Date();
	t.setFullYear(t2[0], parseInt(t2[1], 10) - 1, parseInt(t2[2]));
	
	return t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日"
}

function referMinute(str){
	if (typeof(str) == "undefined")
		return "";

	var datetime = str.substr(0, 19).replace("T", " ");
	var now = new Date().getTime();

	var t1 = datetime.split(" ");
	var t2 = t1[0].split('-');
	var t3 = t1[1].split(':');

	var t = new Date();
	t.setFullYear(t2[0]);
	t.setMonth(parseInt(t2[1], 10) - 1);
	t.setDate(t2[2]);
	t.setHours(t3[0]);
	t.setMinutes(t3[1]);
	t.setSeconds(t3[2]);
	
	var diff = 1000*3600*8;
	if (str.indexOf("+08:00")>0){
		diff = 0;
	}
	var minutes = parseInt((now - t.getTime() - diff) / (1000 * 60));		//中国偏离8个小时的时差
	var hour = parseInt(minutes / 60);
	var day = parseInt(hour / 24);
	
	if (t.getHours() == 0 && t.getMinutes() == 0 && t.getSeconds() == 0){
		if (day < 30){
			return "补记" + (t.getMonth()+1) + "月" + t.getDate() + "日";
		}
		else{
			return "补记" + t.getFullYear() + "年" + (t.getMonth()+1) + "月" + t.getDate() + "日";
		}
	}
	
	if (day == 0){
		if (hour == 0){
			if (minutes<3){
				return "刚刚";
			}
			else{
				return minutes + "分钟前";
			}
		}
		else{
			return hour + "小时前";
		}
	}
	else if (day == 1){
		return "昨天" + (t.getHours() < 10 ? "0" + t.getHours() : t.getHours()) + ":" + (t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes());
	}
	else if (day < 30){
		return (t.getMonth()+1) + "月" + t.getDate() + "日 " + (t.getHours() < 10 ? "0" + t.getHours() : t.getHours()) + ":" + (t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes());
	}
	
	return t.getFullYear() + "年" + (t.getMonth()+1) + "月" + t.getDate() + "日 " + (t.getHours() < 10 ? "0" + t.getHours() : t.getHours()) + ":" + (t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes());
}

//将日期转换成 2011-1-2日这样的字符串
function referTime(str) {
	if (typeof(str) == "undefined")
		return "";

	var datetime = str.substr(0, 19).replace("T", " ")
	var now = new Date().getTime();

	var t1 = datetime.split(" ");
	var t2 = t1[0].split('-');
	var t3 = t1[1].split(':');

	var t = new Date();
	t.setFullYear(t2[0]);
	t.setMonth(parseInt(t2[1], 10) - 1);
	t.setDate(parseInt(t2[2], 10));
	t.setHours(parseInt(t3[0], 10));
	t.setMinutes(parseInt(t3[1], 10));
	t.setSeconds(parseInt(t3[2], 10));
	//var minutes = parseInt((now - t.getTime()) / (1000 * 60));
	var diff = 1000*3600*8;
	if (str.indexOf("+08:00")>0){
		diff = 0;
	}
	var minutes = parseInt((now - t.getTime() - diff) / (1000 * 60));		//中国偏离10个小时的时差
	var hour = parseInt(minutes / 60);
	var day = parseInt(hour / 24);
	if(minutes <= 0) {
		return "刚刚";
	} else if(minutes < 60) {
		return minutes + "分钟前";
	} else if(hour < 24) {
		return hour + "小时前";
	} else if(day < 3) {
		return day + "天前";
	} else {
		return t1[0]
	}
}

//孩子描述，比如瞄瞄4岁3个月
function kid_desc(json, today_str) {
	if (!json)
		return "";
	var str = "";
	if (json.name && json.name.length > 0)
		str += json.name
	else
		str += "宝宝"
	if (json.birthday && json.birthday.length > 0)
		str += detail_age_for_birthday(json.birthday, today_str.substr(0, 10));
	
	return str;
}

//生日的人性化描述
function detail_age_for_birthday(birthday_str, today_str) {
	if (!birthday_str)
			return "";
		var motn_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		
		var today = new Date();
		
		if(today_str) {
			var ss = today_str.split("-");
			today.setFullYear(parseInt(ss[0]), parseInt(ss[1], 10)-1, parseInt(ss[2], 10));
		}
		if (today.getFullYear() % 4 == 0){
			motn_days[1] = 29;
		}
		
		var t = new Date();
		var ss = birthday_str.split("-");
		t.setFullYear(parseInt(ss[0]), parseInt(ss[1], 10)-1, parseInt(ss[2], 10));
		
		var diff_days = parseInt((today.getTime() - t.getTime()) / (1000 * 3600 * 24));
		
		if(diff_days < 0) {
			t.setTime(t.getTime() - 280 * 1000 * 3600 * 24);
		}
		
		var months = today.getMonth() - t.getMonth();
		var years = today.getFullYear() - t.getFullYear();
		var days = today.getDate() - t.getDate();
		
		if(today.getTime() >= t.getTime() - 280 * 24 * 3600 * 1000) {
			if(months < 0) {
				years -= 1
				months = 12 + months
			}
	
			if(days < 0) {
				months -= 1
				if (diff_days < 0)
					days = motn_days[t.getMonth()] + days;
				else{
					if (today.getMonth() >= 1)
						days = motn_days[today.getMonth()-1] + days;
					else
						days = motn_days[11] + days;
				}
					
			}
			
			if(months < 0) {
				years -= 1
				months = 12 + months
			}
					
			if(diff_days < 0 && diff_days >= -280) {
				var weeks = parseInt((280+diff_days) / 7);
				var days = parseInt((280+diff_days) % 7);
				var str = '孕';
				if (weeks > 0)
					str += weeks + "周"
				
				if (days > 0)
					str += days + "天"
				
				if (weeks ==0 && days==0){
					return "种子播下了"
				}
				return str;
				//return "孕" + months + "个月" + days + "天";
			}
			else if (diff_days < -280){
				return "备孕期"
			}
			else {
				if (years == 0 && months == 0 && days == 0){
					return "出生啦"
				}	
				
				var str = ''
				if(years > 0)
					str += years + "岁"
				if(months > 0)
					str += months + "个月"
				if(days > 0)
					str += days + "天"
				
				return str;
			}
		} else
			return "未填写"
}

function get_kid_json(){
	var kid_json = null;
	var current_kid_id = Ti.App.Properties.getString("current_kid_id", "");
	var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id());
	if (!record.blank) {
		var json = JSON.parse(record.json)
		if (json.user_kids.length > 0) {
			kid_json = json.user_kids[0]
	
			if (current_kid_id != "") {
				for (var i = 0; i < json.user_kids.length; i++) {
					if (json.user_kids[i].id == parseInt(current_kid_id)) {
						kid_json = json.user_kids[i]
					}
				}
			}
		}
	}
	
	return kid_json;
}

function http_call(url, load_callback, error_callback){
	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = Ti.App.timeout;
	xhr.onerror = function() {
		if (error_callback)
			error_callback(this);
		else
			show_timeout_dlg(xhr, url);
	};
	xhr.onload = function() {
		if (load_callback)
			load_callback(this);
	};
	
	if (url.indexOf(Ti.App.mamashai) == 0){
		var append = "osname="+Ti.App.osname+"&osversion="+Ti.App.osversion+"&appversion="+Ti.App.version+"&manufacturer="+Ti.App.manufacturer+"&model="+Ti.App.model+"&memory="+Ti.Platform.availableMemory;
		url += url.indexOf("?") > 0 ? "&" + append : "?" + append;
	}	
	
	xhr.open('GET', url);
	xhr.send();
}

function cache_http_call(url, tag, loading_callback, error_callback){
	var record = require('/lib/mamashai_db').db.select_with_check(tag, 0);
	if (record.blank){
		http_call(url, function(e){
			loading_callback(e);
			require('/lib/mamashai_db').db.insert_json(tag, 0, e.responseText);
		}, error_callback);
	}
	else{
		loading_callback({responseText: record.json});
	}
	return;
}

function add_android_scroll_ind(scroller, width){
	if (!Ti.App.is_android)
		return;
		
	scroller.showPagingControl = false;
	
	if (scroller.views.length == 1)
		return;
		
	if (scroller.ind_wrapper){
		scroller.remove(scroller.ind_wrapper);
	}
	
	var wrapper = Ti.UI.createView({
		bottom: __l(0),
		left: 0,
		right: 0,
		width: width,
		height: __l(20)
	});
	scroller.add(wrapper);
		
	var inds = [];
	for(var i=0; i<scroller.views.length; i++){
		var w = Ti.UI.createView({
			height: __l(8),
			width: __l(8),
			borderRadius: __l(4),
			backgroundColor: 'white',
			opacity: 0.4,
			bottom: __l(8),
			left: __l(20)*i + Ti.App.platform_width/2 - __l(20)*scroller.views.length/2 + __l(10)
		});
		wrapper.add(w);
		inds.push(w);
	}
	inds[scroller.currentPage].opacity = 0.9;
	scroller.inds = inds;
	scroller.addEventListener("scrollend", function(e){
		for(var i=0; i<e.source.inds.length; i++){
			e.source.inds[i].opacity = 0.4;
		}
		e.source.inds[e.currentPage].opacity = 0.9;
	});
	scroller.ind_wrapper = wrapper;
}

function galary_browse(arr, index){
	var w = Titanium.UI.createWindow({
		backgroundColor : '#fff',
		navBarHidden: Ti.App.is_android ? true : false,
		theme: "NoActionBar"
	});
	pre(w);
	var pic_arr = [];
	var scrollView = Titanium.UI.createScrollableView({
		showPagingControl : arr.length > 1 ? true: false,
		top: 0, 
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'black',
		pics: []
	});
	for(var i=0; i<arr.length; i++){
		var wrapper = null;
		if (Ti.App.is_android) {
			wrapper = Titanium.UI.createView({
				top : 0,
				left : 0,
				right : 0,
				bottom : 0,
				backgroundColor : 'black'
			});
		} else {
			wrapper = Titanium.UI.createScrollView({
				//contentWidth : 'auto',
				contentWidth: Ti.App.platform_width,
				contentHeight : 'auto',
				top : 0,
				bottom : 0,
				left : 0,
				right : 0,
				zIndex : 1,
	
				backgroundColor : 'black',
	
				showVerticalScrollIndicator : false,
				showHorizontalScrollIndicator : false,
				maxZoomScale : 4,
				minZoomScale : 1
			});
			wrapper.addEventListener("click", function(e){
				w.close();
			});
		}
		var pic = Ti.UI.createImageView({
			image : arr[i],
			width: Ti.UI.FILL,
			wrapper: wrapper
		});
		
		scrollView.pics.push(pic);
		if (Ti.App.is_android){
			pic.width = Ti.App.platform_width;
			if (arr.length == 1 && i== 0){
				pic.addEventListener("load", function(e){
					var PhotoMod = require('tjatse.photo');
					var PhotoView = PhotoMod.createPhotoView({
						scaleType: 'CENTER',
						imageView: e.source,
						maxZoomValue: 5,
						minZoomValue: 1,
					});
					PhotoView.pinchable();
				});
			}
		}	
			
		pic.addEventListener("click", function(e){
			w.close();
		});
		
		var actInd = Titanium.UI.createActivityIndicator({
			top : Ti.App.platform_height / 2 - __l(15),
			height : __l(30),
			width : __l(30)
		});

		if (Ti.App.is_android){
			 actInd.style = Titanium.UI.ActivityIndicatorStyle.BIG_DARK;
		}	

		wrapper.add(actInd);
		pic.actInd = actInd;
		actInd.show();
		
		pic.opacity = 0;
		pic.addEventListener("load", function(e){
			e.source.opacity = 0;
			e.source.animate({opacity: 1, duration: 800});
			e.source.actInd.hide();
		});
		
		wrapper.add(pic);
		scrollView.addView(wrapper);
	}
	
	scrollView.scrollToView(index);
	add_android_scroll_ind(scrollView, Ti.App.platform_width);
	w.add(scrollView);
	/*
	var save = Ti.UI.createButton({
			title: '保存',
			height: __l(30),
			width: __l(70),
			top: __l(10),
			right: __l(10),
			font: {fontSize: __l(13)},
			opacity: 0.7
	});
	save.addEventListener("click", function(e){
			var current_image = arr[scrollView.currentPage];
			http_call(current_image, function(e){
				hide_loading();
				if (Ti.App.is_android){
					var paths = current_image.split('/');
					var f = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, paths[paths.length - 1]);
					f.write(e.responseData);
					Ti.Media.Android.scanMediaFiles([f.nativePath], null, function(e) {
					});
					show_notice("保存到相册成功");
				}
				else{
					Titanium.Media.saveToPhotoGallery(e.responseData, {
						success : function(e) {
							show_alert("保存到相册成功");
						},
						error : function(e) {
							show_alert("保存到相册发生错误");
						}
					});
				}
				
			}, function(e){
				show_notice("下载图片失败");
			});
			show_loading("正在下载");
	});
	pre_btn(save);
	w.add(save);
	*/
	w.fullscreen = true;
	w.open();
	
	logEvent('show_picture');
}

function show_window(file, attr){
	if (!attr)
		attr = {};
	
	var win = null;
	if (file.indexOf(".js") > 0){
		win = Titanium.UI.createWindow(attr);
		win.url = file;
	}
	else{
		var NewWin = require(file);
		win = new NewWin(attr);
	}
	
	win.backButtonTitle = "";
	win.backgroundColor = "white";
			
	pre(win);
			
	if (!Ti.App.is_android) {
		win.hideTabBar();
	}
	Ti.App.currentTabGroup.activeTab.open(win, {
		animated : true
	});
	return win;
}

function select_video(win, callback, cancel_callback){
	if (Titanium.Network.networkTypeName != "WIFI"){
		show_alert("提示", "亲，您提交的视频将会消耗大量网络带宽。请切换到WIFI网络后再尝试。");
		if (cancel_callback)
			cancel_callback()
		return;
	}
	if (Ti.App.is_android){
		var intent = Ti.Android.createIntent({
		        action: Ti.Android.ACTION_PICK,
		        type: "video/*"
		    });
		intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
		 
		win.activity.startActivityForResult(intent, function(e) {
		    if(e.error) {
		        show_alert("提示", "请选择视频文件！")
		    }else{
		        if(e.resultCode === Titanium.Android.RESULT_OK) {
		            var videoUri = e.intent.data;
		 
		            // --> You can save video file to app data directory
		            var source = Ti.Filesystem.getFile(videoUri);
		            var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, source.name);
	            	source.copy(f.nativePath);
		            
		            // --> You can use video in a videoPlayer
		            var closePlayerBtn = Ti.UI.createButton({
		                title : " 取消 ",
		                height : __l(40),
		                width : __l(100),
		                top : __l(15),
		                left: __l(20)
		            });
		            pre_btn(closePlayerBtn)
		 
		 			var selectPlayerBtn = Ti.UI.createButton({
		                title : " 选择 ",
		                height : __l(40),
		                width : __l(100),
		                top : __l(15),
		                right: __l(20)
		            });
		            pre_btn(selectPlayerBtn)
		            
		            var videoPlayer = Titanium.Media.createVideoPlayer({
		                url : videoUri,
		                backgroundColor : "#000",
		                movieControlMode : Titanium.Media.VIDEO_CONTROL_DEFAULT,
		                scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
		                fullscreen : true,
		                autoplay : true    
		            });
		 
		            videoPlayer.add(closePlayerBtn);
		            videoPlayer.add(selectPlayerBtn);
		 
		            closePlayerBtn.addEventListener("click", function(){
		                videoPlayer.hide();
		                videoPlayer.release();
		                videoPlayer = null;
		            });
		            
		            selectPlayerBtn.addEventListener("click", function(){
		                videoPlayer.hide();
		                videoPlayer.release();
		                videoPlayer = null;
		                var blob = f.read();
		            	callback(blob, videoUri)
		            });
		        }else{
		            //show_alert("提示", "加载视频出现错误！")
		        };
		    };
		});
	}
	else{
		Titanium.Media.openPhotoGallery({
			cancel: function(){
				if (cancel_callback)
					cancel_callback();
			},
			success: function(event){
				if(event.mediaType != Ti.Media.MEDIA_TYPE_VIDEO){
					show_alert("提示", "请选择一个视频");
					return;
				}
				else
					callback(event.media, null)
			},
			error: function(e) {
				show_alert(title, e)
			},
			mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO]
		})
	}
	
	return;
}

//打开摄像头拍照，强行剪裁为960*640或640*960
function show_camera(allow_edit, callback, cancel_callback){
	Titanium.Media.showCamera({
				cancel: function(){
					if (cancel_callback)
						cancel_callback();
				},
				success:function(event)
				{	
					var cropRect = event.cropRect;
					var image = event.media;
					
					if (image.length == 0){
						show_alert("发生了错误", "无法识别图片格式")
						if (cancel_callback)
							cancel_callback();
							
						return;
					}
					
					if (Ti.App.is_android){			//iphone交给第三方库处理
						if (allow_edit){			//抽取出中间的方图
							var imagefactory = require('ti.imagefactory');
							var size = image.width;
							if (image.height < image.width)
								size = image.height;
							image = imagefactory.imageAsThumbnail(image, {size: size})
							image = imagefactory.imageAsResized(image, { width:600, height:600 });
							callback(image, null)
						}
						else{
							var file_o = Ti.Filesystem.getFile(image.nativePath);
							var timer = new Date().getTime();
							var file_path = Ti.Filesystem.applicationDataDirectory + timer + ".png";
							var result = file_o.copy(file_path);
							if (!result){
								show_alert("提示", "打开图片失败");
								return;
							}
							var imagefactory = require('fh.imagefactory');
							image = imagefactory.rotateResizeImage(file_path, 800, 60);
							file = Ti.Filesystem.getFile(file_path);
							var blob = file.read();
							callback(blob, null, blob.width, blob.height);
							return;
						}
					}
					else{							//iphone不处理
						image = Ti.App.ImageFactory.compress(image, 0.5);
						callback(image, null);
					}
				},
				allowEditing: allow_edit,
				saveToPhotoGallery:true,
				mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
			});
}

function select_photo(allow_edit, callback, cancel_callback){
	Titanium.Media.openPhotoGallery({
				cancel: function(){
					if (cancel_callback)
						cancel_callback();
				},
				success: function(event) {
					var cropRect = event.cropRect;
					var image = event.media;
					
					if (image.length == 0){
						show_alert("发生了错误", "无法识别图片格式")
						if (cancel_callback)
							cancel_callback();
							
						return;
					}
					
					if (Ti.App.is_android){			//iphone交给第三方库处理
						if (allow_edit){			//抽取出中间的方图
							var file_o = Ti.Filesystem.getFile(image.nativePath);
							var timer = new Date().getTime();
							var file_path = Ti.Filesystem.applicationDataDirectory + timer + ".png";
							var result = file_o.copy(file_path);
							if (!result){
								show_alert("提示", "打开图片失败");
								return;
							}
							var imagefactory = require('fh.imagefactory');
							image = imagefactory.rotateResizeImage(file_path, 800, 60);
							file = Ti.Filesystem.getFile(file_path);
							var image = file.read();
							
							
							var imagefactory = require('ti.imagefactory');
							var size = image.width;
							if (image.height < image.width)
								size = image.height;
							image = imagefactory.imageAsThumbnail(image, {size: size})
							image = imagefactory.imageAsResized(image, { width:600, height:600 });
							
							callback(image, null)
						}
						else{
							var file_o = Ti.Filesystem.getFile(image.nativePath);
							var timer = new Date().getTime();
							var file_path = Ti.Filesystem.applicationDataDirectory + timer + ".png";
							var result = file_o.copy(file_path);
							if (!result){
								show_alert("提示", "打开图片失败");
								return;
							}
							var imagefactory = require('fh.imagefactory');
							image = imagefactory.rotateResizeImage(file_path, 1024, 100);
							file = Ti.Filesystem.getFile(file_path);
							var blob = file.read();
							blob = Ti.App.ImageFactory.compress(blob, 0.8);
							callback(blob, null, blob.width, blob.height);
							return;
						}
					}
					else{							//ios平台
						//callback(image, null)
						if (allow_edit){			//抽取出中间的方图
							var size = image.width;
							if (image.height < image.width)
								size = image.height;
							image = Ti.App.ImageFactory.imageAsThumbnail(image, {size: size});
							image = Ti.App.ImageFactory.imageAsResized(image, { width:600, height:600 });
							image = Ti.App.ImageFactory.compress(image, 0.6);
							callback(image, null);
						}
						else{
							var len = 1024;
							if (image.height >= image.width && image.width > len){
								var new_width = len;
								var new_height = len*image.height/image.width;
								image = Ti.App.ImageFactory.imageAsResized(image, {width: new_width, height: new_height});
							}
							else if (image.width > image.height && image.height > len){
								var new_height = len;
								var new_width = len*image.width/image.height;
								image = Ti.App.ImageFactory.imageAsResized(image, {width: new_width, height: new_height});
							}
							
							image = Ti.App.ImageFactory.compress(image, 0.5);
							
							callback(image, null);
						}
					}
				},
				error: function(e) {
					show_alert(title, e);
				},
				allowEditing: allow_edit
			});
}

//弹出选择照片或拍摄照片的option dialog，callback传入image,path两个参数
function select_image(allow_edit, callback, cancel_callback){
	var manu = Titanium.Platform.manufacturer.toLowerCase();
	if (manu.indexOf('samsung') != -1){		//三星有些机型拍照就崩溃
		select_photo(allow_edit, callback, cancel_callback);
		return;
	}
							
	//非三星						
	var optionsDialogOpts = {
		options:['拍摄照片', '选择图片', '取消'],
		cancel:2
	};
	
	var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
	dialog.addEventListener('click',function(e)
	{
		if (e.index == 0){		//拍摄照片
			show_camera(allow_edit, callback, cancel_callback)
		}
		else if (e.index == 1){
			select_photo(allow_edit, callback, cancel_callback)
		}
		else if (e.index == 2){
			if (cancel_callback){
				cancel_callback();
			}
		}
	})
	dialog.show();
}

//alert对话框的封装
function show_alert(title, message) {
	Titanium.UI.createAlertDialog({
		message : message,
		title : title,
		buttonNames : ["确定"]
	}).show();
}

//创建超时对话框
function show_timeout_dlg(xhr, url) {
	if (Ti.App.is_android)
		return;
		
	var a = Titanium.UI.createAlertDialog({
		title : '提示',
		message : '获取数据超时'
	});
	a.addEventListener("click", function(e) {
		if(e.index == 0) {//重试
			xhr.open('GET', url);
			xhr.send();
		} else {//取消
			Titanium.App.fireEvent('hide_indicator');
		}
	})
	a.buttonNames = ['重试', '取消'];
	a.show();
}

//获得未读信息数量，并存入json中
function get_mentions(){
	if (check_login()){
		var xhr = Ti.Network.createHTTPClient()
		xhr.timeout = Ti.App.timeout
		xhr.onerror = function(){
		}
		xhr.onload = function(){
				require('lib/mamashai_db').db.insert_json("mention", 0, this.responseText);
				Ti.API.log(this.responseText)
				Ti.App.fireEvent("get_mention");
		}
		
		xhr.open('GET', Ti.App.mamashai + "/api/statuses/unread.json?sid=" + Ti.Platform.id + "&" + account_str());
		xhr.send();
	}
	else{
		require('/lib/mamashai_db').db.delete_one_json("mention", 0)
		Ti.App.fireEvent("get_mention");
	}
	
}

/////
function __l(x){
	if (Ti.App.is_android){
		if (Ti.App.platform_height/Ti.App.logicalDensityFactor > 800)
			return x * Ti.App.logicalDensityFactor * 1.4;
		else
			return x * Ti.App.logicalDensityFactor;
		
		//return parseInt(Ti.App.platform_width*x/(Ti.App.logicalDensityFactor == 1 ? 360 : 320));
	}
	
	if (!Ti.App.is_android && !Ti.App.is_ipad && Ti.App.platform_width > 320){
		return parseInt(375.0*x/320);
	}
	
	return Ti.App.is_ipad ? 1.5*x : x;
	
	/*
	if (Ti.App.is_android && Ti.App.platform_width > 320 && Ti.App.platform_width <=400){
		return parseInt(1.1*x);
	}
	if (Ti.App.is_android && Ti.App.platform_width >=480){
		return parseInt(1.5*x);
	}
	return Ti.App.is_ipad ? 2*x : x
	*/
}

function __m(x){
	if (Ti.App.is_android && Ti.App.platform_width >=480){
		return parseInt(1.5*x);
	}
	
	if (Ti.App.is_android){
		return x;
	}
	
	return Ti.App.is_ipad ? 1.5*x : x
}

//对窗体进行预处理
function pre(window){
	//安卓系统隐藏标题条
	if (Ti.App.is_android)
	{
		if (Ti.Platform.Android.API_LEVEL < 11)
			window.setNavBarHidden(true);
		
		if (!window.activity)
			window.close();
				
		window.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE;
		//window.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN
		//window.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_UNSPECIFIED
	}	
}

//对按钮进行预处理
function pre_btn(button){
	button.borderWidth = 0;
	button.borderRadius = __l(2);
	button.color = Ti.App.bar_color;
	button.selectedColor = Ti.App.bar_color;
	//button.backgroundColor = "#F2F1EE";
	button.backgroundImage = '/images/bj.png';
	button.backgroundSelectedImage = "/images/bj2.png";
}

function group_tableview(tableview){
	if (Ti.App.is_android){
		//tableview.borderRadius = 6;
		//tableview.left = 10;
		//tableview.right = 10;
		tableview.separatorColor = "#ccc";
		//if (!tableview.top || tableview.top == 0)
		//	tableview.top = 10;
		tableview.borderWidth = 1;
		tableview.borderColor = "#ccc";
		if (!tableview.top)
			tableview.top = 0;
		
		if (!tableview.height)
			tableview.height = Ti.UI.SIZE;
	}
}

function add_action_bar(win, actionbar){
	if (!Ti.App.is_android)
		return;
	
	if (win.has_actionbar && !win.actionbar){
			win.has_actionbar = true;
			win.actionbar = actionbar;	
			for(var i=0; i<win._children.length; i++){
				var child = win._children[i];
				if (child.top || child.top == 0)
					child.top = child.top + __l(44);
			}
			win.add(actionbar);
			return;
	}
		
	win.addEventListener("open", function(e){
			if (win.actionbar)
				return;
			
			win.has_actionbar = true;
			win.actionbar = actionbar;	
			for(var i=0; i<win._children.length; i++){
				var child = win._children[i];
				if ((child.top || child.top == 0) && !child.no_action_adjust)
					child.top = child.top + __l(44);
			}
			win.add(actionbar);
	});	
}

function add_default_action_bar(win, title, back){
	if (!Ti.App.is_android)
		return;
		
	function open_(){
			if (! win.activity) {
	            Ti.API.error("Can't access action bar on a lightweight window.");
	        } else {
	            actionBar = win.activity.actionBar;
	            if (actionBar) {
	                actionBar.backgroundImage = "/images/actionbg.png";
	                actionBar.title = win.title || "";
	               	actionBar.displayHomeAsUp = true;
	                actionBar.onHomeIconItemSelected = function() {
	                	if (!win.no_back)
	                    	win.close();
	                };
	            }
	        }
		}
	if (win.activity && win.activity.actionBar)
		open_();
	else
		win.addEventListener("open", open_);
	return;
}

function add_default_action_bar2(win, title, button_title, button_function, noback){
	if (!Ti.App.is_android)
		return;
		
	win.activity.onCreateOptionsMenu = function(e) {
	                	var item;
			            if (typeof button_title == "number" || button_title.indexOf("/images") >= 0){
			            	item = e.menu.add({
				            	icon: button_title,
				            	showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
				            });
				            item.addEventListener("click", function(e){
				            	button_function();
				            });
			            }
			            else{
			            	var wrapper = Titanium.UI.createView({
									top : 0,
									bottom : 1,
									height: Ti.UI.FILL,
									backgroundColor: "#15A1D2"
							});
							var button = Ti.UI.createButton({
								title : button_title,
								backgroundColor: Ti.App.bar_color,
								backgroundSelectedImage : "/images/bj2.png",
								font: {fontSize: __l(15)},
								top: 0,
								bottom: 0,
								borderRadius: __l(0),
								color: "white",
								horizontalWrap: false
							});
							button.addEventListener("click", function(e){
								button_function();
							});
							wrapper.add(button);
										
							var item = e.menu.add({
					        	title: button_title,
								showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
							});
							item.actionView = wrapper;
			            	/*
			            	item = e.menu.add({
				            	title: button_title,
				            	showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
				            });
				            */
			            }
	};
		
	function open_() {
			if (! win.activity) {
	            Ti.API.error("Can't access action bar on a lightweight window.");
	        } else {
	            actionBar = win.activity.actionBar;
	            if (actionBar) {
	                actionBar.backgroundImage = "/images/actionbg.png";
	                actionBar.title = win.title||"";
	                actionBar.displayHomeAsUp = noback ? false : true;
	                actionBar.onHomeIconItemSelected = function() {
	                    if (!win.no_back)
	                    	win.close();
	                };
	                
	            }
	        }
	}
	if (win.activity && win.activity.actionBar)
		open_();
	else
		win.addEventListener("open", open_);
	
	return;
}

function add_tab_to_actionbar(win, title, tabs){
	win.activity.onCreateOptionsMenu = function(e) {
		    	var buttons = [];
		    	for(var i=0; i<tabs.length; i++){
		    		var tab = tabs[i];
		    		var wrapper = Titanium.UI.createView({
									top : 0,
									bottom : 1,
									height: Ti.UI.FILL,
									backgroundColor: "#15A1D2"
					});
					var button = Ti.UI.createButton({
						title : tab.title,
						backgroundColor: Ti.App.bar_color,
						backgroundSelectedImage : "/images/bj2.png",
						font: {fontSize: __l(14)},
						top: 0,
						bottom: tab.selected ? __l(3) : 0,
						borderRadius: __l(0),
						color: "white",
						tab: tab,
						horizontalWrap: false
					});
					buttons.push(button);
					button.addEventListener("click", function(e){
							e.source.tab.click();
							
							if (!e.source.tab.isButton){
								for(var j=0; j<buttons.length; j++){
									buttons[j].bottom = 0;
								}
						        e.source.bottom = __l(3);
							}
					});
					wrapper.add(button);
								
					var item = e.menu.add({
			        	title: tab.title,
						showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
					});
					item.actionView = wrapper;
					if (i < tabs.length-1){
								var wrapper3 = Titanium.UI.createView({
									top : 4,
									bottom : 4,
									width: 1,
									height: Ti.UI.FILL
								});
								wrapper3.add(Ti.UI.createImageView({
									top: 12,
									bottom: 12,
									width: 1,
									opacity: 0.4,
									image : "/images/person_line.png"
								}));
								var item = e.menu.add({
						            showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
						        });
								item.actionView = wrapper3;
					}
		    	}
	};
		    
	function open_(){
		if (! win.activity) {
			Ti.API.error("Can't access action bar on a lightweight window.");
		} 
		else {
			actionBar = win.activity.actionBar;
			if (!actionBar)
				return;
			
			actionBar.title = win.title||"";
		    actionBar.displayHomeAsUp = true;
		    actionBar.onHomeIconItemSelected = function() {
		    	win.close();
		    };
		}
	}
	if (win.activity && win.activity.actionBar)
		open_();
	else
		win.addEventListener("open", open_);
}

//有传入的绝对地址改成当前应用的绝对地址，主要是替换变动的guid
function real_path(url){
	if (Ti.App.is_android)
		return url;
		
	if (!url)
		return url;
		
	if (url.indexOf("/Documents") == -1)
		return url;
	
	var cache_file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory);
	var tail = url.substr(url.indexOf("/Documents")+11);
	var full =  cache_file.nativePath + tail;
	
	return full;
}

function real_cache_path(url){
	if (Ti.App.is_android)
		return url;
		
	if (!url)
		return url;
		
	if (url.indexOf("/Library/Caches") == -1)
		return url;
	
	var cache_file = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory);
	var tail = url.substr(url.indexOf("/Library/Caches")+16);
	var full =  cache_file.nativePath + tail;
	
	return full;
}

function visible_items(){
	if (!Ti.App.is_android)
		return 7;
	
	if (Ti.App.logicalDensityFactor == 1.5 && Ti.App.density == "high"){
		return 8;
	}
		
	if (Ti.App.is_android && Ti.App.platform_width >= 480){
		return 5;
	}
	if (Ti.App.is_android && Ti.App.platform_width <= 320){
		return 6;
	}
	return 7;
}

function make_tableview_pull(tableview){
	if (!Ti.App.is_android)
		return  tableview;
		
	if (tableview.no_new){
		return tableview;
	}
	
	var swipeRefreshModule = require('com.rkam.swiperefreshlayout');
	var swipeRefresh = swipeRefreshModule.createSwipeRefresh({
	    view: tableview,
	    height: Ti.UI.FILL,
	    width: Ti.UI.FILL,
	    top: tableview.top,
	    bottom: tableview.bottom
	});				
	//tableview.top = 0;
	//tableview.bottom = 0;	
	swipeRefresh.addEventListener('refreshing', function() {
		tableview.fireEvent("refresh_new");
	});
	tableview.addEventListener("android_pull_refresh_finish", function(){
		swipeRefresh.setRefreshing(false);
	});
	tableview.add_pull_refresh = true;
	
	return swipeRefresh;
}

function create_tab_button(labels, attr){
	var view;
	if (true || Ti.App.is_android){
		var view = Ti.UI.createView(attr);
		view.borderRadius = __l(4);
		view.borderWidth  = 1;
		
		var buttons = [];
		view.borderColor  = attr.backgroundColor || "black";
		view.layout = "horizontal";
		for(var i=0; i<labels.length; i++){
			var button = Ti.UI.createView({
				backgroundColor: attr.index == i ? attr.backgroundColor : "white",
				height: Ti.UI.FILL,
				touchEnabled: true,
				width: 100/(labels.length) + "%",
				index: i
			});
			var label = Ti.UI.createLabel({
				text: labels[i],
				color: attr.index == i ? "white" : attr.backgroundColor,
				font: {fontSize: attr.fontSize ? attr.fontSize : attr.height*0.6},
				textAlign: "center",
				width: Ti.UI.FILL,
				touchEnabled: false
			});
			button._label = label;
			button.add(label);

			button.addEventListener("click", function(e){
				for(var j=0; j<buttons.length; j++){
					buttons[j].backgroundColor = "white";
					buttons[j]._label.color = attr.backgroundColor;
				}
				e.source.backgroundColor = attr.backgroundColor || "black";
				e.source._label.color = "white";

				view.fireEvent("click", {index: e.source.index});
			});
			if (i == labels.length - 1)
				button.width = Ti.UI.FILL;
			view.add(button);
			buttons.push(button);

			var line = Ti.UI.createView({
				backgroundColor: attr.backgroundColor || "black",
				width: 1,
				height: Ti.UI.FILL
			});
			if (i < labels.length-1)
				view.add(line);
		}
	}
	else{
		view = Titanium.UI.iOS.createTabbedBar(attr);
		view.labels = labels;
		view.style = Titanium.UI.iPhone.SystemButtonStyle.BAR;
	}

	return view;
}

//封装createLabel函数，在安卓下可以显示emoji图标
function createEmojiLabel(attrs){
	var CC = Ti.App.is_android ? require("com.mamashai.emoji").createLabel : Ti.UI.createLabel;
	return CC(attrs);
}

//封装createTextField函数，在安卓下可以显示emoji图标
function createEmojiTextField(attrs){
	var CC = Ti.App.is_android ? require("com.mamashai.emoji").createTextField : Ti.UI.createTextField;
	return CC(attrs);
}

//封装createTextArea函数，在安卓下可以显示emoji图标
function createEmojiTextArea(attrs){
	var CC = Ti.App.is_android ? require("com.mamashai.emoji").createTextArea : Ti.UI.createTextArea;
	return CC(attrs);
}
