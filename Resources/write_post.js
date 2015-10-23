function WritePost(attr){
	Ti.include("public.js");
	var face_name = {"aini" : "爱你", "aixinchuandi" : "爱心传递","aoteman":"奥特曼","baobao":"抱抱", "xiaochou": "小丑", "numa": "怒骂", "shengbing": "生病", "xixi": "嘻嘻","bishi":"鄙视","bizui":"闭嘴","chanzui":"馋嘴","chijing":"吃惊","dahaqi":"打哈欠","ding":"顶","fengshan":"风扇","guzhang":"鼓掌","haha":"哈哈","haixiu":"害羞","han":"汗","hehe":"呵呵","heng":"哼","huaxin":"花心","jiong":"囧","keai":"可爱","kelian":"可怜","ku":"酷","kun":"困","landelini":"懒得理你","lazhu":"蜡烛","lei":"泪","maozi":"帽子","nu":"怒","muma":"怒骂","qian":"钱","qiaokeli":"巧克力","qinqin":"亲亲","shaozi":"哨子","shengbning":"生病","shiwang":"失望","shoutao":"手套","shouzhi":"手纸","shuai":"帅","shuai2":"衰","shuijiao":"睡觉","sikao":"思考","taikaixin":"太开心","touxiao":"偷笑","tu":"吐","wabikong":"挖鼻孔","weibo":"围脖","weiguan":"围观","weiqu":"委屈","xu":"嘘","xue":"雪","yiwen":"疑问","yun":"晕","zhi":"织","zhuakuang":"抓狂"};
	var imagefactory = require('ti.imagefactory');
	var win = Titanium.UI.createWindow(attr);
	
	var win = Titanium.UI.createWindow(attr);
	if (!Ti.App.is_android) {
		win.hideTabBar();
	}
	
	var wrapper = Ti.UI.createScrollView({
		left : 0,
		top : 0,
		right : 0,
		bottom : 0,
		contentWidth : Ti.App.platform_width,
		contentHeight : 'auto',
		width : Ti.App.platform_width,
		scrollingEnabled: false,
		showVerticalScrollIndicator : true
	});
	win.add(wrapper);
	Ti.App.addEventListener("keyboardframechanged", function(e){
		var y = e.keyboardFrame.y;
		if (e.keyboardFrame.y > 3000){
			y = y - parseInt((y/1000))*1000;
		}
		if (y > 2000){
			return;
		}
		
		if (y > Ti.App.platform_height)
			return;
		
		if (Ti.App.platform_height == y){
			wrapper.height = Ti.UI.FILL;
			wrapper.bottom = 0;
		}
		else
			wrapper.height = y - 64;
	});
	
	//将2012-1-1这样的日期转换成2012-01-01的格式
	function db_date(today_str){
		var ts = today_str.split('-')
		var year = ts[0]
		var month = parseInt(ts[1], 10)
		var date = parseInt(ts[2], 10)
		
		return year + "-" + (month<10 ? '0' + month : month) + '-' +(date<10 ? '0' + date : date)
	}
	
	function insert_draft(content, pic, kind){
		var now = new Date();
		var mili_seconds = now.getTime();
		Ti.App.db.execute('INSERT INTO drafts (user_id, content, pic, kind, created_at) VALUES (?,?,?,?,?)', user_id(), content, pic, kind, mili_seconds);
		Ti.API.log("insert draft");
		Ti.App.fireEvent("add_draft");
	}
	
	///////////////////图片处理//////////////////////////////////////
	if (!win.from){
		win.from = "wenzi"
	}
	
	//新浪微博token到期时间
	var expire_at = parseInt(Ti.App.Properties.getString("expire_at", ""));
	var expired = false;
	if (expire_at * 1000 < (new Date()).getTime())
		expired = true;
		
	expire_at = parseInt(Ti.App.Properties.getString("qzone_expire_at", ""));
	var qzone_expired = false;
	if (expire_at * 1000 < (new Date()).getTime())
		qzone_expired = true;
	
	var textarea = createEmojiTextArea({
		value : win.text.replace(/(^\s*)|(\s*$)/g, "")||"",
		height : __l(140),
		left : __l(1),
		right : __l(1),
		top : __l(2),
		textAlign : 'left',
		borderWidth : 0,
		borderColor : '#ccc',
		borderRadius : __l(5),
		backgroundColor : 'transparent',
		returnKeyType: Titanium.UI.RETURNKEY_DONE,
		font : {
			fontSize : __l(15)
		}
	});

	if (win.today_str && !is_today(win.today_str)){
		var ts = win.today_str.split('-')
		var d = ts[0] + "年" + parseInt(ts[1], 10) + '月' + parseInt(ts[2], 10) + '日，'
		
		var current_kid_id = Ti.App.Properties.getString("current_kid_id", "")
		var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id())
		if (!record.blank){
			var json = JSON.parse(record.json)
			if (json.user_kids.length > 0){
				kid = json.user_kids[0]
				kid_birthday = kid.birthday	
				
				if (current_kid_id != ""){
					for(var i=0; i<json.user_kids.length; i++){
						if (json.user_kids[i].id == parseInt(current_kid_id)){
							kid = json.user_kids[i]
							kid_birthday = kid.birthday
							break;
						}
					}
				}	
				d += kid_desc(kid, win.today_str)
			}
		}
		
		textarea.value = textarea.value + "（补记" + d + ")"
	}
	
	textarea.addEventListener("change", function(e) {
		//if(textarea.value.length > 140)
		//	textarea.value = textarea.value.substr(0, 140)
		title.text = 140 - textarea.value.length;
		if(textarea.value.length > 140){
			title.color = "red";
			title.show();
		}
		else{
			title.color = "#999";
			title.hide();
		}
		
		if(textarea.value.length == 0){
			done.enabled = false;
		}
		else{
			done.enabled = true;
		}
	});
	
	textarea.addEventListener(Ti.App.is_android ? "click" : "focus", function(e) {
		bottom_view.remove(face_view);
		face_view.visible = false;
	});
	
	textarea.addEventListener("focus", function(e){
		if (Ti.App.platform_height <= __l(480)){
			logo_container.height = 0;
			logo_container.hide();
			bottom_view.height = Ti.UI.SIZE;
			//logo_container.hide();
		}
	});
	
	textarea.addEventListener("blur", function(e){
		if (Ti.App.platform_height <= __l(480)){
			logo_container.height = Ti.UI.SIZE;
			logo_container.show();
			bottom_view.height = Ti.UI.SIZE;
		}
	});
	
	wrapper.add(textarea);
	
	var bottom_view = Ti.UI.createView({
		bottom: 0,
		height: Ti.UI.SIZE,
		left: 0,
		right: 0,
		layout: 'vertical',
		backgroundColor: 'white'
	});
	wrapper.add(bottom_view);
	
	var image_blobs = new Array(9); 
	var logo_container = Ti.UI.createView({
		top: 0,
		height: Ti.UI.SIZE,
		left: __l(0),
		right: __l(0),
		//backgroundColor: '#eee',
		layout: 'horizontal',
		image_count: 0
	});
	function add_pic(index, blob, path, is_video){
		if (is_video){
			if (logo_container.image_count > 0){
				show_alert("提示", "视频文件一次只能发一个");
				return;
			}
		}
		else if (logo_container.is_video){
			show_alert("提示", "一次只能发送一个视频文件");
			return;
		}
		
		var len = (Ti.App.platform_width - __l(70))/5;
		var logo = null;
		if (!is_video)
			logo = imagefactory.imageAsThumbnail(blob, {size: len*2});
		
		if (logo_container.select_pic){
			logo_container.remove(logo_container.select_pic);
		}
		
		var pic = Ti.UI.createImageView({
			image: is_video ? "/images/compose_photo_video_highlighted.9.png" : logo,		
			hires: true,
			width: len,
			height: len,
			top: __l(4),
			bottom: __l(4),
			left: __l(10),
			index: index,
			path : path
		});
		pic.addEventListener("click", function(e){
			var optionsDialogOpts = {
				options:['预览', '替换', '删除', '取消'],
				cancel:3
			};
			
			var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
			dialog.addEventListener('click',function(e1)
			{
				if (e1.index == 0){
					if (is_video){
						Ti.App.fireEvent("playVideo", {
							url : e.source.path,
							win : win,
						});
					}
					else{
						var w = Titanium.UI.createWindow({
							backgroundColor : '#fff',
							title: "预览",
							backButtonTitle: ''
						});
						
						var imageView = Titanium.UI.createImageView({
							image : image_blobs[e.source.index],
							top : 0,
							left : 0,
							right : 0,
							bottom : 0,
							hires : true
						});
						w.add(imageView);
						
						pre(w);
						add_default_action_bar(w, win.title, true);
						Ti.App.currentTabGroup.activeTab.open(w, {
							animated : true
						});
					}
				}
				else if (e1.index == 1){		//替换
					if (is_video){
						select_video(win, function(image, path){
							image_blobs[e.source.index] = blob;
							pic.path = path;
						}, function(){
							
						});
					}
					else{
						select_photo(false, function(image, path){
							var blob = imagefactory.imageAsThumbnail(image, {size: len*2});
							image_blobs[e.source.index] = image;
							e.source.image = blob;
						}, function(){
								
						});
					}
				}
				else if (e1.index == 2){	//删除
					logo_container.remove(e.source);
					image_blobs.splice(index, 1);
					image_blobs.push(null);	
					logo_container.image_count -= 1;	
					if (logo_container.image_count == 0){
						clear_window(logo_container);
					}			
					else if (logo_container.image_count == 8){
						var select_pic = Ti.UI.createButton({
							backgroundImage: "/images/compose_pic_add.png",
							backgroundSelectedImage: "/images/compose_pic_add_highlighted.png",		
							hires: true,
							width: len,
							height: len,
							top: __l(4),
							bottom: __l(4),
							left: __l(10)
						});
						select_pic.addEventListener("click", function(e){
							select_photo(false, function(image, path){
								logo_container.remove(e.source);
								select_picture_callback(image, path);
							}, function(){
									
							});
						});
						logo_container.add(select_pic);
					}
				}
			});
			dialog.show();
		});
		image_blobs[index] = blob;
		if (index >= logo_container.image_count)
			logo_container.image_count += 1;
			
		if (is_video)
			logo_container.is_video = true;
		
		logo_container.add(pic);
		
		if (!is_video && index == logo_container.image_count -1 && index < 8){
			var select_pic = Ti.UI.createButton({
				backgroundImage: "/images/compose_pic_add.png",
				backgroundSelectedImage: "/images/compose_pic_add_highlighted.png",		
				hires: true,
				width: len,
				height: len,
				top: __l(4),
				bottom: __l(4),
				left: __l(10)
			});
			logo_container.select_pic = select_pic;
			select_pic.addEventListener("click", function(e){
				select_photo(false, function(image, path){
					logo_container.remove(e.source);
					logo_container.select_pic = null;
					select_picture_callback(image, path);
				}, function(){
						
				});
			});
			logo_container.add(select_pic);
		}
	}
	
	bottom_view.add(logo_container);
	
	var ind_container = Ti.UI.createView({
		top: 0,
		left: 0,
		right: 0,
		height: Ti.UI.SIZE
	});
	bottom_view.add(ind_container);
	
	var icon_container = Ti.UI.createView({
		top: 0,
		height: Ti.UI.SIZE,
		left: 0,
		right: 0,
		backgroundColor: '#eee'
	});
	bottom_view.add(icon_container);
	
	var image_button = Titanium.UI.createView({
		top : __l(13),
		bottom: __l(10),
		left : __l(10),
		height : __l(20),
		width : __l(28),
		hires : true,
		backgroundImage : "images/Photo@2x.png"
	});
	
	function select_video_callback(image, path){
		Ti.API.log(image.length)
		
		if (image.length>30000000){
			show_alert("对不起", "亲，您的视频超过30M啦！");
			return;
		}
		else{
			add_pic(logo_container.image_count, image, path, true);
		}
			
	}
	
	function select_picture_callback(image, path){
		add_pic(logo_container.image_count, image, path, false);
		return;
	}
	
	image_button.addEventListener("click", function() {
		if (logo_container.image_count == 9){
			show_alert("提示", "选择图片数太多了");
			return;
		}
			
		var optionsDialogOpts = {
			options:['选择视频', '选择图片', '取消'],
			cancel:2
		};
		
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
		dialog.addEventListener('click',function(e)
		{
			if (e.index == 0){		//拍摄照片
				select_video(win, select_video_callback, function(){
					textarea.focus();
				});
			}
			else if (e.index == 1){
				select_photo(false, select_picture_callback, function(){
					textarea.focus();
				});
			}
			else if (e.index == 2){
				textarea.focus();
			}
		});
		textarea.blur();
		dialog.show();
	});
	
	icon_container.add(image_button);
	
	//根据传入图片的长宽调整图片按钮高度
	function adjust_image_select(blob){
		if (blob.width)
			image_select.height = parseInt(image_select.width * blob.height / blob.width)
	}
	
	var show_face = Titanium.UI.createView({
		top : __l(10),
		bottom: __l(10),
		left : __l(48),
		height : __l(25),
		width : __l(26),
		hires : true,
		backgroundImage : "images/xiaolian@2x.png"
	});
	
	var face_view = Titanium.UI.createScrollView({
		top : __l(0),
		bottom: __l(0),
		left : 0,
		right : 0,
		height: __l(180),
		//bottom : 0,
		visible: false,
		backgroundColor : "#eee",
		layout : 'horizontal',
		contentWidth : Ti.App.platform_width,
		contentHeight : 'auto',
		top : 0,
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false
	});
	
	show_face.addEventListener("click", function(e) {
		if (face_view.children.length == 0)
			add_faces();
		
		if(face_view.visible) {
			textarea.focus();
			bottom_view.remove(face_view);
			face_view.visible = false;
		} else {
			textarea.blur();
			setTimeout(function(){
				bottom_view.add(face_view);
				face_view.visible = true;
			}, 540);
		}
	});
	
	icon_container.add(show_face);
	
	var title = Ti.UI.createLabel({
		right : __l(106),
		top: __l(15),
		textAlign : "center",
		height : 'auto',
		color: '#999',
		font : {
			fontSize : __l(13)
		},
		text : "140"
	});
	icon_container.add(title);
	
	var sync = Ti.UI.createLabel({
		right : __l(74),
		top : __l(10),
		textAlign : "right",
		height : __l(26),
		width : __l(46),
		font : {
			fontSize : __l(13)
		},
		color: "#333",
		text : "同步"
	});
	icon_container.add(sync);
	
	var sina_weibo = Titanium.UI.createView({
		top : __l(10),
		right : __l(42),
		height : __l(26),
		width : __l(26),
		hires : true,
		backgroundImage : "images/tb_sina_weibo@2x.png",
		image_select : "images/tb_sina_weibo@2x.png",
		image_unselect : "images/tb_sina_weibo2@2x.png",
		tb : true
	});
	icon_container.add(sina_weibo);
	
	var tencent_weibo = Titanium.UI.createView({
		top : __l(10),
		right : __l(8),
		height : __l(26),
		width : __l(26),
		hires : true,
		backgroundImage : "images/tb_tencent_weibo@2x.png",
		image_select : "images/tb_tencent_weibo@2x.png",
		image_unselect : "images/tb_tencent_weibo2@2x.png",
		tb : true
	});
	icon_container.add(tencent_weibo);
	
	var android_offset = Ti.App.is_android ? __l(7) : 0;
	var CheckBox = require("lib/checkbox").CheckBox;
	var private_check = new CheckBox({
		top: __l(4),
		height: __l(40),
		width: __l(40),
		left : __l(80)
	});
	
	var private_tip = Ti.UI.createLabel({
		left : __l(112),
		top : __l(10),
		textAlign : "left",
		height : __l(26),
		width : __l(90),
		font : {
			fontSize : __l(13)
		},
		color: "#333",
		text : "仅自己可见"
	});
	private_tip.addEventListener("click", function(e){
		private_check.view.fireEvent("click");
	});
	icon_container.add(private_check.view);
	icon_container.add(private_tip);
	
	
	var json = user_json();
	
	if(Ti.App.Properties.getString("token", '').length == 0 || expired) {			//没有授权或授权已经过期
		sina_weibo.backgroundImage = sina_weibo.image_unselect;
		sina_weibo.tb = false;
	}
	if(Ti.App.Properties.getString("tencent_token", '').length == 0) {
		tencent_weibo.backgroundImage = tencent_weibo.image_unselect;
		tencent_weibo.tb = false;
	}
	
	sina_weibo.addEventListener("click", function(e) {
		if(e.source.tb) {
			e.source.tb = false;
			e.source.backgroundImage = e.source.image_unselect;
		} else {
			if(Ti.App.Properties.getString("token", '').length > 0 && !expired) {
				e.source.tb = true;
				e.source.backgroundImage = e.source.image_select;
			} else {
				textarea.blur();
				var win = Titanium.UI.createWindow({
					url : "sina.js",
					title : "绑定新浪微博",
					backgroundColor : '#fff',
					backButtonTitle: '',
					id : user_id()
				});
	
				var b = Titanium.UI.createButton({
					title : '关闭',
				});
				if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
					win.setRightNavButton(b);
				}
				b.addEventListener('click', function() {
					win.close();
				});
				pre(win)
				Ti.App.currentTabGroup.activeTab.open(win, {
					animated : true
				});
			}
		}
	});
	
	function sina_login(e){
		sina_weibo.tb = true;
		sina_weibo.backgroundImage = sina_weibo.image_select;
		setTimeout(function() {
			textarea.focus();
		}, 500);
	}
	Titanium.App.addEventListener('sina_login', sina_login);
	
	function tencent_login(e){
		tencent_weibo.tb = true;
		tencent_weibo.backgroundImage = tencent_weibo.image_select;
		setTimeout(function() {
			textarea.focus();
		}, 500);
	}
	Titanium.App.addEventListener('tencent_login', tencent_login);
	
	tencent_weibo.addEventListener("click", function(e) {
		if(e.source.tb) {
			e.source.tb = false;
			e.source.backgroundImage = e.source.image_unselect;
		} else {
			if(Ti.App.Properties.getString("tencent_token", '').length > 0) {
				e.source.tb = true;
				e.source.backgroundImage = e.source.image_select;
			} else {
				textarea.blur();
				var win = Titanium.UI.createWindow({
					url : "tencent.js",
					title : "绑定腾讯微博",
					backgroundColor : '#fff',
					backButtonTitle: '',
					id : user_id()
				});
	
				var b = Titanium.UI.createButton({
					title : '关闭',
				});
				if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
					win.setRightNavButton(b);
				}
				b.addEventListener('click', function() {
					win.close();
				});
				pre(win);
				Ti.App.currentTabGroup.activeTab.open(win, {
					animated : true
				});
			}
		}
	});
	
	var done = Titanium.UI.createButton({
		title : "发送"
	});
	
	if (!Ti.App.is_android)
		win.setRightNavButton(done)
		
	done.addEventListener("click", function() {
		if (!textarea.value || textarea.value.length == 0){
			show_alert("提示", "请输入文字");
			return;
		}
		
		if (textarea.value.length > 140){
			show_alert("提示", "字符超出长度了");
			return;
		}
		
		if (win.need_picture && logo_container.image_count==0){
			show_alert("提示", "亲，此处须配图哦");
			return;
		}
		
		if (win.need_sina && !sina_weibo.tb){
			show_alert("提示", "亲，您必须同步到新浪微博哦");
			return;
		}
		
		if (win.need_tencent && !tencent_weibo.tb){
			show_alert("提示", "亲，您必须同步到腾讯微博哦");
			return;
		}
		
		if (win.need_tb && !sina_weibo.tb && !tencent_weibo.tb){
			show_alert("提示", "亲，您必须同步到新浪或腾讯微博哦");
			return;
		}
		
		textarea.blur();
		
		var user_post_kid_id = null;
		var current_kid_id = Ti.App.Properties.getString("current_kid_id", "")
		if (current_kid_id.length > 0)
		{
			var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id())
		
			if (!record.blank){
				var json = JSON.parse(record.json)
				if (json.user_kids.length > 0 && parseInt(json.user_kids[0].id) != parseInt(current_kid_id)){
					user_post_kid_id = true
				}
			}
		}
		
		var ind = Titanium.UI.createProgressBar({
			left: __l(30),
			right: __l(30),
			min:0,
			max:1,
			value:0,
			height:__l(26),
			color:'#888',
			top: __l(0),
			bottom: Ti.App.is_android ? __l(16) : __l(10)
		});
		if (!Ti.App.is_android){
			ind.style = Titanium.UI.iPhone.ProgressBarStyle.PLAIN;
		}
		ind.hide();
		
		if (logo_container.image_count > 0){
			ind_container.add(ind);
			ind.show();	
		}
		
		var xhr = Ti.Network.createHTTPClient();
		xhr.timeout = Ti.App.timeout;
		
		xhr.onsendstream = function(e) {
				ind.value = e.progress;
		};
		xhr.onerror = function(e) {
				hide_loading();
				show_notice("发送失败，已存到草稿箱。");
				done.enabled = true;
				ind.hide();
				insert_draft(textarea.value, logo_container.image_count > 0 ? image_blobs[0] : null,  win.from);
				logEvent('write_failed');
		};
		xhr.onload = function() {
				hide_loading();
				
				Ti.API.log(this.responseText);
				
				if (this.responseText == "ok" || this.responseText == "error"){
					if (win.title == "参与话题" && textarea.value.length < 15){
						show_alert("提示", "不足15个字，不能参与热点话题哦！");
					}
					else{
						show_alert("提示", "请不要重复提交或太频繁提交。");
					}
					
					return;
				}
				
				if (this.responseText.length > 0 && this.responseText[0] != "{"){
					show_alert("提示", this.responseText);
					return;
				}
				
				var json = JSON.parse(this.responseText);
				today_str = win.today_str;
				if (!today_str)
					today_str = date_str(new Date());
				
				require('/lib/mamashai_db').db.delete_one_json("calendar_posts" + user_id(), db_date(today_str));
				
				if (win.title == "邀请微博好友"){
					win.close();
					show_notice("邀请成功！");
				}
				else if (win.title == "意见反馈"){
					win.close();
					show_notice("反馈意见成功！");
				}
				else if (win.title == "参与话题"){
					win.close();
					show_notice("谢谢您的参与！");
				}
				else if (win.title == "分享照片书"){
					win.close();
					show_notice("分享照片书成功！");
				}
				else{
					var alert_dialog = Titanium.UI.createAlertDialog({
						message:'成功记录！',
						buttonNames: ['去看看', '不必了'],
					});
					alert_dialog.addEventListener("click", function(e){
						win.close();
						if (e.index == 0){
							show_window("user", {
								id: user_id(),
								title: "记录空间",
								index: 2
							});
						}
					});
					alert_dialog.show();
				}
				
				if (win.draft){
					Ti.App.fireEvent("delete_draft", {tag: win.draft});
				}	
				
				logEvent('write_success');
		};
		
		done.enabled = false;
		
		var url = Ti.App.mamashai + "/api/statuses/" + (logo_container.image_count > 0 ? "upload" : "update") + ".json?from=" + win.from + "&status=" + encodeURI(textarea.value) + "&" + account_str();
		if(!sina_weibo.tb) {
			url += "&sina_weibo_id=-1";
		}
		if(!tencent_weibo.tb) {
			url += "&tencent_weibo_id=-1";
		}
		if(win.today_str && !is_today(win.today_str)) {
			url += "&created_at=" + win.today_str;
		}	
		if (user_post_kid_id){
			url += "&kid_id=" + current_kid_id;
		}
		if (win.from_id){
			url += "&from_id=" + win.from_id;
		}
		if (private_check.value() == 1){
			url += "&is_private=" + private_check.value();
		}
			
		url = url.replace(/#/g, '%23');
		xhr.open('POST', url);
		
		if(logo_container.image_count > 0) {
			if (logo_container.is_video){					//有视频
				if (Titanium.Network.networkTypeName != "WIFI"){
					show_alert("提示", "亲，您提交的视频将会消耗大量网络带宽。请切换到WIFI网络后提交。");
					return;
				}
				
				xhr.timeout = 1000*60*4;			//加入了视频以后超时时间变成4分钟
				
				try{
					xhr.send({
						video : image_blobs[0]
					});
				}
				catch(e){
					show_alert("对不起", "手机内存不足， 请试试更短的视频。");
				}
				
			}
			else{
				var pics = {};
				for(var i=0; i<logo_container.image_count; i++){
					pics["pic" + i] = image_blobs[i];
				}
				xhr.send(pics);
				//xhr.send({
				//	pic : image_select.file_blob
				//});
			}
		} else {
			xhr.send();
		}
		
		if (!Ti.App.is_android){
			show_loading("正在保存");
		}
	});
	
	win.addEventListener("open", function(event, type) {
		textarea.setSelection(textarea.value.length, textarea.value.length);
		
		if(win.image) {
				add_pic(logo_container.image_count, win.image, null, false);
				textarea.focus();				
		}
		else{
				if (win.is_video){
					select_video(win, select_video_callback, function(){
						
					});
				}
				textarea.focus();
		}
			
		textarea.fireEvent("change");
	});
	
	function add_faces() {
		var faces = "👏 💖 😄 👍 👄 😊 🌹 🎁 😍 😘 😜 😁 😔 😢 😂 😭 😅 😱 😡 😷 😲 😏 👼 👸 💤 💨 👌 🙏 💪 👑 💕 💘 💎 🌻 🍁 🍄 🌴 ☀ ⛅ ⚡ ❄ 🌈 🍦 🎂 🍭".split(" ");
		function face_click(e) {
				textarea.value += e.source.text;
				textarea.fireEvent("change");
				if (Ti.App.is_android){
					textarea.focus();
					textarea.setSelection(textarea.value.length, textarea.value.length);
				}
		};

		function touch_start(e){
			e.source.backgroundColor = "#ccc";
		}
		function touch_end(e){
			e.source.backgroundColor = "transparent";
		}
		show_loading();
		for(var i=0; i<faces.length; i++){
			var c = faces[i];
			var label = createEmojiLabel({
				top: __l(4),
				bottom: __l(4),
				left: __l(7),
				width: __l(28),
				height: __l(28),
				borderRadius: __l(4),
				textAlign: 'center',
				color: 'black',
				font: {
					fontSize: __l(22)
				},
				text: c
			});
			if (!Ti.App.is_android){
				label.font = {fontSize: __l(28)};
			}
				
			label.addEventListener("click", face_click);
			label.addEventListener("touchstart", touch_start);
			label.addEventListener("touchend", touch_end);
			label.addEventListener("touchcancel", touch_end);
			face_view.add(label);
		}
		hide_loading();
	}
	
	if (Ti.App.is_android){
		add_default_action_bar2(win, win.title, Ti.Android.R.drawable.ic_menu_upload, function(){
			done.fireEvent("click");
		});
	}
	
	logEvent('write', {kind: win.kind});
	
	win.addEventListener("close", function(){
		Titanium.App.removeEventListener('sina_login', sina_login);
		Titanium.App.removeEventListener('tencent_login', tencent_login);
	});
	
	return win;
}

module.exports = WritePost;
