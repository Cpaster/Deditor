var Class = {

	create: function(){
		return function(){
			this.initialize.apply(this,arguments);
		}
	}
}

var css = function(){
	var doc,cssCode;
	if(arguments.length == 1){
		doc = document;
		cssCode = arguments[0];
	}
	else if(arguments.length == 2){
		doc = arguments[0];
		cssCode = arguments[1];
	}
	else{
		console.error("只支持输入两个参数");
	}

	var headElement = document.getElementsByTagName("head")[0];
	var styleElements = headElement.getElementsByTagName("style");

	if(styleElements.length == 0){
		if(!+"\v1"){ //ie
			doc.createStyleSheet();
		}
		else{
			var styleElementTpl = document.createElement("style");
			styleElementTpl.setAttribute("type","text/css");
			headElement.appendChild(styleElementTpl);
		}
	}
		var styleElement = styleElements[0];
		var media = styleElement.getAttribute('media'); 
		if(media != null && !/screen/.text(media.toLowerCase())){
			styleElement.getAttribute("media","screen");
		}

		if(!+'\v1'){
			styleElement.StyleSheet.cssText += cssCode;
		}
		else if(/a/[-1] == "a"){
			styleElement.innerHTML += cssCode;
		}
		else{
			styleElement.appendChild(doc.createTextNode(cssCode));
		}
}

var extend = function(destination, source){
	for(var protortype in source){
		destination[protortype] = source[protortype];
	}

	return destination;
}

var TextEditor = Class.create();

