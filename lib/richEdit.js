define(function(require, exports, module){

	var fileUpload = require("./fileuploader");
	var $ = require("jquery");

	var Class = {

		create: function(){
			return function(){
				this.initialize.apply(this,arguments);
			}
		}
	}


	//base function
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

	var uploadImgFuc = function(uploadConfig){
		var fileUploadItem = new fileUpload(uploadConfig);

			fileUploadItem.on('swfLoaded', function(file, serverData, responseReceived){
		    });

		    fileUploadItem.on('dialogStart', function(file, serverData, responseReceived){

		    });

		    fileUploadItem.on('fileQueued', function(file, serverData, responseReceived){
		    });

		    fileUploadItem.on('queueError', function(file, serverData, responseReceived){
		    });

		    fileUploadItem.on('dialogComplete', function(file, errorMessage){
		    });

		    fileUploadItem.on('uploadStart', function(file, serverData, responseReceived){
		    });

		    fileUploadItem.on('uploadProgress', function(file, serverData, responseReceived){
		    });

		     //上传失败
		    fileUploadItem.on('uploadError', function(file, errorMessage){
		    });
		    
		    //上传成功
		    fileUploadItem.on('uploadSuccess', function(file, serverData, responseReceived){
		    });
		
		    fileUploadItem.on('uploadComplete', function(file, errorMessage){
		    });
	}


	//initialize
	var TextEditor = Class.create();

	TextEditor.prototype = {

		initialize: function(options){
			this.configParameters = options.applicationConfig;
			this.cssParameters = options.editStyle;
			this.uploadParameters = options.imgUploadConfig;
			if(options.textarea_id == undefined){
				return
			}

			this.setOptions(options);
			this.drawTextEditor(this.options.textarea_id);
		},

		setOptions: function(options){
			this.options = {
				"id": "J_editors" + new Date().getTime(),
				"textarea_id": ""
			}

			extend(this.options, options || {});
		},

		ID: function(id){
			return document.getElementById(id);
		},

		Tag: function(tag){
			return document.getElementsByTagName(tag);
		},

		ClassName: function(classname){
			var doms = document.getElementById(this.options.id).getElementsByTagName('*');
			var classDom = [];
			for(var i = 0; i < doms.length; i++){
				if(doms[i].className && doms[i].className == classname){
					classDom.push(doms[i]);
				}
			}

			return classDom;
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

		imgagePickerHtml: function(){
			var builder = [];
			builder.push('<div class="title">上传图片<b class="close"></b></div>');
			builder.push('<div class="img-box"></div><div class="uploadbtn"><button id="uploadbtn">选择图片</button></div>');

			return builder.join('');
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
			 	iframe = this.create("iframe"),
			 	buttons = this.configParameters.buttons,
			 	fontFamilies = this.configParameters.fontFamilies,
			 	fontSizes = this.configParameters.fontSizes;

			textarea.style.display = "none";
			textarea.parentNode.insertBefore(toolBar,textarea);
			textarea.parentNode.insertBefore(iframe,textarea);

			toolBar.setAttribute("id","E_toolbar");
			iframe.setAttribute("id","E_iframe");
			iframe.frameBorder = 0;
			var iframeDoment = iframe.contentDocument || iframe.contentWindow.document;
			iframeDoment.designMode = "on";
			iframeDoment.open();
			iframeDoment.write('<html><head><style type="text/css"></style></head></html>');
			iframeDoment.close();

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

						button.style.cssText = "background-position:" + buttons[i][1] + "px " + buttons[i][2] + "px; width:" + buttons[i][3] + "px; height:" + buttons[i][4] + "px"; 
						button.setAttribute("title",i);
						
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
								var value = prompt("请输入超链接:","");
								_format(commend,value);
								break;
							case 'insertimage':
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
					if(picker.className == "insertImage"){
						if(picker.style.display == 'none'){
							picker.style.display = "block";
						}
						else{
							picker.style.display = "none";
						}
						return;
					}
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
				fontPicker.style.display = "none";
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
				colorPicker.style.display = 'none';
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

				// insertImage draw
				var insertImagePicker = $.create("div");
				insertImagePicker.className = "insertImage";
				insertImagePicker.style.display = 'none';
				$.ID("edit").appendChild(insertImagePicker);
				insertImagePicker.innerHTML = $.imgagePickerHtml();

				$.addEvent(toolBar['insertimage'],'click',function(){
					bind_select_event(this,insertImagePicker);
					uploadImgFuc($.uploadParameters);
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

				$.addEvent(iframe.contentWindow,'focus',function(){
					var fontPickers = $.ClassName('fontPicker');
					var colorPickers = $.ClassName('colorpicker');

					for(var i = 0; i< fontPickers.length; i++){
						fontPickers[i].style.display = "none";
					}

					for(var i = 0; i < colorPickers.length; i++){
						colorPickers[i].style.display = "none";
					}
				})

				$.addEvent($.ClassName("close")[0],'click',function(){
					$.ClassName('insertImage')[0].style.display = "none";
				})

			}
	};

	return TextEditor;

});