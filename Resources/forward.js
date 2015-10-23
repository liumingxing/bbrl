function Forward(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	
	var title = Ti.UI.createLabel({
		width : __l(200),
		right : __l(20),
		top : __l(8),
		textAlign : "right",
		height : 'auto',
		font : {
			fontSize : __l(13)
		},
		text : "还可以输入140字"
	});
	
	win.add(title);
	
	var textarea = createEmojiTextArea({
		value : "",
		height : __l(120),
		left : __l(6),
		right : __l(6),
		top : __l(30),
		textAlign : 'left',
		borderWidth : 1,
		borderColor : '#ccc',
		borderRadius : __l(5),
		backgroundColor : 'transparent',
		returnKeyType: Titanium.UI.RETURNKEY_DONE,
		font : {
			fontSize : __l(15)
		}
	});
	textarea.addEventListener("change", function(e) {
		if (textarea.value){
			if(textarea.value.length > 140)
				textarea.value = textarea.value.substr(0, 140)
			title.text = "还可以输入" + (140 - textarea.value.length) + "字";
		}
	})
	
	win.add(textarea)
	
	var CheckBox = require("lib/checkbox").CheckBox
	var check = new CheckBox({
		top: __l(146),
		height: __l(40),
		width: __l(40),
		left: 1
	})
	
	var check_tip = Ti.UI.createLabel({
		top : __l(158),
		textAlign : "left",
		height : __l(17),
		left : __l(38),
		right : __l(10),
		font : {
			fontSize : __l(13)
		},
		color: "#333",
		text : "同时评论给" + win.json.user.name
	});
	
	win.add(check.view)
	win.add(check_tip)
	
	if (win.json.forward_post){
		textarea.value = "//@" + win.json.user.name + ":" + win.json.content
	}
	
	var tip = createEmojiLabel({
		right : __l(20),
		top : __l(178),
		textAlign : "left",
		height : __l(16),
		left : __l(10),
		color: "#333",
		font : {
			fontSize : __l(12)
		},
		text: win.json.forward_post ? "原文:" + win.json.forward_post.content : "原文:" + win.json.content
	});
	
	win.add(tip)
	
	// Create a Button.
	var done = Ti.UI.createButton({
		title : '发送'
	});
	done.addEventListener("click", function() {
		textarea.blur();
		
		var value = encodeURI(textarea.value);
		if (!value || value == "")
			value = "转晒"
		url = Ti.App.mamashai + "/api/statuses/repost.json?from=wenzi&is_comment=" + check.value() + "&status=" + value + "&id=" + (win.json.forward_post ? win.json.forward_post.id : win.id) +"&" + account_str();
		url = url.replace(/#/g, '%23')
		var xhr = Ti.Network.createHTTPClient()
		xhr.timeout = Ti.App.timeout
		xhr.onerror = function() {
				hide_loading();
				show_timeout_dlg(xhr, url)
		}
		xhr.onload = function() {
				hide_loading();
				
				//允许转发失败的情况存在
				if (this.responseText[0] != "{"){
					show_alert(this.responseText);
					return;
				}
				
				Ti.App.fireEvent("add_forward", {id : win.json.id})
				if (check.value == 1)
					Ti.App.fireEvent("add_comment", {id : win.json.id})
					
				Ti.App.fireEvent("update_post", {id: win.json.id, comment_count: win.json.comments_count, forward_count: win.json.forward_posts_count+1})	
				win.close();
				
				show_notice("转晒成功！");
		}
		xhr.open('POST', url);
		xhr.send();
		show_loading();
	})
	
	if (!Ti.App.is_android)
		win.setRightNavButton(done)
		
	add_default_action_bar2(win, win.title, Ti.App.is_android ? Ti.Android.R.drawable.ic_menu_upload : "", function(){
		done.fireEvent("click");
	});
	
	win.addEventListener("open", function() {
		textarea.focus();
		textarea.fireEvent("change")
	})
	
	logEvent('forward');

	return win;
}

module.exports = Forward;