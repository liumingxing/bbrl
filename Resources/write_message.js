Ti.include("public.js")
var win = Titanium.UI.currentWindow;
var title = Ti.UI.createLabel({
	right : __l(20),
	width : __l(160),
	top : __l(8),
	textAlign : "right",
	height : 'auto',
	font : {
		fontSize : __l(13)
	},
	text : "还可输入140字"
});

var textarea = createEmojiTextArea({
	value : win.text,
	height : __l(120),
	left : __l(6),
	right : __l(6),
	top : __l(30),
	textAlign : 'left',
	borderWidth : 1,
	borderColor : '#ccc',
	backgroundColor: "transparent",
	borderRadius : __l(5),
	font : {
		fontSize : __l(15)
	}
});
textarea.addEventListener(Ti.App.is_android ? "click" : "focus", function(e) {
	face_view.hide();
});
textarea.addEventListener("change", function(e) {
	if (textarea.value.length > 140)
		textarea.value = textarea.value.substr(0, 140)
	title.text = "还可以输入" + (140 - textarea.value.length) + "字";
})

textarea.fireEvent("change")

var tip = Ti.UI.createLabel({
	left : __l(20),
	top : __l(8),
	textAlign : "left",
	height : __l(14),
	left : __l(10),
	font : {
		fontSize : __l(12)
	},
	text : "收信人： " + win.name
});

var show_face = Titanium.UI.createImageView({
	top : __l(160),
	right : __l(8),
	height : __l(28),
	width : __l(30),
	hires : true,
	image : "images/xiaolian@2x.png"
});

show_face.addEventListener("click", function(e) {
	if (face_view.children.length == 0) {
		show_loading();
		setTimeout(function() {
			face_view.hide();
			add_faces();
			face_view.show();
			hide_loading();
			textarea.blur();
		}, 50);
	}

	if (face_view.visible) {
		face_view.hide();
		textarea.focus();
		textarea.setSelection(textarea.value.length, textarea.value.length);
	} else {
		face_view.show();
		textarea.blur();
	}
});

var face_view = Titanium.UI.createScrollView({
	contentHeight : 'auto',
	contentWidth : Ti.App.platform_width,
	showVerticalScrollIndicator : true,
	top : __l(194),
	left : 0,
	right : 0,
	bottom : 0,
	visible : false,
	width : Ti.App.platform_width,
	layout : 'horizontal'
});
face_view.hide();

win.add(title);
win.add(textarea);
win.add(tip);
win.add(show_face);
win.add(face_view);

function add_faces() {
	var faces = "👏 💖 😄 👍 👄 😊 🌹 🎁 😍 😘 😜 😁 😔 😢 😂 😭 😅 😱 😡 😷 😲 😏 👼 👸 💤 💨 👌 🙏 💪 👑 💕 💘 💎 🌻 🍁 🍄 🌴 ☀ ⛅ ⚡ ❄ 🌈 🍦 🎂 🍭".split(" ");
	function face_click(e) {
		textarea.value += e.source.text;
		textarea.fireEvent("change");
		if (Ti.App.is_android) {
			textarea.focus();
			textarea.setSelection(textarea.value.length, textarea.value.length);
		}
	};

	function touch_start(e) {
		e.source.backgroundColor = "#ccc";
	}

	function touch_end(e) {
		e.source.backgroundColor = "transparent";
	}

	for (var i = 0; i < faces.length; i++) {
		var c = faces[i];
		var label = createEmojiLabel({
			top : __l(4),
			bottom : __l(4),
			left : __l(7),
			width : __l(28),
			height : __l(28),
			borderRadius : __l(4),
			textAlign : 'center',
			color : 'black',
			font : {
				fontSize : __l(22)
			},
			text : c
		});
		if (!Ti.App.is_android) {
			label.font = {
				fontSize : __l(28)
			};
		}

		label.addEventListener("click", face_click);
		label.addEventListener("touchstart", touch_start);
		label.addEventListener("touchend", touch_end);
		label.addEventListener("touchcancel", touch_end);
		face_view.add(label);
	}
}

// Create a Button.
var done = Ti.UI.createButton({
	title : '发送'
});
done.addEventListener("click", function() {
	var url = Ti.App.mamashai + "/api/direct_messages/new?&name=" + win.name + "&text=" + textarea.value + "&" + account_str();

	var xhr = Ti.Network.createHTTPClient({
		timeout : Ti.App.timeout,
		onerror : function() {
			hide_loading();
			show_timeout_dlg(xhr, url)
		},
		onload : function() {
			hide_loading();

			win.close();
			show_notice("发送私信成功");
			Ti.App.fireEvent("refresh_message");
		}
	})
	xhr.open('POST', url);
	xhr.send();
	show_loading();
})
if (!Ti.App.is_android)
	win.setRightNavButton(done)

add_default_action_bar2(win, win.title, "发送", function() {
	done.fireEvent("click");
});

win.addEventListener("open", function() {
	textarea.focus();
})
logEvent('write_message');
