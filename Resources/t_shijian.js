Ti.include("public.js")

var win = Titanium.UI.currentWindow;
if (!Ti.App.is_android){
	win.addEventListener("click", function(){
		textarea.blur();
	})	
}

if (!Ti.App.is_android)
	win.hideNavBar();

win.benling = "周末"

win.preview_callback = function(){
	textarea.height = 0
	win.scrolly.remove(select_kind)
	win.scrolly.remove(select_pic)
	win.scrolly.remove(textarea)
	win.scrolly.add(textarea_label)
}

win.edit_callback = function(){
	textarea.height = __l(56)
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
			kid_pic.animate({left: __l(0), height: __l(222), width: __l(222), duration: 400})
		})
	}
	else{
		scrolly.remove(kid_pic_scroll)
		kid_pic_scroll = Ti.UI.createView({
			top : __l(56),
			left : __l(50),
			width : __l(222),
			height : __l(222)
		});

		scrolly.add(kid_pic_scroll)
		
		var imageWrapper = Ti.UI.createView({
			top : 0,
			left : 0,
			width : __l(222),
			height : __l(222)
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
var toolbar = template_page(win, "shijian", "事件活动")
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
		top : __l(320),
		left : __l(30),
		//height : __l(20),
		width : __l(180),
		textAlign : 'left',
		color : "#000"
})
scrolly.add(label_kind)
win.label_kind = label_kind;	

if(kid) {
	var str = kid.name + (win.today_str ? detail_age_for_birthday(kid.birthday, win.today_str) : detail_age_for_birthday(kid.birthday))
	var label = Ti.UI.createLabel({
			text : str,
			font : {
				fontSize : __l(12)
			},
			top : __l(358),
			left : __l(30),
			//height : __l(15),
			width : __l(200),
			textAlign : 'left',
			color : "#323232"
	})
	scrolly.add(label)
}

var now = new Date();
var now_str = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日";

var label = Ti.UI.createLabel({
	text : now_str,
	font : {
		fontSize : __l(12)
	},
	top : __l(358),
	right : __l(30),
	//height : __l(15),
	width : __l(200),
	textAlign : 'right',
	color : "#323232"
})

if (win.today_str && !is_today(win.today_str)){
	var splits = win.today_str.split('-')
	label.text = splits[0] + "年" + splits[1] + "月" + splits[2] + "日"
}
scrolly.add(label)


win.label_kind.text = "事件活动-" + win.benling

var select_kind = Ti.UI.createImageView({
	top : __l(310),
	left: __l(152),
	width : __l(31),
	height : __l(31),
	hires : true,
	image : "./images/jiantou_down" + Ti.App.pic_sufix + ".png"
});
select_kind.addEventListener("click", function() {
	var PickerView = require('lib/picker_view')
	var picker_view = PickerView.create_picker_view(picker, function() {
		if (picker.str == "其他")
			win.label_kind.text = "事件活动";
		else
			win.label_kind.text = "事件活动-" + picker.str;
	})
	win.add(picker_view)
	picker_view.animate({
		bottom : 0
	});
})
scrolly.add(select_kind)

var kid_pic_scroll = Ti.UI.createView({
	top : __l(56),
	left : __l(50),
	width : __l(222),
	height : __l(222),
	contentWidth: __l(222),
	contentHeight : __l(222),
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
	width: __l(222),
	height: __l(222),
	image : "./images/template/shijian/zhaopian.jpg"
});
kid_pic_scroll.add(kid_pic)

var select_pic = Ti.UI.createImageView({
	top : __l(260),
	right : __l(20),
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
    value : "#事件活动#我参加了个有趣的活动",
    hintText:'说点什么呢？',
    top : __l(386),
    left: __l(30),
    right: __l(30),
    height : __l(56),
    textAlign : 'left',
    borderWidth : 1,
    borderColor : '#ccc',
    borderRadius : 4,
    font : {
		fontSize : __l(13)
	},
	opacity : 0.6,
	returnKeyType: Titanium.UI.RETURNKEY_DONE,
	color: "#323232"
});

if (Ti.App.is_android){
	textarea.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS
	setTimeout(function(){
		textarea.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	}, 2000)
}

var count_label = Ti.UI.createLabel({
	text : '70',
	color : '#000',
	font : {fontSize: __l(13)},
	height : __l(14),
	width : Ti.UI.SIZE,
	bottom: 2,
	right: 4,
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
    text : "#事件活动#我参加了个有趣的活动",
    top : __l(386),
    left: __l(30),
    right: __l(30),
    height : 'auto',
    //shadowColor:'#888',
    textAlign : 'left',
    font : {
		fontSize : __l(13),
		fontWeight : "bold",
	},
	color: "#323232"
});

scrolly.add(textarea)

var picker = Titanium.UI.createPicker({
	useSpinner: true,
	selectionIndicator : true,
	width: Ti.App.platform_width,
	visibleItems: visible_items(),
});
if (Ti.App.is_android && Ti.App.platform_width == 480){
		picker.visibleItems = 5;
}
picker.back_value = "pplj";

picker.str = '周末'
var data = [];
data[0] = Ti.UI.createPickerRow({
	title : '周末'
});
data[1] = Ti.UI.createPickerRow({
	title : '庆祝'
});
data[2] = Ti.UI.createPickerRow({
	title : '旅游'
});
data[3] = Ti.UI.createPickerRow({
	title : '观摩'
});
data[4] = Ti.UI.createPickerRow({
	title : '其他'
});
var column1 = Ti.UI.createPickerColumn( {
	rows: data
});
if (Ti.App.is_android)
	column1.width = Ti.App.platform_width
picker.add(column1);
picker.addEventListener("change", function(e) {
	picker.str = e.row.title;
})