TextEditor.prototype = {

	initialize: function(options){
		this.setOptions(options);
		this.drawTextEditor(this.options.textarea_id);
	},

	setOptions: function(options){
		this.options = {
			"id": "J_editors" + new Date().getTime(),
			"textarea_id": null
		}

		extend(this.options, options || {});
	},

	ID: function(id){
		return document.getElementById(id);
	},

	Tag: function(tag){
		return document.getElementsByTagName(tag);
	},

	create: function(dom){
		return document.createElement(dom);
	},

	fontPickerHtml: function(type,array){
		var builder = [];
		for(var i = 0,l = array.length; i<l; i++){

				builder.push('<a unselectable="on" style="');
				if(type == "fontname"){
					builder.push("font-family");
					builder.push(":");
					builder.push(array[i]);
					builder.push(';">');
					builder.push(array[i]);
				}
				else if(type == "fontsize"){
					builder.push("font-size");
					builder.push(":");
					builder.push(array[i][1]);
					builder.push(';" sizevalue="');
					builder.push(array[i][0]);
					builder.push('">');
					builder.push(array[i][2]);
				}
				builder.push('</a>');
		}

		return builder.join('');
	},

	colorPickerHtml: function(){
		var _hex = ['FF','CC','99','66','33','00'];

		var builder = [];

		var _drawCell = function(builder,red,green,blue){
			builder.push('<td bgcolor="');
			builder.push('#' + red + green + blue);
			builder.push('" unselectable="on"></td>');
			builder.push('');
		};

		var _drawRow = function(builder,red,blue){
			builder.push('<tr>');
			for(var i = 0; i < 6; i++){
				_drawCell(builder,red,_hex[i],blue);
			}
			builder.push("</tr>");
		};

		var _drawTable = function(builder,blue){
			builder.push('<table class="cell" unselectable="on">');
			for(var i = 0; i < 6; i++){
				_drawRow(builder,_hex[i],blue);
			}
			builder.push('</table>');
		};

		//
		builder.push("<table><tr>");
		for(var i = 0;i<3;i++){
			builder.push('<td>');
				_drawTable(builder,_hex[i]);
			builder.push("</td>");
		}
		builder.push('</tr><tr>');
		for(var i = 3; i < 6; i++){
			builder.push('<td>');
				_drawTable(builder,_hex[i]);
			builder.push("</td>");
		}
		builder.push('</tr></table>');
		builder.push('<table id="color_result"><tr><td id="color_view"></td><td id="color_code"></td></tr></table>');
		return builder.join('');
	},

	tablePickerHTML: function(){
		var builder = [];
		builder.push('<div>')
	},

	addEvent: function(el,type,fn){

		if(!+'\v1'){
			el['e'+type+fn] = fn;
			el.attachEvent('on'+type, function(){
				el['e'+type+fn]();
			});
		}
		else{
			el.addEventListener(type,fn,false);
		}

	},

	drawTextEditor: function(id){
		var $ = this;
		 	textarea = this.ID(id),
		 	toolBar = this.create("div"),
		 	br = this.create('br'),//清除浮动
		 	iframe = this.create("iframe");

		textarea.style.display = "none";
		textarea.parentNode.insertBefore(toolBar,textarea);
		textarea.parentNode.insertBefore(br,textarea);
		textarea.parentNode.insertBefore(iframe,textarea);

		br.style.cssText = "clear:both";

		toolBar.setAttribute("id","E_toolbar");
		iframe.setAttribute("id","E_iframe");
		iframe.frameBorder = 0;
		var iframeDoment = iframe.contentDocument || iframe.contentWindow.document;
		iframeDoment.designMode = "on";
		iframeDoment.open();
		iframeDoment.write('<html><head><style type="text/css"></style></head></html>');
		iframeDoment.close();

		var buttons = {
			'removeFormat': "还原",
			'bold': "加粗",
			'italic': '斜体',
			'underline': '下划线',
			'justifyleft': '居左',
			'justifycenter': '居中',
			'justifyright': '居右',
			'indent': '缩进',
			'outdent': '悬挂',
			'forecolor': '前景色',
			'backcolor': '背景色',
			'createlink': '超链接',
			'insertimage': '插图',
			'fontname': "字体",
			'fontsize': "字码",
			'insertorderedlist': '有序列表',
			'insertunorderedlist': '无序列表',
			'table': "插入表格",
			'html': "查看"
		};

		var fontFamilies = ['宋体','经典中圆简','微软雅黑', '黑体', '楷体', '隶书', '幼圆',
	        'Arial', 'Arial Narrow', 'Arial Black', 'Comic Sans MS',
	        'Courier New', 'Georgia', 'New Roman Times', 'Verdana'];

      	var fontSizes= [[1, 'xx-small', '最小'],
				        [2, 'x-small', '特小'],
				        [3, 'small', '小'],
				        [4, 'medium', '中'],
				        [5, 'large', '大'],
				        [6, 'x-large', '特大'],
				        [7, 'xx-large', '最大']];

		var buttonClone = $.create("a"),
			fragment = document.createDocumentFragment();
			switchEditMode = true;
			buttonClone.className = 'button';

			for(var i in buttons){

					var button = buttonClone.cloneNode('true');
					if(i == "backcolor"){
						if(!+"\v1"){
							button.setAttribute("title","background");
						}
						else{
							button.setAttribute("title","hilitecolor");
						}
					}
					button.setAttribute("title",i);
					button.innerHTML = buttons[i];
					button.setAttribute('unselectable',"on");
					toolBar[i] = button;
					fragment.appendChild(button);
			}

			toolBar.appendChild(fragment);

			$.addEvent(toolBar,'click',function(){

				var e = arguments[0] || window.event,
					target = e.srcElement ? e.srcElement : e.target,
					commend = target.getAttribute('title');
					switch(commend){
						case 'createlink':
						case 'insertimage':
							var value = prompt("请输入超链接:","");
							_format(commend,value);
							break;
						case 'fontname':
						case 'fontsize':
						case 'backcolor':
						case 'forecolor':
						case 'html':
							return;
						default:
							_format(commend,'');
							break;
					}
			});

			var _format = function(command,value){
				try{

					if(command == "backcolor"){
						command = (/a/[-1] == "a") ? "hilitecolor" : "backcolor";
					}

					iframeDoment.execCommand(command,false,value);
					iframe.contentWindow.focus();
				}
				catch(e){
					console.log("这个错误只有IE有，不用管");
				}
			};

			var bind_select_event =function(button,picker){
				button.style.position = 'relative';
				picker.setAttribute('title',button.getAttribute('title'));
				if(picker.style.display == 'none'){
					picker.style.display = "block";
					picker.style.left = button.offsetLeft + "px";
					picker.style.top = (button.offsetTop + button.clientHeight) + "px";
				}
				else{
					picker.style.display = "none";
				}
			}

			var fontPicker =$.create('div');
			fontPicker.setAttribute("unselectable","on");
			fontPicker.className = 'fontPicker';
			toolBar.appendChild(fontPicker);

			$.addEvent(toolBar['fontsize'],'click',function(){
				fontPicker.innerHTML = $.fontPickerHtml("fontsize",fontSizes);
				fontPicker.style.width = "150px";
				bind_select_event(this,fontPicker);
			})

			$.addEvent(toolBar['fontname'],'click',function(){
				fontPicker.innerHTML = $.fontPickerHtml("fontname",fontFamilies);
				fontPicker.style.width = "150px";
				bind_select_event(this,fontPicker);
			});

			$.addEvent(fontPicker,'click',function(){

				var e = arguments[0] || window.event;
				var target = e.srcElement ? e.srcElement : e.target;
				var commend = this.getAttribute('title');
				var n = target.nodeName.toLowerCase();
				if(n == 'a'){
					var value;
					if('fontsize' == commend){
						value = target.getAttribute("sizevalue");
					}
					else{
						value = target.innerHTML;
					}
					_format(commend,value);
					fontPicker.style.display = "none";
				}
			})

			// colordraw
			var colorPicker = $.create('div');
			colorPicker.setAttribute("unselectable","on");
			colorPicker.className = "colorpicker";
			toolBar.appendChild(colorPicker);
			colorPicker.innerHTML = $.colorPickerHtml();

			$.addEvent(toolBar['backcolor'],'click',function(){
				bind_select_event(this,colorPicker);
			});

			$.addEvent(toolBar['forecolor'],'click',function(){
				bind_select_event(this,colorPicker);
			});

			$.addEvent(colorPicker,'mouseover',function(){
				var e = arguments[0] || window.event,
					target = e.srcElement ? e.srcElement : e.target,
					nn = target.nodeName.toLowerCase();
				var colorView = document.getElementById("color_view"),
					colorCode = document.getElementById("color_code");

				if(nn == "td"){
					colorView.style.backgroundColor = target.bgColor;
					colorCode.innerHTML = target.bgColor;
				}
			})

			$.addEvent(colorPicker,"click",function(){
				var e = arguments[0] || window.event,
					target = e.srcElement || e.target,
					nn = target.nodeName.toLowerCase();

				if(nn == "td"){
					var cmd = colorPicker.getAttribute('title');
					var val = target.bgColor;
					_format(cmd,val);
					e.cancelBubble = true;
					colorPicker.style.display = "none";
				}
			})

			var do_html = function(){
				iframe.style.display = "none";
				textarea.style.display = "block";
				textarea.value = iframeDoment.body.innerHTML;
				textarea.focus();
			};

			var do_Rich = function(){
				textarea.style.display = "none";
				iframe.style.display = "block";
				iframeDoment.body.innerHTML = textarea.value;
				iframe.contentWindow.focus();
			};

			var editSwitchMode = true;

			$.addEvent(toolBar['html'],'click',function(){

				if(editSwitchMode){
					do_html();
					editSwitchMode = false;
				}
				else{
					do_Rich();
					editSwitchMode = true;
				}

			})

			$.addEvent(iframe.contentWindow,'blur',function(){
				textarea.value = iframeDoment.body.innerHTML;
			})

			var tablePicker = $.create("div");
			tablePicker.className = "tablepicker";
			toolBar.appendChild(tablePicker);

			css("#E_iframe{width:600px; height: 300px; border: 1px solid red}\
				#E_toolbar{width: 600px;}\
				#E_toolbar .button{display: block; float:left; border: 1px solid #ccc; margin-left: 5px; cursor: pointer; line-height:20px; text-align: center}\
				div.fontPicker{display: none; height:150px; overflow: auto; position: absolute; }\
				div.fontPicker a{display: block;}\
				.colorpicker{display: none; position:absolute;}\
				.colorpicker .cell td{width:12px; height:12px;}\
				#color_view{width:50px;}");

		}
};