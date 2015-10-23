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
	return Ti.App.is_ipad ? 2*x : x;
	*/
}

function zhinan_adv(code, view) {
	function add_adv(json) {
		if (json && json.length > 0) {								//有直投
			if (view.adview){
				view.remove(view.adview);
				view.adview = null;
			}
			var scrollView = Titanium.UI.createScrollableView({
			    showPagingControl : false,
			    currentPage :0,
			    height : Ti.App.is_ipad ? 90 : __l(50), 
			    bottom: 0,
			    left: 0,
			    right: 0
			});
			view.add(scrollView);
			view.adview = scrollView;
			scrollView.hide();
			
			var arr = new Array();
			for(var i=0; i<json.length; i++){
				var adv_json = json[i];
				if (adv_json.tp == 3) {					//网页
					var web = Ti.UI.createWebView({
						left : 0,
						top : 0,
						right : 0,
						bottom : 0,
						width : Ti.App.platform_width,
						height : Ti.App.is_ipad ? 90 : __l(50),
						url : adv_json.url
					});
					arr.push(web);
					//scrollView.addView(web)
				} else {
					var img = Ti.UI.createImageView({
						//left : 0,
						top : 0,
						//right : 0,
						bottom : 0,
						width : Ti.App.is_ipad ? 728 : Ti.App.platform_width,
						height : Ti.App.is_ipad ? 90 : __l(50),
						hires : true,
						image : "http://www.mamashai.com" + (Ti.App.is_ipad ? adv_json.logo_ipad_thumb : adv_json.logo_iphone_thumb),
						tp : adv_json.tp,
						url : adv_json.url,
						id: adv_json.id
					});
					img.addEventListener("click", function(e) {
						if (e.source.tp == 1)//应用内弹出
						{
							Titanium.App.fireEvent("open_url", {
								url : e.source.url
							});
						} else if (e.source.tp == 4) {//应用外
							Ti.Platform.openURL(e.source.url)
						} else if (e.source.tp == 2) {//执行
							eval(e.source.url)
						}
						Ti.App.fireEvent("flurry_event", {event: 'zhinan_advertisement_click_' + e.source.id});
					});
					//scrollView.addView(img)
					arr.push(img)
					
					if (adv_json.text && adv_json.text.length > 6){
						eval(adv_json.text)
					}
				}
			}
			
			for(var i=0; i<arr.length; i++){
			    j = parseInt(arr.length*Math.random()) % arr.length;
			    k = arr[i];
			    arr[i] = arr[j];
			    arr[j] = k;
			}
			for(var i=0; i<arr.length; i++){
				scrollView.addView(arr[i])
			}
			scrollView.show()
			Ti.App.fireEvent("flurry_event", {event: 'zhinan_advertisement_' + json[0].id})
		} else {//没有直投
			
		}
	}

	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = Ti.App.timeout;
	xhr.onload = function() {
			if (this.responseText == "null"){
				return;
			}	
			var json = JSON.parse(this.responseText);
			if (json) {
				require('lib/mamashai_db').db.insert_json("zhinan_tip2_" + code, "0", this.responseText);
			} else {
				require('lib/mamashai_db').db.delete_one_json("zhinan_tip2_" + code, "0");
			}
			add_adv(json);
	};
	
	var now = new Date();
	var record_json = require('lib/mamashai_db').db.select_one_json("zhinan_tip2_" + code, 0);
	if (!record_json.blank && now.getTime() - record_json.created_at < 1000 * 3600 ) {//1小时缓存
		var json = JSON.parse(record_json.json);
		add_adv(json);
	} else {
		var url = Ti.App.mamashai + '/api/statuses/calendar_tip_adv_list?code=' + code;
		if (!Ti.App.is_android)
			url = Ti.App.mamashai + '/api/statuses/calendar_tip_adv_list2?code=' + code;
		url += "&app=" + Ti.App.id + "&os=" + Ti.Platform.osname + "&width=" + Ti.App.platform_width;
		if (check_login()){
			url += "&user_id=" + user_id();
		}
		xhr.open('GET', url);
		xhr.send();
	}
}

exports.zhinan_adv = zhinan_adv; 

