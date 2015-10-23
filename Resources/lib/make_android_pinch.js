function make_android_pinch(imageView, w, callback, no_pinch){
	if (!Ti.App.is_android){
		return;
	}
	
	var multitouch = require('jp.co.so2.pinch');
	var pinchView = multitouch.createPinchView({
		top:0,
		left:0,
		width: Ti.App.platform_width,
		height: Ti.App.platform_height,
		backgroundColor:'transparent',
		minZoomValue:1,
		maxZoomValue:2,
		zIndex : 100
	});
	w.add(pinchView)
	
	//pinchView.base_size = imageView.size;
	pinchView.old_width = imageView.width;
	pinchView.old_height = imageView.height;
	imageView.scale = 1;
	pinchView.addEventListener('pinch',function(e) {
		////////////////////
		if (no_pinch){
			return;
		}
		
		var oldWidth = imageView.width;
		var oldHeight = imageView.height;
		imageView.width = pinchView.old_width * e.scale;
		imageView.height = pinchView.old_height * e.scale;
		Ti.API.log("pinch_________________width:" + pinchView.old_width)
		var deltaWidth = imageView.width - oldWidth;
		var deltaHeight = imageView.height - oldHeight;
		imageView.left -= deltaWidth / 2;
		imageView.top -= deltaHeight / 2;
		imageView.scale = e.scale;
		if (callback){
			callback(imageView.scale, imageView.left, imageView.top)
		}
	});
	
	var startX, startY, startLeft, startTop;
				
	pinchView.addEventListener('multiStart', function(e) {
		startX = imageView.left;
		startY = imageView.top;
		if (callback){
			callback(imageView.scale, imageView.left, imageView.top)
		}
	});

	pinchView.addEventListener('multiMove',function(e) {
		imageView.left += e.x;
		imageView.top += e.y;
		startLeft = imageView.left;
		startTop = imageView.top;
		if (callback){
			callback(imageView.scale, imageView.left, imageView.top)
		}
	});
	
	pinchView.addEventListener('multiEnd',function(e) {
		Ti.API.debug("multiEnd");
		pinchView.old_width = imageView.width;
		pinchView.old_height = imageView.height;
	});
	
	pinchView.addEventListener('doubletap',function(e) {
		Ti.API.debug("DOUBLE TAP");
	});
	
	pinchView.addEventListener('singletap',function(e) {
		Ti.API.debug('SINGLE TAP');
	});
	return pinchView;
}

exports.make_android_pinch = make_android_pinch