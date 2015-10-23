function __l(x){
	if (Ti.App.is_android){
		if (Ti.App.platform_height/Ti.App.logicalDensityFactor > 800)
			return x * Ti.App.logicalDensityFactor * 1.4;
		else
			return x * Ti.App.logicalDensityFactor;
	}
	
	if (!Ti.App.is_android && !Ti.App.is_ipad && Ti.App.platform_width > 320){
		return parseInt(375.0*x/320);
	}
	
	return Ti.App.is_ipad ? 1.5*x : x;
	/*
	if (Ti.App.is_android && Ti.App.platform_width > 320 && Ti.App.platform_width <=400){
		return parseInt(1.1*x);
	}
	if (Ti.App.is_android && Ti.App.platform_width >=480){
		return parseInt(1.5*x);
	}
	return Ti.App.is_ipad ? 2*x : x;
	*/
}

function CheckBox(attr) {
  this.view = null;
  if (Ti.App.is_android){
  	this.view = Titanium.UI.createSwitch(attr);
  	this.view.style = Titanium.UI.Android.SWITCH_STYLE_CHECKBOX;
  	this.view.value = false;
  	
  	this.value = function(){
	  	return this.view.value;
	};
  	return;
  }
  
  this.view = Ti.UI.createButton(attr);

  if (Ti.App.is_android){
  	if (this.view.left)
	  	this.view.left = attr.left + __l(4);
  }
  
  this.view.value = 0;
  this.view.hires = true;
  this.view.backgroundColor = "transparent";
  this.view.image = "/images/weixuan" + Ti.App.pic_sufix + ".png";
  this.view.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
  this.view.image_uncheck = "/images/weixuan" + Ti.App.pic_sufix + ".png";
  this.view.image_check = "/images/xuanzhong" + Ti.App.pic_sufix + ".png";
  
  if (Ti.App.is_android && Ti.App.platform_width >= 720){
  	this.view.width += __l(10)
  	this.view.height += __l(10)
  	this.view.image = "/images/weixuan@3x.png";
  	this.view.image_uncheck = "/images/weixuan@3x.png";
  	this.view.image_check = "/images/xuanzhong@3x.png";
  }
  
  this.view.addEventListener("click", function(e){
  		if (e.source.value == 0){
			e.source.value = 1;
			e.source.image = "/images/xuanzhong" + Ti.App.pic_sufix + ".png";
			if (Ti.App.is_android && Ti.App.platform_width >= 720){
				e.source.image = "/images/xuanzhong@3x.png";
			}
		}
		else{
			e.source.value = 0;
			e.source.image = "/images/weixuan" + Ti.App.pic_sufix + ".png";
			if (Ti.App.is_android && Ti.App.platform_width >= 720){
				e.source.image = "/images/weixuan@3x.png";
			}
		}
		e.source.updateLayout({})
  })
  
  this.setCheck = function() {
    this.view.value = 1
    this.view.image = this.view.image_check;
  };

  this.setUncheck = function() {
    this.view.value = 0
    this.view.image = this.view.image_uncheck;
  };
  
  this.value = function(){
  	return this.view.value;
  }
}
exports.CheckBox = CheckBox;