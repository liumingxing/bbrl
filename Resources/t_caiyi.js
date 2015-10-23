Ti.include("public.js")

var win = Titanium.UI.currentWindow;
if (Ti.App.is_android)
	win.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;

if (!Ti.App.is_android)
	win.hideNavBar();
	
win.benling = "绘画"
if (!Ti.App.is_android){
	win.addEventListener("click", function(){
		textarea.blur();
	})	
}

win.preview_callback = function(){
	textarea.height = 0
	win.scrolly.remove(select_kind)
	win.scrolly.remove(select_pic)
	win.scrolly.remove(textarea)
	win.scrolly.add(textarea_label)
}

win.edit_callback = function(){
	textarea.height = __l(54)
	win.scrolly.add(select_kind)
	win.scrolly.add(select_pic)
	win.scrolly.add(textarea)
	win.scrolly.remove(textarea_label)
}

win.text_callback = function(){
	return textarea.value
}

win.has_picture = function(){
	if (kid_pic.file)
		return true;
	else
		return false;
}

win.select_picture_callback = function(image, path, width, height) {
	if (!Ti.App.is_android){
		kid_pic.animate({left: -260, height: 20, width: 20, duration: 400}, function(){
			kid_pic.file = image;
			kid_pic.image = image;
			kid_pic.left = Ti.App.platform_width + 20;
			kid_pic.animate({left: __l(0), height: __l(254), width: __l(254), duration: 400})
		})
	}
	else{
		scrolly.remove(kid_pic_scroll);
		kid_pic_scroll = null;
		kid_pic = null;
		kid_pic_scroll = Ti.UI.createView({
			top : __l(192),
			left : __l(35),
			width : __l(254),
			height : __l(254)
		});
		
		scrolly.add(kid_pic_scroll)
		
		var imageWrapper = Ti.UI.createView({
			top : 0,
			left : 0,
			width : __l(254),
			height : __l(254)
		})
		
		kid_pic = Ti.UI.createImageView({
				top : 0,
				left : 0,
				right: 0,
				bottom: 0,
				hires : true,
				image : image,
				file : image,
				autorotate: true
		});
		
		imageWrapper.add(kid_pic)
		kid_pic_scroll.add(imageWrapper)
		require('lib/make_android_pinch').make_android_pinch(imageWrapper, kid_pic_scroll)
	}
}

Ti.include("lib/template_page.js")
var toolbar = template_page(win, "caiyi", "才艺本领")
var scrolly = win.scrolly;

var record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id())
var json = JSON.parse(record.json)
var kid = null
if(json.user_kids.length > 0)
	kid = json.user_kids[0];
	
var label_kind = Ti.UI.createLabel({
		text : "才艺本领",
		font : {
			fontSize : __l(20),
			fontWeight : "bold"
		},
		top : __l(40),
		left : __l(30),
		//height : __l(20),
		width : __l(180),
		textAlign : 'left',
		color : "black"
})
scrolly.add(label_kind)
win.label_kind = label_kind;	

if(kid) {
	var str = kid.name + (win.today_str ? detail_age_for_birthday(kid.birthday, win.today_str) : detail_age_for_birthday(kid.birthday))
	var label = Ti.UI.createLabel({
			text : str,
			font : {
				fontSize : __l(13)
			},
			top : __l(80),
			left : __l(30),
			//height : __l(15),
			width : __l(200),
			textAlign : 'left',
			color : "black"
	})
	scrolly.add(label)
}

var now = new Date();
var now_str = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日";

var label = Ti.UI.createLabel({
	text : now_str,
	font : {
		fontSize : __l(13)
	},
	top : __l(80),
	right : __l(30),
	//height : __l(15),
	width : __l(200),
	textAlign : 'right',
	color : "black"
})

if (win.today_str && !is_today(win.today_str)){
	var splits = win.today_str.split('-')
	label.text = splits[0] + "年" + splits[1] + "月" + splits[2] + "日"
}
scrolly.add(label)

win.label_kind.text = "才艺本领-" + win.benling;

