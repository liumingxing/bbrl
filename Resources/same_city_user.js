function SameCity(attr){
 	Ti.include("public.js");
 	var win = Titanium.UI.createWindow(attr);
 	add_default_action_bar(win, win.title, true);
 	var per_page = Ti.App.platform_height > __l(500) ? 15 : 12;
 	
 	win.addEventListener("open", function(e){
		var canvas = Ti.UI.createScrollView({
			contentWidth: Ti.App.platform_width,
			contentHeight: 'auto',
			width: Ti.App.platform_width,
			showVerticalScrollIndicator: true,
			layout : 'horizontal',
			left : 0,
			top : 0,
			bottom : 0,
			right : 0,
			visible: false,
			textAlign : "center"
		});
		
		win.add(canvas);
		
		var more_button = Titanium.UI.createButton({
			top : __l(10),
			bottom : __l(6),
			left : (Ti.App.platform_width-__l(300))/2,
			width : __l(300),
			height : __l(40),
			title : "下一页",
			font : {fontSize: __l(18)}
		});
		pre_btn(more_button);
		more_button.addEventListener("click", function(){
			show_loading();
			page += 1;
			var url = Ti.App.mamashai + "/api/users/same_city_users.json?per_page=" + per_page + "&page=" + page;
			if (win.user_id)
				url += "&user_id=" + win.user_id;
			if (win.province_id)
				url += "&province_id=" + win.province_id;
			if (win.city_id)
				url += "&city_id=" + win.city_id;
			http_call(url, callback);
		});
		
		var add_more = false;
		function callback(e){
				hide_loading();
				var json = JSON.parse(e.responseText);
				if (json.error){
					win.close();
					show_alert(json.error);
					return;
				}
				if(this.responseText == "null" || json.length == 0) {
					show_notice("还没有同城麻麻");
				} else {
					if (add_more){
						canvas.remove(more_button);
						add_more = false;
					}
					var count = 0;
					for(var i = 0; i < json.length; i++) {
						var button_wrapper = Titanium.UI.createView({
							top : __l(8),
							left : (Ti.App.platform_width - __l(80)*3)/4,
							width : __l(80),
							height : __l(80),
							borderColor: "#9F8652",
							borderWidth: 1,
							json: json[i],
							borderRadius: __l(8)
						});
						
						button_wrapper.addEventListener("touchstart", function(e){
							e.source.backgroundColor = "#E5E7DF";
						});
						button_wrapper.addEventListener("touchend", function(e){
							e.source.backgroundColor = "transparent";
						});
						button_wrapper.addEventListener("touchcancel", function(e){
							e.source.backgroundColor = "transparent";
						});
			
						button_wrapper.addEventListener("click", function(e){
							show_window("user", {
								title: e.source.json.name,
							    id : e.source.json.id
							});
						});
						
						var user_logo = Ti.UI.createImageView({
							top : __l(4),
							width : __l(38),
							height : __l(38),
							defaultImage : "./images/default.gif",
							hires : true,
							button: button_wrapper,
							touchEnabled: false,
							image : Ti.App.aliyun + encodeURI(json[i].logo_url_thumb140)
						});
						button_wrapper.add(user_logo);
		
						var user_name = Ti.UI.createLabel({
							bottom : __l(21),
							left : __l(2),
							right : __l(2),
							height : __l(16),
							font : {
								fontSize : __l(12)
							},
							text : json[i].name,
							color: "#333",
							button: button_wrapper,
							touchEnabled: false,
							textAlign : "center"
						});
						button_wrapper.add(user_name);
		
						var location = Ti.UI.createLabel({
							bottom : __l(5),
							left : __l(1),
							right : __l(1),
							height : __l(15),
							font : {
								fontSize : __l(11)
							},
							color: "#333",
							textAlign : "center",
							button: button_wrapper,
							touchEnabled: false,
							text : (json[i].province_name||'') + (json[i].city_name ? "." + json[i].city_name : '')
						});
						
						button_wrapper.add(location);
						
						canvas.add(button_wrapper);
					}
					
					if (json.length == per_page)
						canvas.add(more_button);
					
					add_more = true;
					canvas.show();
				}
		}
		
		var page = 1;
		var url = Ti.App.mamashai + "/api/users/same_city_users.json?per_page=" + per_page + "&page=" + page;
		if (win.user_id)
			url += "&user_id=" + win.user_id;
		if (win.province_id)
			url += "&province_id=" + win.province_id;
		if (win.city_id)
			url += "&city_id=" + win.city_id;
		show_loading();
		http_call(url, callback);
	});
	return win;
}

module.exports = SameCity;