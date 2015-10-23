function Write(attr){
	Ti.include("public.js");
	var WritePost = require("write_post");
	
	var win = Titanium.UI.createWindow(attr);
	win.title = "";
	
	//数据库操作
	function select_one_step(birthday_str, now_str){
		var birthday = new Date();
		
		var ss = birthday_str.split("-");
		birthday.setFullYear(parseInt(ss[0], 10), parseInt(ss[1], 10) - 1, parseInt(ss[2], 10));
		
		var now = new Date();
		if(now_str){
			var ss = now_str.split("-");
			now.setFullYear(parseInt(ss[0], 10), parseInt(ss[1], 10) - 1, parseInt(ss[2], 10));
		}
		var distance = 0;
		var seconds_diff = (now.getTime() - birthday.getTime());
		if (seconds_diff > 0){			//已出生
			var year = now.getFullYear() - birthday.getFullYear();
			var month = now.getMonth() - birthday.getMonth();
			var date = now.getDate() - birthday.getDate();
			
			if (month < 0){
				year -= 1;
				month += 12;
			}
			if (date < 0){
				month -= 1;
				date += 30;
			}
			if (date >= 28)
				date = 27
			
			distance = year*48 + month*4 + parseInt(date/7)
		}
		else {							//未出生
			var days_diff = seconds_diff / (1000*3600*24);
			distance = parseInt(days_diff / 7);
			if (Math.abs(days_diff % 7) > 0)
				distance -= 1;
		}
		var record = Ti.App.db2.execute('SELECT * FROM months where distance=?', distance);
		
		var result = null;
		if(record.isValidRow()) {
			result = {
				id : record.fieldByName("id"),
				distance : distance,
				functions : record.fieldByName('functions'),
				blank : false
			}
		} else {
			result = {
				blank : true
			}
		}
	
		record.close();
		return result;
	}
	
	function select_one_tip(kind, birthday_str, now_str) {
		var birthday = new Date();
		
		var ss = birthday_str.split("-");
		birthday.setFullYear(parseInt(ss[0], 10), parseInt(ss[1], 10) - 1, parseInt(ss[2], 10));
		
		var now = new Date();
		if(now_str){
			var ss = now_str.split("-");
			now.setFullYear(parseInt(ss[0], 10), parseInt(ss[1], 10) - 1, parseInt(ss[2], 10));
		}
		var distance = 0;
		var seconds_diff = (now.getTime() - birthday.getTime());
		if (seconds_diff > 0){			//已出生
			var year = now.getFullYear() - birthday.getFullYear();
			var month = now.getMonth() - birthday.getMonth();
			var date = now.getDate() - birthday.getDate();
			
			if (month < 0){
				year -= 1;
				month += 12;
			}
			if (date < 0){
				month -= 1;
				date += 30;
			}
			
			if (date >= 28)
				date = 27
			
			distance = year*48 + month*4 + parseInt(date/7)
			
			//alert(year + '-' + month + '-' + date + '-' + distance)
		}
		else {							//未出生
			var days_diff = seconds_diff / (1000*3600*24);
			distance = parseInt(days_diff / 7);
			if (Math.abs(days_diff % 7) > 0)
				distance -= 1;
		}
		
		var record = Ti.App.db2.execute('SELECT * FROM tips where t=? and distance=?', kind, distance);
		
		var result = null;
		if(record.isValidRow()) {
			result = {
				distance : distance,
				title : record.fieldByName('title'),
				options : record.fieldByName('options'),
				blank : false
			}
	
		} else {
			result = {
				blank : true
			}
		}
	
		record.close();
		return result;
	}
	
	function calc_kid(){
		var current_kid_id = Ti.App.Properties.getString("current_kid_id", "");
		var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id());
		if (!record.blank){
			var json = JSON.parse(record.json);
			if (json.user_kids.length == 0)
				return;
				
			kids = json.user_kids;
			kid = json.user_kids[0];
			kid_birthday = kid.birthday;	
			
			if (current_kid_id != ""){
				for(var i=0; i<json.user_kids.length; i++){
					if (json.user_kids[i].id == parseInt(current_kid_id)){
						kid = json.user_kids[i];
						kid_birthday = kid.birthday;
						break;
					}
				}
			}
		}
	}
	
	var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id());
	var kid_birthday = '2012-1-1';
	var kid = null;
	var kids = null;
	
	var now = new Date();
	var today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
	var g_today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
	var date_picker = null;
	var kinds = new Array();
	
	function set_title_label(){
		var desc = detail_age_for_birthday(kid.birthday, today_str);
		var str = kid.name + desc;
		if (desc == "备孕期"){
			str = desc;
		}
		
		//孕期不显示孩子昵称
		if (desc.indexOf("孕") == 0){
			str = desc;
		}
		
		var title_view = Ti.UI.createView({
			top: 0,
			width: Ti.UI.SIZE,
			height: 30,
			layout: "horizontal"
		});
		
		var label = Ti.UI.createLabel({
			text: str,
			font : {
				fontSize : 16,
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
		
		var date_showing = false;
		title_view.add(label);
		
		var sanjiao = Ti.UI.createImageView({
			image : './images/sanjiao' + Ti.App.pic_sufix + ".png",
			width : 10,
			height : 5,
			top : 13,
			right: 0
		});
		if (Ti.App.ios7)
			sanjiao.image = "/images/sanjiao_pink.png";
		
		title_view.add(sanjiao);
		
		title_view.addEventListener("click", function(){
			if (date_showing)
				return;
			
			date_showing = true;
			var PickerView = require('lib/picker_view');
			var picker_view = PickerView.create_picker_view(date_picker, function(){
				date_showing = false;
				Ti.App.fireEvent("show_write_date", {date: date_str(date_picker.value)});
			}, 
			function(){
				date_picker.value = new Date();
				Ti.App.fireEvent("show_write_date", {date: date_str(new Date())});
				date_showing = false;
			},
			"今天");
	
			win.add(picker_view);
			picker_view.animate(PickerView.picker_slide_in);
		});
		
		win.titleControl = title_view;
		
		if (Ti.App.is_android && win.android_button){
			win.android_button.title = str + " ▼";
		}
	}
	
	function already_login(){
		//重置kinds
		kinds = new Array();
		
		if (!kid){					//没宝宝
				var label1 = Ti.UI.createLabel({
						text: "输入宝宝生日发现惊喜内容",
						textAlign: "center",
						font: {fontSize: __l(22), fontWeight: "bold"},
						top: __l(140),
						left: __l(10),
						right: __l(10),
						height: Ti.UI.SIZE,
						color: "#666"
				});
				var button = Ti.UI.createButton({
							top: __l(230),
							left: (Ti.App.platform_width-__l(180))/2,
							right : (Ti.App.platform_width-__l(180))/2,
							height: __l(44),
							width: __l(180),
							title: '输   入',
							font: {
								fontSize: __l(20)
							}
				});
				button.addEventListener("click", function(e){
						var kid_win = Titanium.UI.createWindow({
							url : "profile_kid.js",
							title : "宝宝资料录入",
							from_write: true,
							json : {},
							model: true,
							backgroundColor : '#fff'
						});
						pre(kid_win);
						add_default_action_bar(win, win.title, true);
						kid_win.backButtonTitle = "";
						if (Ti.App.is_android){
							kid_win.no_back = true;
							Ti.App.currentTabGroup.activeTab.open(kid_win, {
								animated : true
							});
						}
						else{
							setTimeout(function(e){
								kid_win.open({modal: true});
							}, 600);
						}
				});
				pre_btn(button);
				win.add(label1);
				win.add(button);
					
				return;
		}
		
		//12个选择图标的容器
		var scrollableView = null;
		
		var container_wrapper = null;
		
		var tipLabel = Ti.UI.createLabel({
				text: "请稍候，正在加载...",
				top: __l(120),
				zIndex: 0,
				left: __l(30),
				right: __l(30),
				height: Ti.UI.SIZE,
				textAlign: 'center',
				color: '#ccc',
				font : {
						fontSize : __l(18)
				}
		});
		win.add(tipLabel);
		
		function make_icon(kind, kind_cn){
			var kind = Ti.UI.createView({
							left : __l(12),
							right: __l(12),
							top : __l(10),
							width : __l(49),
							height : __l(49),
							kind : kind,
							kind_cn : kind_cn,
							backgroundImage : "/images/kind/" + kind + "-a@2x.png",
							image_select: "/images/kind/" + kind + "@2x.png",
							image_unselect: "/images/kind/" + kind + "-a@2x.png",
							hires : true
			});
			return kind;
		}
		
		//判断是否显示某录入类型，且自动点击第一个
		function filter_kinds_icon(){
			if (scrollableView)
				win.remove(scrollableView);
			if (container_wrapper)
				win.remove(container_wrapper);
			scrollableView = null;
			container_wrapper = null;
			scrollableView = Titanium.UI.createScrollView({
			    backgroundImage: "images/bj.png",
			    contentWidth:'auto',
				contentHeight: __l(66),
				top:0,
				left: 0,
				right: 0,
				height: __l(66),
				zIndex: 10,
				showVerticalScrollIndicator:false,
				showHorizontalScrollIndicator:false,
				layout: "horizontal",
				horizontalWrap : false
			});
			
			container_wrapper = Ti.UI.createScrollableView({
				top: __l(66),
				left: 0,
				bottom: 0,
				backgroundColor: "white",
				right: 0,
				opacity: 0,
				width: Ti.App.platform_width,
				visible: false,
				zIndex: 10
			});
			if (win.alread_has_action_bar){
				scrollableView.top = __l(44);
				container_wrapper.top = __l(44) + __l(66);
			}
			
			if (!Ti.App.is_android){
				container_wrapper.height = __l(500);
			}
			
			container_wrapper.addEventListener("scrollEnd", function(e){
				if (e.currentPage >= 0 && e.currentPage < container_wrapper.views.length)
					button_press(e.currentPage);
			});
			
			var record = select_one_step(kid_birthday, today_str);
			if (!record.blank && record.functions){			//有常规记录
				var data = ["shanguang", "fayu", "yingyang", "zaojiao" ];
				var data_hash = {"shanguang" : '闪光时刻', "fayu" : "宝宝发育", "yingyang" : "养育贴士", "zaojiao" : "成长早教"};
				var view_index = 0;
				for(var i=0; i<data.length; i++){
					if (record.functions.indexOf(data_hash[data[i]]) >= 0){
						var icon = make_icon(data[i], data_hash[data[i]]);
						icon.view_index = view_index;
						view_index += 1;
						var view = make_remind_view(data[i], data_hash[data[i]]);
						scrollableView.add(icon);
						container_wrapper.addView(view);
						icon.addEventListener("click", function(e){
							container_wrapper.scrollToView(e.source.view_index);
						});
					}
				}
				
				var data = ["caiyi", "biaoqing", "bbyulu", "shijian"];
				var data_hash = {"caiyi" : '才艺本领', "biaoqing" : "表情心绪", "bbyulu" : "宝宝语录", "shijian" : "事件活动"};
				for(var i=0; i<data.length; i++){
					if (record.functions.indexOf(data_hash[data[i]]) >= 0){
						var icon = make_icon(data[i], data_hash[data[i]]);
						icon.view_index = view_index;
						view_index += 1;
						var view = make_template_view(data[i], data_hash[data[i]]);
						scrollableView.add(icon);
						container_wrapper.addView(view);
						icon.addEventListener("click", function(e){
							container_wrapper.scrollToView(e.source.view_index);
						});
					}
				}
			}
			else{
				//备孕期
				if (date_from_str(kid_birthday).getTime() > date_from_str(today_str).getTime() + 1000*3600*24*280){
					var data = ["biaoqing", "shijian"];
					var data_hash = {"biaoqing" : "表情心绪", "shijian" : "事件活动"};
					for(var i=0; i<data.length; i++){
							var icon = make_icon(data[i], data_hash[data[i]]);
							icon.view_index = i;
							var view = make_template_view(data[i], data_hash[data[i]]);
							scrollableView.add(icon);
							container_wrapper.addView(view);
							icon.addEventListener("click", function(e){
								container_wrapper.scrollToView(e.source.view_index);
							});
					}
				}
				else{			//过了6岁
					var data = ["caiyi", "biaoqing", "bbyulu", "shijian"];
					var data_hash = {"caiyi" : '才艺本领', "biaoqing" : "表情心绪", "bbyulu" : "宝宝语录", "shijian" : "事件活动"};
					for(var i=0; i<data.length; i++){
							var icon = make_icon(data[i], data_hash[data[i]]);
							icon.view_index = i;
							var view = make_template_view(data[i], data_hash[data[i]]);
							scrollableView.add(icon);
							container_wrapper.addView(view);
							icon.addEventListener("click", function(e){
								container_wrapper.scrollToView(e.source.view_index);
							});
					}
				}
			}
			
			win.add(container_wrapper)
			win.add(scrollableView)
			
			container_wrapper.show()
			
			container_wrapper.animate({opacity: 1, duration: 700})
			
			container_wrapper.fireEvent("scrollEnd", {currentPage: 0})			
		}
			
		//点击记录方式图标的效果	
		function button_press(index){
			for(var i=0; i<scrollableView.children.length; i++){
				if (i != index)
					scrollableView.children[i].backgroundImage = scrollableView.children[i].image_unselect;
			}
			scrollableView.children[index].backgroundImage = scrollableView.children[index].image_select;	
			
			if (index > 2){
				scrollableView.scrollTo(index*__l(72)-__l(124), 0);
			}
			else{
				scrollableView.scrollTo(0, 0);
			}
		}
		
		//4个常规记录的界面
		function make_remind_view(kind, kind_cn){
				var container = Ti.UI.createScrollView({
					contentWidth:'auto',
					contentHeight:'auto',
					showVerticalScrollIndicator:true,
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					backgroundColor: "white",
					width: Ti.App.platform_width,
					layout: "vertical"
				});
				
				if (kind_cn){
					var record = select_one_tip(kind_cn, kid_birthday, today_str);
					if (!record.blank){
						var tipBack = Ti.UI.createView({
							top: Ti.App.is_ipad ? 20 : __l(3),
							bottom: Ti.App.is_ipad ? 20 : __l(6),
							left: __l(4),
							right: __l(4),
							height: Ti.UI.SIZE,
							borderRadius: __l(10),
						});
						
						var title = record.title;
						if (title.indexOf("|") > 0){
							if (kid.gender == 'w'){
								title = record.title.split("|")[1];
							}
							else{
								title = record.title.split("|")[0];
							}
						}
						var tipLabel = Ti.UI.createLabel({
							text: "本周" + kind_cn + "：" + title,
							top: __l(6),
							left: __l(6),
							right: __l(5),
							bottom: __l(6),
							height: Ti.UI.SIZE,
							color: '#333',
							//height: 'auto',
							font : {
								fontSize : __l(16)
							},
							back_text: title
						});
						
						var hintLabel = Ti.UI.createLabel({
							text: "宝宝发育存在个体差异，内容仅供参考(版权所有)",
							top: Ti.App.is_android ? __l(8) : __l(4),
							left: __l(6),
							right: __l(10),
							bottom: __l(2),
							height: 'auto',
							font : {
								fontSize : __l(11)
							},
							color: "#666",
							textAlign: "right"
						});
						
						tipBack.add(tipLabel);
						var tableview = Ti.UI.createTableView({
							backgroundColor:'transparent',
							rowBackgroundColor:'white',
							top: 0,
							height: Ti.UI.SIZE,
							scrollable: false
						});
						group_tableview(tableview);
						
						var options = record.options.split("\n");
						options.splice(0, 0, title);
						
						var header = Ti.UI.createView({
							backgroundColor: "#F5F5F5",
							height: __l(20)
						});
						header.add(Ti.UI.createLabel({
								text: "记录一下吧",
								left: __l(10),
								color: "#333",
								font: {
									fontSize: __l(13)
								}
						}));
							
						var section = Ti.UI.createTableViewSection({
								height: __l(20),
								headerView : header
						});
						if (!Ti.App.is_android){
							tableview.appendSection(section);
						}
						
						for(var i=0; i<options.length; i++){
							if (options[i].replace(/(^\s*)|(\s*$)/g, "").length < 2){
								continue;
							}
							
							if (options[i].replace(/(^\s*)|(\s*$)/g, "").indexOf("复制上文") > -1){
								continue;
							}
							
							var row = Ti.UI.createTableViewRow({
								back_title: "#" + kind_cn + "#" + (options[i].replace(/(^\s*)|(\s*$)/g, "").indexOf("复制上文") > -1 ? title : options[i]),
								//height: Ti.App.is_android ? __l(42) : Ti.UI.SIZE,
								height: Ti.UI.SIZE,
								selectedBackgroundColor: "#E8E8E8",
								today_str: today_str,
								kind: kind,
								kind_cn: kind_cn,
							});
							
							var dian = Ti.UI.createView({
								top : __l(13),
								left : __l(6),
								width : __l(17),
								height : __l(17),
								hires : true,
								backgroundImage : "./images/pen" + Ti.App.pic_sufix + ".png",
								touchEnabled : false
							});
							var title = Ti.UI.createLabel({
								left : __l(28),
								right: __l(4),
								top : __l(9),
								bottom : __l(9),
								height: Ti.UI.SIZE,
								color: '#333',
								font : {
									fontSize : __l(18)
								},
								text : i==0 ? "#" + kind_cn + "#" + options[i].replace(/^s*|s*$/g, '').replace("\r", "").replace("\n", "") : options[i].replace(/^s*|s*$/g, '').replace("\r", "").replace("\n", ""),
								touchEnabled : false
							});
							
							var tou = Ti.UI.createView({
								top : __l(10),
								right: __l(12),
								width : __l(17),
								height : __l(17),
								hires : true,
								backgroundImage : "./images/pen" + Ti.App.pic_sufix + ".png",
								touchEnabled : false
							});
							
							row.add(dian);
							row.add(title);
							tableview.appendRow(row);
						}
						
						//container.add(tipBack)
						container.add(tableview);
						container.add(hintLabel);
						
						tableview.addEventListener("click", function(e){
								var now = new Date();
								var real_today = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
								var win_today_str = e.rowData.today_str;
								if (e.rowData.today_str == g_today_str && g_today_str != real_today){
									win_today_str = null;
									today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
									g_today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
								}
								
								var win1 = new WritePost({
									title : e.rowData.kind_cn ? "记录" + e.rowData.kind_cn : "编辑",
									backgroundColor : '#fff',
									text : e.rowData.back_title,
									today_str : win_today_str,
									from : e.rowData.kind
								});
								
								pre(win1);
								win1.backButtonTitle = '';
								Ti.App.currentTabGroup.activeTab.open(win1, {
									animated : true
								});
						});
					}
				}
				
				return container;
		}
		
		//4个模板记录的界面
		function make_template_view(kind, kind_cn){
				var container = Ti.UI.createView({
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					backgroundColor: "white",
					width: Ti.App.platform_width,
					layout: "vertical"
				});
				
				container.layout = "absolute";
				var pic = Ti.UI.createView({
					backgroundImage : "./images/template/switch/" + kind + "@2x.jpg",
					top: __l(10),
					hires: true,
					height: __l(222),
					width: __l(310)
				});
				
				var button = Ti.UI.createButton({
					top: __l(250),
					right : __l(40),
					hires: true,
					height: __l(36),
					width: __l(111),
					title: '马上记录',
					kind: kind,
					font: {
						fontSize: __l(15)
					}
				});
				button.addEventListener("click", function(e){
							var win1 = Titanium.UI.createWindow({
								url : "t_" + e.source.kind + ".js",
								kind : e.source.kind,
								backgroundColor : '#fff',
								from: e.source.kind,
								today_str : today_str,
								theme: "NoActionBar"
							});
							pre(win1);
							
							if (Ti.App.is_ipad || Ti.App.is_android){
								Ti.App.currentTabGroup.activeTab.open(win1, {
									animated : true
								});
							}
							else{
								win1.open({
									modal : true, navBarHidden : true
								});
							}
				});
				pre_btn(button);
				
				container.add(pic);
				container.add(button);
				
				return container;
		}
		
		filter_kinds_icon();
		
		win.filter_kinds_icon = filter_kinds_icon;
		
		//选择日期的滚轮
		var now = new Date();
		var minDate = new Date();
		
		var ts = kid_birthday.split("-");
		var year = ts[0];
		var month = ts[1];
		var day = ts[2];
		
		month = month - 11;
		if (month < 0){
			year -= 1;
			month += 12;
		}
		
		minDate.setFullYear(year);
		minDate.setMonth(month);
		minDate.setDate(day);
		
		var value = new Date();
		var ts = today_str.split('-');
		value.setFullYear(ts[0]);
		value.setMonth(ts[1]-1);
		value.setDate(ts[2]);	
		
	    date_picker = Ti.UI.createPicker({
			type:Ti.UI.PICKER_TYPE_DATE,
			minDate:minDate,
			maxDate: new Date(),
			value: value,
			visibleItems: 3,
			bottom: 0,
			width: Ti.App.platform_width,
			label: "补记宝宝的成长"
		});
		
		date_picker.addEventListener("change", function(e){
			date_picker.value = e.value;
		});
		
		setTimeout(function(){
			set_title_label();	
		}, 400);
	}
	
	function _show_write_date(e){
		today_str = e.date;
		
		//换日期了，要重置所有content
		for(var i=0; i<kinds.length; i++){
			kinds[i].container = null;
		}
	
		win.filter_kinds_icon();
		
		set_title_label();
	}				
	Ti.App.addEventListener('show_write_date', _show_write_date);
	
	//切换需要记录的宝宝
	function switch_baby(id){
		Ti.App.Properties.setString("current_kid_id", id + "");
		calc_kid();
		set_title_label();
		
		clear_window(win);
		
		already_login();
		
		Titanium.App.fireEvent('switch_baby');
	}
	
	function show_switch_baby_dlg(){
		var options = [];
		for(var i=0; i<kids.length; i++){
			options.push(kids[i].name);
		}
		options.push("取消")
		var optionsDialogOpts = {
			title: "请选择想记录的宝宝",
			options : options,
			cancel : options.length-1
		};
	
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
		dialog.addEventListener("click", function(e){
			if (e.index >= kids.length)
				return;
					
			switch_baby(kids[e.index].id);
		});
		dialog.show();
	}
	
	win.addEventListener("open", function(e){
		calc_kid();
		
		if (Ti.App.is_android){
			win.activity.onCreateOptionsMenu = function(e) { 
				if (kid && kid.birthday){
						var desc = detail_age_for_birthday(kid.birthday, today_str);
						str = kid.name + desc;
						if (desc == "备孕期"){
							str = desc;
						}
					
						//孕期不显示孩子昵称
						if (desc.indexOf("孕") == 0){
							str = desc;
						}
					
						str = str + " ▼";
						var menu = e.menu; 
						
						var menuItem = menu.add({ 
							title : str, 
							showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS 
						}); 
						win.android_button = menuItem;
						menuItem.addEventListener("click", function(e) { 
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
										
										Ti.App.fireEvent("show_write_date", {date: date_str(e.value)});
									}
								}, 
								okButtonTitle: '确定', 
								title: '请选择想补记日期',
								maxDate: maxDate
							});
						});
						
						//如果有多个宝宝
						if (kids.length > 1){
							var menuSwitch = menu.add({ 
								title : "切换", 
								icon : '/images/switch@' + Ti.App.logicalDensityFactor + 'x.png',
								showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS 
							}); 
							menuSwitch.addEventListener("click", function(e){
								show_switch_baby_dlg();
							});
						}
				}
			};	
		}
		else{
			if (kids.length > 1){
				var switchButton = Ti.UI.createButton({ 
					backgroundImage: '/images/switch2.png',
					width: 26,
					height: 26
				});
				switchButton.addEventListener("click", function(e){
					show_switch_baby_dlg();
				});
				win.setRightNavButton(switchButton);
			}
		}
					
		already_login();
	});

	function _write_temlate_post(e){
			file = Ti.Filesystem.getFile(e.filename);
			blob = file.read();
			
			var now = new Date();
			var real_today = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
			var win_today_str = today_str;
			if (today_str == g_today_str && g_today_str != real_today){
					win_today_str = null;
					today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
					g_today_str = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
			}
								
			var win1 = new WritePost({
				title : e.title,
				backgroundColor : '#fff',
				text : e.text,
				kind : e.kind,
				image : blob,
				from : e.kind,
				noaviary : true,
				today_str: win_today_str
			});
			
			if (!Ti.App.is_android)
				win1.showNavBar();
				
			pre(win1);
			win1.backButtonTitle = '';
			Ti.App.currentTabGroup.activeTab.open(win1, {
				animated : true
			});
	}
	Ti.App.addEventListener('write_template_post', _write_temlate_post);
	
	win.addEventListener("close", function(){
		Ti.App.removeEventListener('show_write_date', _show_write_date);
		Ti.App.removeEventListener('write_template_post', _write_temlate_post);	
	});
	
	add_default_action_bar(win, win.title, true);
	return win;
}

module.exports = Write;
