
var osname = Ti.Platform.osname,
    version = Ti.Platform.version,
    height = Ti.Platform.displayCaps.platformHeight,
    width = Ti.Platform.displayCaps.platformWidth;
var factor = Ti.Platform.displayCaps.logicalDensityFactor;
    
var win = Ti.UI.createWindow({
    title: "Emoji test",
    layout: "vertical"
});
var Emoji = require("com.mamashai.emoji"); 

win.add(Emoji.createLabel({
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: Ti.UI.SIZE,
		text: "😥font 10",
		color: "blue",
		font: {fontSize: 10*factor},
		backgroundColor: "red"
}));
win.add(Emoji.createLabel({
		text: "😥font 12",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: 30*factor,
		font: {fontSize: 12*factor}
}));
win.add(Emoji.createLabel({
		text: "😥font 14",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: 30*factor,
		font: {fontSize: 14*factor}
}));
win.add(Emoji.createLabel({
		text: "😥font 16",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: 30*factor,
		font: {fontSize: 16*factor}
}));
win.add(Emoji.createLabel({
		text: "😥font 18",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: 30*factor,
		font: {fontSize: 18*factor}
}));
win.add(Emoji.createLabel({
		html: "😥from web html, font 20",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: 30*factor,
		font: {fontSize: 20*factor}
}));
win.add(Emoji.createLabel({
		text: "😥font 22",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: 30*factor,
		font: {fontSize: 22*factor}
}));
win.add(Emoji.createTextField({
		value: "😥text field font 12",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: Ti.UI.SIZE,
		font: {fontSize: 12*factor}
}));
	
win.add(Emoji.createTextField({
		value: "😥text field font 14",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: Ti.UI.SIZE,
		font: {fontSize: 14*factor}
}));
	
win.add(Emoji.createTextField({
		value: "😥text field font 20",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: Ti.UI.SIZE,
		font: {fontSize: 20*factor}
}));
	
win.add(Emoji.createTextArea({
		value: "😥text area font 14",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: 60*factor,
		font: {fontSize: 14*factor}
}));
win.add(Emoji.createTextArea({
		value: "😥text area font 20",
		top: 2*factor,
		left: 10*factor,
		right: 10*factor,
		height: 60*factor,
		font: {fontSize: 20*factor}
}));
	
win.open();
