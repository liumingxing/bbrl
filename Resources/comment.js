function Comment(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	
	var done = Ti.UI.createButton({
			title : '发送'
	});
	
	if (!Ti.App.is_android)
			win.setRightNavButton(done);
	else
		add_default_action_bar2(win, win.title, Ti.Android.R.drawable.ic_menu_upload, function(){
			done.fireEvent("click");
		});
	
		var wrapper = Ti.UI.createView({
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			height: Ti.UI.SIZE
		});
		win.add(wrapper);
		
		var title = Ti.UI.createLabel({
			width : __l(200),
			right : __l(50),
			top : __l(132),
			textAlign : "right",
			height : 'auto',
			font : {
				fontSize : __l(13)
			},
			visible : false,
			color: "red",
			text : "还可以输入140字"
		});
		
		var textarea = createEmojiTextArea({
			value : win.text||"",
			height : __l(116),
			left : __l(8),
			right : __l(8),
			top : __l(8),
			textAlign : 'left',
			borderWidth : 1,
			borderColor : '#ccc',
			borderRadius : __l(0),
			returnKeyType: Titanium.UI.RETURNKEY_DONE,
			backgroundColor : 'transparent',
			font : {
				fontSize : __l(15)
			}
		});
		textarea.addEventListener(Ti.App.is_android ? "click" : "focus", function(e){
			face_view.hide();
		});
		textarea.addEventListener("change", function(e) {
			if (textarea.value){
				if(textarea.value.length > 140){
					title.text = 140 - textarea.value.length;
					title.show();
				}
				else{
					title.hide();
				}	
			}
			
			if(!textarea.value || textarea.value.length == 0){
				done.enabled = false;
			}
			else{
				done.enabled = true;
			}
		});
		
		var CheckBox = require("lib/checkbox").CheckBox
		var check = new CheckBox({
			top: __l(120),
			height: __l(40),
			width: __l(40),
			left: 1
		})
		
		var check_tip = Ti.UI.createLabel({
			top : __l(132),
			textAlign : "left",
			height : __l(16),
			left : __l(38),
			font : {
				fontSize : __l(13)
			},
			color: "#333",
			text : "转晒到我的记录"
		});
		
		check_tip.addEventListener("click", function(e){
			check.view.fireEvent("click");
		});
		
		var tip = createEmojiLabel({
			right : __l(20),
			top : __l(156),
			textAlign : "left",
			height : __l(16),
			left : __l(8),
			font : {
				fontSize : __l(12)
			},
			color: "#333",
			text : "回复:" + (win.json && win.json.content ? win.json.content : win.o_content)
		});
		
		wrapper.add(title);
		wrapper.add(textarea);
		
		if (win.t != 'article' && win.t != 'album'){
			wrapper.add(check.view)
			wrapper.add(check_tip)
		}
		
		if (win.json && win.json.content || win.o_content)
			wrapper.add(tip)
		
		done.addEventListener("click", function() {
			if (textarea.value.length == 0){
				show_alert("提示", "请输入内容");
				return;
			}
			
			if (textarea.value.length > 140){
				show_alert("提示", "内容超出长度了");
				return;
			}
			
			textarea.blur();
			
			var url = Ti.App.mamashai + "/api/statuses/comment?from=calendar&id=" + win.id + "&comment=" + encodeURI(textarea.value) + "&tp=" + win.t + "&is_copy_post=" + check.value() +"&" + account_str();
			if (win.t == 'article'){
				var url = Ti.App.mamashai + "/api/statuses/comment?id=" + win.id + "&comment=" + encodeURI(textarea.value) + "&tp=article&" + account_str();
			}
			if (win.reply_all){
				url += "&reply_all=true";
			}
			url = url.replace(/#/g, '%23');
			var xhr = Ti.Network.createHTTPClient();
			xhr.timeout = Ti.App.timeout;
			xhr.onerror = function() {
					hide_loading();
					show_timeout_dlg(xhr, url);
			};
			xhr.onload = function() {
					if (this.responseText[0] != "{"){
						show_alert(this.responseText);
						return;
					}
					
					var json = JSON.parse(this.responseText);
					hide_loading();
					
					if (win.json){
						Ti.App.fireEvent("add_comment", {id : win.json.id, json: json})
						Ti.App.fireEvent("update_post", {id: win.json.id, comment_count: win.json.comments_count+1, forward_count: win.json.forward_posts_count})
					}
					else{
						Ti.App.fireEvent("add_comment", {id : win.id, json: json})
					}
					
					win.finished = true;
					win.close();
					
					show_notice("评论成功！");
			};
			xhr.open('POST', url);
			xhr.send();
			show_loading("正在提交");
		});
		
		textarea.fireEvent("change")
		
		win.addEventListener("load", function(e){
			textarea.focus();
			textarea.setSelection(textarea.value.length, textarea.value.length);
		})
		
		var show_face = Titanium.UI.createImageView({
			top : __l(128),
			right : __l(8),
			height : __l(28),
			width : __l(30),
			hires : true,
			image : "images/xiaolian@2x.png"
		});
		
		show_face.addEventListener("click", function(e) {
			if (face_view.children.length == 0){
				show_loading()
				setTimeout(function(){
					face_view.hide();
					add_faces();
					face_view.show();
					hide_loading();
					textarea.blur();
				}, 50);
			}
			
			if(face_view.visible) {
				face_view.hide();
				textarea.focus();
				textarea.setSelection(textarea.value.length, textarea.value.length);
			} else {
				face_view.show();
				textarea.blur();
			}
		});
		
		wrapper.add(show_face);
		
		var face_view = Titanium.UI.createScrollView({
			contentHeight : 'auto',
			contentWidth: Ti.App.platform_width,
			showVerticalScrollIndicator : true,
			top : __l(178),
			left : 0,
			right : 0,
			bottom : 0,
			visible: false,
			width : Ti.App.platform_width,
			layout : 'horizontal'
		});
		face_view.hide();
		
		wrapper.add(face_view);
		
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
					font: {fontSize: __l(22)},
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
		}
		logEvent('comment');
	
	return win;
}

module.exports = Comment;