function Weibo(attr){
	Ti.include("public.js");
	
	var Mamashai = require("lib/mamashai_ui");
	var TabBar = require("lib/tab_bar");
	var win = Titanium.UI.createWindow(attr);
	
	win.addEventListener("close", function(e){
		Titanium.App.fireEvent("submit_flurry");
	});
	
	Ti.App.addEventListener("middle_tab_click", function(e){
		new_post.fireEvent("click");
	});
	
	var date_showing = false;
	
	var date_picker = Ti.UI.createPicker({
		type:Ti.UI.PICKER_TYPE_DATE,
	//	minDate:minDate,
		maxDate: new Date(),
		value: new Date(),
		visibleItems: 3,
		bottom: 0,
		width: Ti.App.platform_width,
		label: "补记宝宝的成长"
	});
	
	date_picker.addEventListener("change", function(e){
		date_picker.value = e.value;
	});
	
	//var new_post = Ti.UI.createButton({ title: '我要记' });
	var new_post = Ti.UI.createButton({ 
		backgroundImage: Ti.App.osversion<"7.0" ? '/images/write_android.png' : '/images/write.png',
		backgroundSelectedImage: '/images/write_android_d.png', 
		width: 26, 
		height: 26 
	});
	new_post.addEventListener("click", function(){
		if (!check_login()){
				to_login();
				return;
		}
		var optionsDialogOpts = {
			options : ['提示我记点啥', '日常监测', '文字', '图片', '视频', '补记', '取消'],
			cancel : 6
		};

		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
		dialog.addEventListener("click", function(e){
			if (e.index == 2){
				show_window("write_post", {
						title : '随便记记',
						text : '',
						kind : 'wenzi',
						from : 'wenzi',
				});
			}
			else if (e.index == 3){
				select_photo(false, function(image, path){
					show_window("write_post", {
						title : '晒图',
						text : '',
						kind : 'wenzi',
						image : image,
						from : 'wenzi'
					});
				});
			}
			else if (e.index == 4){
				show_window("write_post", {
					title : '晒视频',
					text : '',
					kind : 'video',
					is_video : true,
					from : 'video'
				});
			}
			else if (e.index == 5){			//补记
				if (Ti.App.is_android){
					var maxDate = new Date();
					date_picker.showDatePickerDialog({
						value: date_picker.value,
						callback: function(e){
							if (!e.cancel && date_str(e.value) != date_str(date_picker.value)){
								date_picker.value = e.value;
								var now = new Date();
								if (now.getTime() < e.value.getTime()){
									show_alert("提示", "只能选择过去的日期");
									return;
								}
								
								show_window("write_post", {
									title : '补记',
									text : '',
									kind : 'wenzi',
									from : 'wenzi',
									today_str : date_str(e.value)
								});
							}
						}, 
						okButtonTitle: '确定', 
						title: '请选择想补记日期',
						maxDate: maxDate
					});
					return;
				}
						
				if (date_showing)
					return;
				
				date_showing = true;
				var PickerView = require('lib/picker_view');
				var picker_view = PickerView.create_picker_view(date_picker, function(){
					date_showing = false;
					show_window("write_post", {
						title : '补记',
						text : '',
						kind : 'wenzi',
						from : 'wenzi',
						today_str : date_str(date_picker.value)
					});
				}, 
				function(){
						date_picker.value = new Date();
						date_showing = false;
				},
				"关闭");
		
				win.add(picker_view);
				picker_view.animate(PickerView.picker_slide_in);
			}
			else if (e.index == 1){
				show_window("richang", {
					title: "日常监测"	
				});
			}
			else if (e.index == 0){
				show_window("write", {
					title: "提示记录"	
				});
			}
		});
		dialog.show();
	});
	
	if (!Ti.App.is_android){
		win.setRightNavButton(new_post);
	}
	else{
		Ti.App.addEventListener("new_post", function(e){
			new_post.fireEvent("click");
		});
	}
	
	//显示孩子年龄
	var now = new Date();
	var today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
	var kid_birthday = '2014-1-1';
	var kid = null;
	var kid_str = "";
	var android_title = null;
	var user_json = null;
	function calc_kid(){
		if (!check_login()){
			win.title = "记录";
			if (!Ti.App.is_android){
				win.titleControl = null;
			}
			if (android_title){
				android_title.title = "";
			}
			return;
		}
		
		var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id());
		if (!record.blank){
			var json = JSON.parse(record.json);
			user_json = json;
			if (json.user_kids.length > 0){
				kid = json.user_kids[0];
				kid_birthday = kid.birthday;
				var current_kid_id = Ti.App.Properties.getString("current_kid_id", "");
				if (current_kid_id != ""){
					for(var i=0; i<json.user_kids.length; i++){
						if (json.user_kids[i].id == parseInt(current_kid_id)){
							kid = json.user_kids[i];
							kid_birthday = kid.birthday;
							break;
						}
					}
				}
				
				var desc = detail_age_for_birthday(kid.birthday, today_str);
				kid_str = kid.name + desc;
				if (desc == "备孕期"){
					kid_str = desc;
				}
					
				//孕期不显示孩子昵称
				if (desc.indexOf("孕") == 0){
					kid_str = desc;
				}
				
				
				if (!Ti.App.is_android){
					var label = Ti.UI.createLabel({
						text: kid_str,
						font : {
							fontSize : 17,
							fontWeight: "bold"
						},
						color: Ti.App.ios7 ? Ti.App.bar_color : "white",
						textAlign: "center",
						width: Ti.version == "2.0.1" ? Ti.UI.FILL : Ti.UI.SIZE,
						right: 8,
						top: 0,
						bottom: 0,
						height: 30
					});
					label.addEventListener("click", function(e){
						show_window("write", {
							title: "提示记录"	
						});
					});
					win.titleControl = label;
				}
				if (android_title){
					android_title.title = kid_str;
				}
					
			}	
		}	
	}
	calc_kid();
	
	if (Ti.App.is_android){
		win.activity.onCreateOptionsMenu = function(e) { 
			var menu = e.menu; 
			if (check_login() && kid_str.length > 0){
				var menuItem = menu.add({ 
					title : kid_str, 
					showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM 
				}); 
				android_title = menuItem;
				menuItem.addEventListener("click", function(e) { 
					show_window("write", {
						title: "提示记录"	
					});
				});
			}	
				
			var menuItem = menu.add({ 
				title : "记录",
				icon: Ti.Android.R.drawable.ic_menu_edit, 
				//icon : '/images/write_android@' + Ti.App.logicalDensityFactor + '.png', 
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
			}); 
			menuItem.addEventListener("click", function(e) { 
				Ti.App.fireEvent("new_post");
			});
		};
	}
	
	win.addEventListener("open", function(e){
		var wrapper = Ti.UI.createScrollView({
			top : __l(0),
			left : 0,
			right : 0,
			bottom : Ti.App.is_android ? __l(54) : 0,
			contentHeight : 'auto',
			contentWidth : Ti.App.platform_width,
			showVerticalScrollIndicator : false
		});

		wrapper.addEventListener("scroll", function(e){
			if (e.source != wrapper)
				return;
				
			if (!wrapper.contentOffset)
				return;
			
			if (wrapper.contentOffset.y >= parseInt(__l(140)*Ti.App.platform_width/__l(320))){
				wrapper.scrollingEnabled = false;
				win.tableview.scrollable = true;
			}
			else if (wrapper.contentOffset.y <= 0){
				wrapper.scrollingEnabled = true;
				if (win.tableview){
					win.tableview.scrollable = false;
				}
			}
		});
		win.add(wrapper);
		
		var ads_wrapper = Ti.UI.createScrollableView({
			showPagingControl : true,
			pagingControlHeight : 30,
			backgroundColor: "#B4D3D7",
			pagingControlColor : "transparent",
			left: 0,
			right: 0,
			top: 0,
			width: Ti.App.platform_width,
			height: __l(140)*Ti.App.platform_width/__l(320)
		});
		
		var xhr = Ti.Network.createHTTPClient();
		xhr.timeout = 10000;
		xhr.onerror = function() {
			setTimeout(function(){
				xhr.open('GET', url);
				xhr.send();
			}, 1000);
		};
		xhr.onload = function() {
			if (Ti.App.is_android && !win.activity)
				return;
				
			var old_views_count = 0;
			if (ads_wrapper.views && ads_wrapper.views.length > 0){
				old_views_count = ads_wrapper.views.length;
			}
					
		    var result_json = JSON.parse(this.responseText);
		    topic_json = result_json.topic;
		    var json = result_json.advs;
			if (json.length == 1){
				ads_wrapper.showPagingControl = false;
			}
			for(var i=0; i<json.length; i++){
				var ad_json = json[i];
				if (ad_json.tp == 4){		//web
					var web = Ti.UI.createWebView({
						left: 0,
						top: 0,
						right: 0,
						bottom: 0,
						width: Ti.App.platform_width,
						height: __l(140)*Ti.App.platform_width/__l(320),
						url: ad_json.url
					});
					ads_wrapper.addView(web);
				}
				else{
					var img = Ti.UI.createImageView({
						left: 0,
						top: 0,
						right: 0,
						bottom: 0,
						width: Ti.App.platform_width,
						height: __l(140)*Ti.App.platform_width/__l(320),
						hires : true,
						image : Ti.App.aliyun + ad_json.logo_thumb280,
						tp: ad_json.tp,
						url: ad_json.url,
						code: ad_json.code,
						id: ad_json.id
					});
					
					img.addEventListener("click", function(e){
							if (e.source.tp == 1){
								Ti.Platform.openURL(e.source.url)
							}
							else if (e.source.tp == 2){
								Titanium.App.fireEvent("open_url", {
									url : e.source.url
								});
							}
							else if (e.source.tp == 3 || e.source.tp == 4){
								eval(e.source.url)
							}
							logEvent('calendar_advertisement_click_' + e.source.id);
					});
							
					ads_wrapper.addView(img)
							
					if (ad_json.code && ad_json.code.length > 1)  	//强制执行
					{
						eval(ad_json.code)
					}
				}
				
				logEvent('calendar_advertisement_' + ad_json.id);
			}			
					
			for(var i=old_views_count-1; i>=0; i--){
				ads_wrapper.removeView(ads_wrapper.views[i]);
			}
						
			if (!win.has_ads_wrapper){
				wrapper.add(ads_wrapper);
				win.has_ads_wrapper = true;
			}
					
			add_android_scroll_ind(ads_wrapper, Ti.App.platform_width);
					
			if (ads_wrapper.views.length > 0)
				ads_wrapper.currentPage = 0;
		};
		
		var windows_focus = true;
		win.addEventListener("focus", function(e){
			windows_focus = true;
		});
		
		win.addEventListener("blur", function(e){
			windows_focus = false;
		});
		
		var timer1 = setInterval(function(e) {
			if (Ti.App.is_android && !win.activity)
				return;
				
			if (!windows_focus)
				return;
				
			if (!ads_wrapper.views)
				return;
				
			if (ads_wrapper.views && ads_wrapper.views.length == 0)
				return;
				
			var t = ads_wrapper.currentPage; 
			t += 1;
			if(ads_wrapper.views && t >= ads_wrapper.views.length) {
				t = 0;
			}
			ads_wrapper.scrollToView(t);
		}, 8000);
		
		win.addEventListener("close", function(e){
			clearInterval(timer1);
		});
		
		var url = Ti.App.mamashai + '/api/statuses/half_screen_advs';
		url += "?app=" + Ti.App.id + "&os=" + Ti.Platform.osname + "&width=" + Ti.App.platform_width;
		
		if (check_login()){
			url += '&user_id=' + user_id();
		}
		
		if (Ti.App.deployType == "development" || Ti.App.deployType == "test" || Ti.App.Properties.getString("is_mms_admin", "false") == "true"){
			url += "&tp=test";
		}
		
		setInterval(function(e) {
		    if (!windows_focus)
		    	return;
		    	
		    xhr.open('GET', url);
		   	xhr.send();
		}, 1000*1800);
					
		xhr.open('GET', url);
		xhr.send();
		
		var topic_json = null;
		
		var options = [
			{text: '热点', value: 7},
			{text: '话题', value: 4},
			{text: '新鲜', value: 0},
			{text: '同城', value: 9},
			{text: '关注', value: 3},
			{text: '同月', value: 2}];
		if (Ti.App.Properties.getString("is_mms_admin", "false") == "true"){
			options.push({text: "新手", value: 8});
		}	
		var container = TabBar.create_tab_bar(options,
			false);
		container.top = __l(140)*Ti.App.platform_width/__l(320);
			
		container.addEventListener("tab_click", function(e){
			tab_click(e.value);
		});
		wrapper.add(container);
		win.virgen = true;
		
		var table_wrapper = Ti.UI.createView({
			height: Ti.App.is_android ? win.rect.height - container.height - __l(154) : win.rect.height - container.height,
			left: 0,
			right: 0,
			top: __l(140)*Ti.App.platform_width/__l(320) + container.height
		});
		
		wrapper.add(table_wrapper);
		Ti.App.addEventListener("select_city", function(e){
			if (win.tableview){
				win.tableview.fireEvent("select_city", e);	
			}
		});
		function tab_click(index, no_animate){
			table_wrapper.height = Ti.App.is_android ? win.rect.height - container.height - __l(54) : win.rect.height - container.height;
			
			if ((index == 3 || index == 2) && !user_id()){
				index = 0;
				to_login();
				return;
			}
			
			if (table_wrapper.v){
				win.tableview.setData([]);
				win.tableview.xhr = null;
				Ti.API.log("~~~~~~~~remove~~~~~~~~");
				table_wrapper.remove(table_wrapper.v);
				Ti.API.log("~~~~~~~~remove finished~~~~~~~~");
			}
			
			var tableview = null;
			if (index == 0){
				 tableview = Mamashai.ui.make_weibo_tableview("all", Ti.App.mamashai + "/api/statuses/public_timeline.json?1=1", user_id(), "posts");
			}
			else if (index == 2){
				var show_header = false;
				var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id());
				if (!record.blank){
					user_json = JSON.parse(record.json);
				}
				
				if (!user_json){
					show_notice("您需要登录");
					return;
				}
					
				if (user_json.user_kids.length > 1){
					var current_birthday = user_json.user_kids[0].birthday;
					for(var i=1; i<user_json.user_kids.length; i++){
						if (current_birthday != user_json.user_kids[i].birthday){
							show_header = true;
							break;
						}
					}
				}
				tableview = Mamashai.ui.make_weibo_tableview("samemonth", Ti.App.mamashai + "/api/statuses/samemonth_timeline.json?1=1", user_id(), "posts");
				
				if (show_header){
					tableview.no_cache = true;
					var header = Ti.UI.createView({
						left: 0,
						right: 0,
						width: Ti.App.platform_width,
						height: __l(40),
						backgroundColor: "white"
					});
					var button_wrapper = Ti.UI.createView({
						right: 0,
						bottom: 0,
						top: 0,
						layout: 'horizontal',
						width: Ti.UI.SIZE
					});
					for(var i=0; i<user_json.user_kids.length; i++){
						var button = Ti.UI.createButton({
							right: __l(10),
							width: Ti.UI.SIZE,
							title: user_json.user_kids[i].name,
							font: {fontSize: __l(13)},
							height: __l(30),
							top: __l(5),
							id: user_json.user_kids[i].id
						});
						if (Ti.App.is_android){
							button.color = Ti.App.bar_color;
							button.backgroundSelectedColor = "#EEE";
							button.backgroundColor = 'transparent';
						}
						button.addEventListener("click", function(e){
							tableview.url = Ti.App.mamashai + "/api/statuses/samemonth_timeline.json?kid_id=" + e.source.id;
							show_loading();
							tableview.setData([]);
							tableview.send();
						});
						button_wrapper.add(button);
					}
					header.add(button_wrapper);
					if (!Ti.App.is_android){
						header.add(Ti.UI.createView({
							bottom: 0,
							height: __l(1),
							backgroundColor: '#ccc',
							left: 0,
							right: 0,
						}));
					}
					tableview.headerView = header;
				}
			}
			else if (index == 3){
				tableview = Mamashai.ui.make_weibo_tableview("friend", Ti.App.mamashai + "/api/statuses/friends_timeline.json?1=1", user_id(), "posts");
			}
			else if (index == 4){			//话题
				if (!topic_json || topic_json.length == 0){
					show_notice("获取话题失败");
					return;
				}
				var tableview = Mamashai.ui.make_weibo_tableview('topic_' + topic_json.short_tag_name, Ti.App.mamashai + "/api/statuses/public_timeline.json?tag=" + topic_json.short_tag_name, user_id(), "posts");
				tableview.no_cache = true;
				var header = Ti.UI.createView({
					left: 0,
					right: 0,
					width: Ti.App.platform_width,
					height: __l(40),
					//backgroundColor: '#F8F8F8'
					backgroundColor: "white"
				});
				var label = Ti.UI.createLabel({
					color: "black",
					font: {fontSize: __l(13)},
					left: __l(10),
					right: __l(70),
					text: topic_json.summary
				});
				var button = Ti.UI.createButton({
					right: __l(10),
					width: __l(50),
					title: "参与",
					font: {fontSize: __l(14)},
					height: __l(32),
					top: __l(4)
				});
				button.addEventListener("click", function(e){
					if (!check_login()){
						to_login();
						return;	
					}
					show_window("write_post", {
						text: "#" + topic_json.short_tag_name + "#",
						from : "wenzi",
						kind : "wenzi",
						title : '参与话题'
					});
				});
				if (Ti.App.is_android){
					button.color = Ti.App.bar_color;
					button.backgroundSelectedColor = "#EEE";
					button.backgroundColor = 'transparent';
				}
				header.add(label);
				header.add(button);
				if (!Ti.App.is_android){
					header.add(Ti.UI.createView({
						bottom: 0,
						height: __l(1),
						backgroundColor: '#ccc',
						left: 0,
						right: 0,
					}));
				}
				tableview.headerView = header;
			}
			else if (index == 5){
				tableview = Mamashai.ui.make_weibo_tableview("all_video", Ti.App.mamashai + "/api/statuses/public_timeline.json?from=video", user_id(), "posts");
			}
			else if (index == 6){
				tableview = Mamashai.ui.make_weibo_tableview("templates", Ti.App.mamashai + "/api/statuses/public_timeline.json?tp=template", user_id(), "posts");
			}
			else if (index == 8){
				tableview = Mamashai.ui.make_weibo_tableview("rookie", Ti.App.mamashai + "/api/statuses/public_timeline_rookie.json?1=1", user_id(), "posts");
			}
			else if (index == 7){
				tableview = Mamashai.ui.make_weibo_tableview("hot", Ti.App.mamashai + "/api/statuses/public_timeline_hot.json?1=1", user_id(), "posts");
				tableview.by_page 	= true;
				tableview.no_cache 	= true;
				tableview.no_new 	= true;
				tableview.page		= 1;
			}
			else if (index == 9){
				var tableview = Mamashai.ui.make_weibo_tableview('location_posts', Ti.App.mamashai + "/api/statuses/location_timeline.json", user_id(), "posts");
				tableview.no_cache 	= true;
				
				if (check_login()){
					win.province_name = user_json.province_name;
					win.city_name = user_json.city_name;
					if (user_json.city_name || user_json.province_name)
						tableview.user_has_city_info = true;
				}
				
				var header = Ti.UI.createView({
					left: 0,
					right: 0,
					width: Ti.App.platform_width,
					height: __l(40),
					backgroundColor: "white"
				});
			
				var button_wrapper = Ti.UI.createView({
					right: 0,
					bottom: 0,
					top: 0,
					layout: 'horizontal',
					width: Ti.UI.SIZE
				});
				
				var button = Ti.UI.createButton({
					right: __l(10),
					width: Ti.UI.SIZE,
					title: !win.province_name && !win.city_name ? "选择城市" : (win.province_name||'') + (win.city_name||''),
					font: {fontSize: __l(13)},
					height: __l(30),
					top: __l(5)
				});
				button.addEventListener("click", function(e){
					show_window("city", {
						filter: true,
						s_province: win.province_name,
						s_city: win.city_name,
						title : '选择城市'
					});
				});
				
				var button_same_city = Ti.UI.createButton({
					right: __l(10),
					width: 1,
					title: "",
					font: {fontSize: __l(13)},
					height: __l(30),
					top: __l(5)
				});
				button_same_city.addEventListener("click", function(e){
					if (!win.province_name && !tableview.province_id && !tableview.city_id){
						show_alert("提示", "亲，您还未选择所在城市，系统也未获得您的位置！");
						return;
					}
					show_window("same_city_user", {
						title : e.source.title,
						user_id : user_id(),
						province_id : tableview.province_id,
						city_id : tableview.city_id
					});
				});
				if (Ti.App.is_android){
					button.color = Ti.App.bar_color;
					button.backgroundSelectedColor = "#EEE";
					button.backgroundColor = 'transparent';
					button_same_city.color = Ti.App.bar_color;
					button_same_city.backgroundSelectedColor = "#EEE";
					button_same_city.backgroundColor = 'transparent';
				}
					
				button_wrapper.add(button);
				button_wrapper.add(button_same_city);
				header.add(button_wrapper);
				if (!Ti.App.is_android){
					header.add(Ti.UI.createView({
						bottom: 0,
						height: __l(1),
						backgroundColor: '#ccc',
						left: 0,
						right: 0,
					}));
				}
				
				tableview.headerView = header;
				
				process_table(tableview);
				var v = make_tableview_pull(tableview);
				table_wrapper.v = v;
				table_wrapper.add(v);
				
				tableview.addEventListener("select_city", function(e){
					show_loading();
					tableview.setData([]);
					var url = "";
					if (e.city_id){
						url = Ti.App.mamashai + "/api/statuses/location_timeline.json?city_id=" + e.city_id;
					}
					else if (e.province_id){
						url = Ti.App.mamashai + "/api/statuses/location_timeline.json?province_id=" + e.province_id;
					}
					else if (check_login()){		//获得了用户地址
						url = Ti.App.mamashai + "/api/statuses/location_timeline.json?user_id=" + user_id();
					}
					tableview.url 			= url;
					button.title 		= (e.province_name||'') + (e.city_name||'');
					button.width = Ti.UI.SIZE;
					tableview.province_id 	= e.province_id;
					tableview.city_id 		= e.city_id;
					win.province_name = e.province_name;
					win.city_name = e.city_name;
					tableview.send();
					
					button_same_city.title = "同城麻麻";
					button_same_city.width = Ti.UI.SIZE;
					
					if (check_login() && Ti.App.Properties.getString("never_show_city_alert", "false") != "true"){
						var alert_dialog = Titanium.UI.createAlertDialog({
							title : '提示',
							message : '亲，您需要将' + e.province_name + (e.city_name||'') + "设置为您所在的城市吗？",
							buttonNames : ['是的', '不再显示', '不要'],
							cancel : 2
						});
						alert_dialog.addEventListener("click", function(e1){
							if (e1.index == 0){
								var url = Ti.App.mamashai + "/api/account/update_profile?city=" + e.city_id + "&province=" + e.province_id + "&" + account_str();
								http_call(url, function(e2){
									require('lib/mamashai_db').db.insert_json("user_profile", user_id(), e2.responseText);
									show_notice("设置城市成功");
								});
							}
							else if (e1.index == 1){
								Ti.App.Properties.setString("never_show_city_alert", "true");
							}
						});
						alert_dialog.show();
					}
				});
				
				if (tableview.user_has_city_info){
					tableview.url = Ti.App.mamashai + "/api/statuses/location_timeline.json?user_id=" + user_id();
					button_same_city.title = "同城麻麻";
					button_same_city.width = Ti.UI.SIZE;
					show_loading();
					tableview.send();
				}
				else{
					//自动获取城市
					http_call(Ti.App.mamashai + "/api/statuses/get_city_from_gps", function(e){
						eval(e.responseText);
					}, function(e){
						
					});
				}
				return;
			}
			
			if (Ti.App.is_android && !tableview.headerView){
				tableview.headerView = Ti.UI.createView({
					left: 0,
					right: 0,
					width: Ti.App.platform_width,
					height: 1,
					backgroundColor: 'white'
				});	
				
				tableview.scrollToIndex(1);
			}
			
			function process_table(tableview){
				tableview.top = 0;
				tableview.width = Ti.App.platform_width;
				if (win.tableview){
					tableview.scrollable = win.tableview.scrollable;
				}
				else{
					tableview.scrollable = false;
				}
				
				win.tableview = tableview;
					
				tableview.addEventListener("scroll", function(e){
					if (Ti.App.is_android){
						tableview.firstVisibleItem = e.firstVisibleItem;
					}
					else{
						if (tableview.contentOffset_y && e.contentOffset.y > tableview.contentOffset_y){
							tableview.direction = 'down';
						}
						else if (tableview.contentOffset_y && e.contentOffset.y < tableview.contentOffset_y){
							tableview.direction = 'up';
						}
						tableview.contentOffset_y = e.contentOffset.y;
						tableview.contentSize = e.contentSize;
					}
				});
				
				tableview.addEventListener("scrollend", function(e){
					if (Ti.App.is_android){
						if (tableview.firstVisibleItem == 0){
							wrapper.scrollTo(0, 0);
							tableview.scrollable = false;
							wrapper.scrollingEnabled = true;
						}
						else{
							tableview.scrollable = true;
						}	
					}
					else{
						if (tableview.contentOffset_y <= 0){
							wrapper.scrollTo(0, 0);
							tableview.scrollable = false;
							wrapper.scrollingEnabled = true;
						}
						else{
							tableview.scrollable = true;
						}
					}	
				});
			}
			process_table(tableview);
			
			//wrapper.scrollingEnabled = true;
			var v = make_tableview_pull(tableview);
			table_wrapper.v = v;
			
			table_wrapper.add(v);
			
			if (Ti.App.is_android && tableview.headerView && tableview.headerView.height == 1){
				tableview.scrollToTop(1);
			}
			
			//if (Ti.App.is_android)
			//	wrapper.scrollTo(0, 0);
			
			//win.addEventListener("focus", function(e){
			//	tableview.height = wrapper.rect.height - container.height;
			//});
			
			tableview.send();
			
			if (win.virgen)
				win.virgen = false;
			else
				show_loading();
			
			logEvent('weibo');
		}
		
		setTimeout(function(){
			container.fireEvent("click", {index: 0});
		}, 50);
	});
	
	function _logged_in(e)
	{
		calc_kid();
	}
	
	function _logged_out(e)
	{
		calc_kid();
	}
	
	function _get_mention(e){
		var record = require('/lib/mamashai_db').db.select_one_json("mention", 0);
		if (!record.blank){
			var json = JSON.parse(record.json);
			var count = json.dm + json.followers + json.mentions + json.comments + json.gifts;
			if (count > 0){
				if (Ti.App.is_android){
					Ti.App.current_window.fireEvent("set_badge", {index: 3, number: count});
				}
				else{
					Ti.App.currentTabGroup.tabs[3].badge = count;
				}
				
				Titanium.UI.iPhone.appBadge = count;
			}
			else{
				if (Ti.App.is_android){
					Ti.App.current_window.fireEvent("set_badge", {index: 3, number: null});
				}
				else{
					Ti.App.currentTabGroup.tabs[3].badge = null;
				}
				
			}
		}
	}
	
	Titanium.App.addEventListener('switch_baby', _logged_in);
	Titanium.App.addEventListener('logged_in', _logged_in);
	Titanium.App.addEventListener('logged_out', _logged_out);
	Titanium.App.addEventListener('get_mention', _get_mention);
	
	if (Ti.App.is_android){
		win.addEventListener("close", function(){
			Ti.App.removeEventListener('get_mention', _get_mention);
			Ti.App.removeEventListener('logged_in', _logged_in);
			Ti.App.removeEventListener('get_mention', _get_mention);
		});
	}
	
	return win;
}

module.exports = Weibo;