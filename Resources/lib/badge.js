//创建badge小圆圈
function create_badge(count){
		var badge_label = Ti.UI.createLabel({
			text : count,
			color : '#F41124',
			font : {
				fontSize : __l(15),
				fontWeight : "bold"
			},
			top: __l(11),
			left : __l(6),
			right : __l(6),
			//top : __l(6),
			//bottom : 6,
			heigth : Ti.App.is_android ? 19 : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			textAlign : 'center',
		});
		return badge_label;
}

exports.create_badge = create_badge;