var select_kind = Ti.UI.createImageView({
	top : __l(36),
	left: __l(170),
	width : __l(31),
	height : __l(31),
	hires : true,
	image : "./images/jiantou_down" + Ti.App.pic_sufix + ".png"
});
select_kind.addEventListener("click", function() {
	var PickerView = require('lib/picker_view')
	var picker_view = PickerView.create_picker_view(picker, function() {
		if (picker.str == "其他")
			win.label_kind.text = "才艺本领";
		else
			win.label_kind.text = "才艺本领-" + picker.str;
	})
	win.add(picker_view)
	picker_view.animate({
		bottom : 0
	});
})
scrolly.add(select_kind)

var kid_pic_scroll = Ti.UI.createView({
	top : __l(192),
	left : __l(35),
	width : __l(254),
	height : __l(254),
	contentWidth: __l(254),
	contentHeight : __l(254),
	showHorizontalScrollIndicator : false,
	showVerticalScrollIndicator : false
});
scrolly.add(kid_pic_scroll)

var kid_pic = Ti.UI.createImageView({
	top : 0,
	left : 0,
	right: 0,
	bottom: 0,
	hires : true,
	width: __l(254),
	height: __l(254),
	image : "./images/template/caiyi/zhaopian.jpg"
});
kid_pic_scroll.add(kid_pic)

var select_pic = Ti.UI.createImageView({
	top : __l(390),
	right : __l(15),
	width : __l(43),
	height : __l(43),
	hires : true,
	zIndex : 10,
	image : "./images/tupian" + Ti.App.pic_sufix + ".png"
});
select_pic.addEventListener("click", function() {
	select_image(!Ti.App.is_android, win.select_picture_callback)
})

scrolly.add(select_pic)

var textarea = Titanium.UI.createTextArea({
    value : "#才艺本领#宝宝的才艺说不尽",
    hintText:'说点什么呢？',
    top : __l(105),
    left: __l(30),
    right: __l(30),
    height : __l(70),
    textAlign : 'left',
    borderWidth : 1,
    borderColor : '#ccc',
    borderRadius : 4,
    font : {
		fontSize : __l(13)
	},
	opacity : 0.6,
	returnKeyType: Titanium.UI.RETURNKEY_DONE,
	color: "#2A2A2A"
});

if (Ti.App.is_android){
	textarea.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS
	setTimeout(function(){
		textarea.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	}, 2000)
}

var count_label = Ti.UI.createLabel({
	text : '70',
	color: "#2A2A2A",
	font : {fontSize: __l(13)},
	height : __l(14),
	width : Ti.UI.SIZE,
	bottom: __l(2),
	right: __l(4),
	textAlign : 'right'
})
	
textarea.add(count_label);
textarea.addEventListener("change", function(){
		count_label.text = 70-textarea.value.length
		if (parseInt(count_label.text) < 0){
			count_label.text = 0
			textarea.value = textarea.value.substr(0, 70)
		}
})
textarea.fireEvent('change')
textarea.addEventListener("change", function(e){
	textarea_label.text = textarea.value;
})

var textarea_label = Titanium.UI.createLabel({
    text : "#才艺本领#宝宝的才艺说不尽",
    top : __l(105),
    left: __l(30),
    right: __l(30),
    height : 'auto',
    //shadowColor:'#888',
    textAlign : 'left',
    font : {
		fontSize : __l(13)
	},
	color: "#000"
});

if (Ti.App.is_android){
	textarea.top += Ti.App.platform_height - scrolly.bottom - __l(480) - 18;
	win.add(textarea);
}
else{
	scrolly.add(textarea);
}


var picker = Titanium.UI.createPicker({
	useSpinner: true,
	selectionIndicator : true,
	width: Ti.App.platform_width,
	visibleItems: visible_items()
});
if (Ti.App.is_android && Ti.App.platform_width == 480){
	picker.visibleItems = 5;
}

picker.back_value = "pplj";
picker.str = '绘画'
var data = [];
data[0] = Ti.UI.createPickerRow({
	title : '绘画'
});
data[1] = Ti.UI.createPickerRow({
	title : '歌舞'
});
data[2] = Ti.UI.createPickerRow({
	title : '运动'
});
data[3] = Ti.UI.createPickerRow({
	title : '其他'
});
picker.addEventListener("change", function(e) {
	picker.str = e.row.title;
})
var column1 = Ti.UI.createPickerColumn( {
	rows: data
});
if (Ti.App.is_android)
	column1.width = Ti.App.platform_width

picker.add(column1);
