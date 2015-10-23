Ti.include("public.js");
var win = Titanium.UI.currentWindow;

var canvas = Ti.UI.createScrollView({
	contentHeight : 'auto',
	showVerticalScrollIndicator : true,
	showHorizontalScrollIndicator : true,
	backgroundColor: 'white',
	layout: 'vertical',
	left : 1,
	top : 0,
	bottom : 0,
	right : 1,
	textAlign : "center"
});

win.add(canvas)

var xhr = Ti.Network.createHTTPClient()
xhr.timeout = Ti.App.timeout
xhr.onload = function() {
		require('lib/mamashai_db').db.insert_json("gifts", 0, this.responseText)
		insert_rows_from_json(this.responseText)
}
var current_row = Titanium.UI.createView({
	top : 0,
	left : 0,
	height: Ti.UI.SIZE,
	right :  0,
	layout: 'horizontal'
});
canvas.add(current_row)

var cancel = Titanium.UI.createButton({
	title : '取消',
	style : Titanium.UI.iPhone.SystemButtonStyle.DONE
});
cancel.addEventListener('click', function() {
	picker_view.animate(picker_view_slide_out);
	fuyan.blur();
});
var l = Ti.UI.createLabel({
	text: "请附上一句话吧",
	color:'#F44',
	font:{fontSize:__l(15)}
});

var spacer = Titanium.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

picker_view_slide_in = Titanium.UI.createAnimation({bottom : 0, duration: 300, zIndex: 3});
picker_view_slide_out = Titanium.UI.createAnimation({bottom : Ti.Platform.osname == 'ipad' ? -460 : -320, duration: 300});
var picker_view = Titanium.UI.createView({
		height : Ti.Platform.osname == 'ipad' ? 460 : 320,
		bottom : Ti.Platform.osname == 'ipad' ? -460 :-320,
		backgroundColor : 'white'
});
picker_view.hide();

if (!Ti.App.is_android){
	var picker_toolbar = Titanium.UI.createToolbar({
		top : 0,
		items : [cancel, spacer, l, spacer]
	});
	picker_view.add(picker_toolbar);
}
else{
	picker_view.height = __l(100)
	picker_view.backgroundColor = 'gray'
	l.top = 10
	l.left = 20
	picker_view.add(l)
	cancel.top = 10
	cancel.height = __l(30)
	cancel.right = __l(10)
	//picker_view.add(cancel)
}

win.add(picker_view)

var fuyan = Titanium.UI.createTextField({
	height : Ti.App.is_android ? __l(40) : __l(30),
	top : Ti.App.is_ipad ? __l(30) : __l(56),
	bottom : 2,
	left : 10,
	width : Ti.Platform.osname == 'ipad' ? __l(310) : Ti.App.platform_width - __l(80),
	font : {
		fontSize : __l(15)
	},
	borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	returnKeyType : Ti.UI.RETURNKEY_DONE,
	value : "给你送个礼物"
});

fuyan.blur();
var done = Titanium.UI.createButton({
	title : '发送',
	font : {fontSize: __l(15)},
	top : Ti.App.is_ipad ? __l(30) : __l(56),
	right : __l(4),
	width : __l(58),
	height: Ti.App.is_android ? __l(34) : __l(30)
});
pre_btn(done)
done.addEventListener("click", function(){
	var send_xhr = Ti.Network.createHTTPClient()
	send_xhr.timeout = Ti.App.timeout
	send_xhr.onload = function() {
			hide_loading();
			
			cancel.fireEvent("click");
			win.close();
			show_notice("礼物成功送出");
	}
	send_xhr.onerror = function(){
			hide_loading();
			show_notice("礼物送出时遇到点麻烦")
	}
	send_xhr.open("POST", Ti.App.mamashai + "/api/statuses/send_gift?id=" + win.id + "&gift_id=" + win.gift_id +"&content=" + fuyan.value + "&" + account_str())
	send_xhr.send();
	show_loading();
})
picker_view.add(fuyan)
picker_view.add(done)
	
function gift_click(e){
	picker_view.show();
	if (Ti.App.is_android){
		picker_view.bottom = 0
	}
	else{
		picker_view.animate(picker_view_slide_in)
	}
	fuyan.focus();
	win.gift_id = e.source.id
	fuyan.value = "送个" + e.source.name + "给你，"
}

function insert_rows_from_json(text){
	var json = JSON.parse(text)
	var count = 0;
	for(var i=0; i<json.length; i++){
		var container = Ti.UI.createView({
			top : __l(8),
			bottom : __l(4),
			left : __l(1),
			width : Ti.App.platform_width/4 - __l(2),
			height : __l(70),
		});
		
		var logo = Ti.UI.createImageView({
			top : 0,
			width : __l(50),
			height : __l(50),
			hires: true,
			image : "http://www.mamashai.com" + json[i].logo_url,
			//style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
			name: json[i].name,
			id : json[i].id
		})
		logo.addEventListener("click", gift_click)
		
		var label = Ti.UI.createLabel({
			text : json[i].name,
			bottom: __l(2),
			color : '#333',
			font : {
				fontSize : __l(13)
			},
			height : 'auto',
			width : 'auto'
		});
		container.add(logo)
		container.add(label)
		current_row.add(container)
		count += 1;
		if (count == 4){
			current_row = Titanium.UI.createView({
				top : 0,
				left : 0,
				height: Ti.UI.SIZE,
				right :  0,
				layout: 'horizontal'
			});
			canvas.add(current_row)
			count = 0;
		}
	}
	hide_loading();
}

var record = require('/lib/mamashai_db').db.select_one_json("gifts", 0);
if(!record.blank) {
	insert_rows_from_json(record.json)
}
else{
	xhr.open("GET", Ti.App.mamashai + "/api/statuses/gifts?" + account_str())
	xhr.send();
	if (!Ti.App.is_android)
		show_loading();
}

add_default_action_bar(win, win.title, true)
