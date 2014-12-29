'use strict';
define(function(require, exports, module){
	var SWfUpload = require('http://t1.dpfile.com/t/jsnew/app/events/tpcommon/swfuploader/swfupload-seajs.js');
	var _defaultSettings = {
		// upload_url : "http://www.swfupload.org/upload.php",
		// flash_url : "http://www.swfupload.org/swfupload.swf",

		// file_post_name : "Filedata",
		// post_params : {
		// 	"post_param_name_1" : "post_param_value_1",
		// 	"post_param_name_2" : "post_param_value_2",
		// 	"post_param_name_n" : "post_param_value_n"
		// },
		// use_query_string : false,
		// requeue_on_error : false,
		// http_success : [201, 202],
		// assume_success_timeout : 0,
		// file_types : "*.jpg;*.gif",
		// file_types_description: "Web Image Files",
		// file_size_limit : "1024",
		// file_upload_limit : 10,
		// file_queue_limit : 2,
		
		prevent_swf_caching : false,
		preserve_relative_urls : false,
		
		// button_placeholder_id : "element_id",
		// button_image_url : "http://www.swfupload.org/button_sprite.png",
		// button_width : 61,
		// button_height : 22,
		// button_text : "<b>Click</b> <span class="redText">here</span>",
		// button_text_style : ".redText { color: #FF0000; }",
		button_text_left_padding : 0,
		button_text_top_padding : 0,
		button_action : SWFUpload.BUTTON_ACTION.SELECT_FILES,
		// button_disabled : false,
		button_cursor : SWFUpload.CURSOR.HAND,
		button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
		
		// swfupload_loaded_handler : swfupload_loaded_function,
		// file_dialog_start_handler : file_dialog_start_function,
		// file_queued_handler : file_queued_function,
		// file_queue_error_handler : file_queue_error_function,
		// file_dialog_complete_handler : file_dialog_complete_function,
		// upload_start_handler : upload_start_function,
		// upload_progress_handler : upload_progress_function,
		// upload_error_handler : upload_error_function,
		// upload_success_handler : upload_success_function,
		// upload_complete_handler : upload_complete_function,
		// debug_handler : debug_function,
		
		// custom_settings : {
		// 	custom_setting_1 : "custom_setting_value_1",
		// 	custom_setting_2 : "custom_setting_value_2",
		// 	custom_setting_n : "custom_setting_value_n",
		// },
		
		debug : false
	},
	_fireEvents = function(fu, eventName){
		return function(){
			fu._eventsRegistery[eventName] && _processor[eventName].apply(fu, arguments);
		}
	},
	_processor = {
		swfLoaded: function(){
			this._eventsRegistery.swfLoaded.apply(this, arguments);
		},
		dialogStart: function(){
			this._eventsRegistery.dialogStart.apply(this, arguments);
		},
		fileQueued: function(file){
			this._eventsRegistery.fileQueued.apply(this, arguments);

			if(this._settings.custom_settings && this._settings.custom_settings.autoUpload){
				this.uploader.startUpload();
			}
		},
		queueError: function(file, errorCode, message){
			var errorMsg = {
				code: errorCode,
				message: message,
				detail:''
			};
	        try {
	            switch (errorCode) {
	                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
	                    errorMsg.detail = "文件大小超过限制";
	                break;
	                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
	                    errorMsg.detail = "不能上传0字节文件";
	                break;
	                case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
	                    errorMsg.detail = "文件类型错误";
	                break;
	                case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
	                    errorMsg.detail = "选择文件超过限制";
	                break;
	                default:
	                    if (file !== null) {
	                        errorMsg.detail = "未知错误";
	                    }
	                break;
	            }
	        } catch (ex) {
	        	// console.log(ex);
	        }

	        this._eventsRegistery.queueError.apply(this, [file, errorMsg]);
		},
		dialogComplete: function(){
			this._eventsRegistery.dialogComplete.apply(this, arguments);
		},
		uploadStart: function(){
			this._eventsRegistery.uploadStart.apply(this, arguments);
		},
		uploadProgress: function(file, bytesComplete, bytesTotal){
			var percent = Math.ceil((bytesComplete / bytesTotal) * 100);

			this._eventsRegistery.uploadProgress.apply(this, [file, bytesComplete, bytesTotal, percent]);
		},
		uploadError: function(file, errorCode, message){
			var errorMsg = {
				code: errorCode,
				message: message,
				detail:''
			};

			try {
	            switch (errorCode) {
	                case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
	                	errorMsg.detail = "上传错误: " + message;
	                break;
	                case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
	                    errorMsg.detail = "配置出错";
	                break;
	                case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
	                    errorMsg.detail = "上传失败";
	                break;
	                case SWFUpload.UPLOAD_ERROR.IO_ERROR:
	                    errorMsg.detail = "服务器错误";
	                break;
	                case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
	                    errorMsg.detail = "安全设置错误";
	                break;
	                case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
	                    errorMsg.detail = "上传文件超时限制";
	                break;
	                case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
	                    errorMsg.detail = "文件未找到";
	                break;
	                case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
	                    errorMsg.detail = "校验失败，上传被忽略";
	                break;
	                case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
	                    errorMsg.detail = "上传已取消";
	                break;
	                case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
	                    errorMsg.detail = "上传已停止";
	                break;
	                default:
	                    errorMsg.detail = "未知错误: " + error_code;
	                break;
	            }
	        } catch (ex) {
	//          console.log(ex);
	        }

			this._eventsRegistery.uploadError.apply(this, [file, errorMsg]);
		},
		uploadSuccess: function(file, serverData, responseReceived){
			try {
	            var serverData=$.parseJSON(serverData); 
	        } catch (ex) {
	            // this.debug(ex);
	        }

			this._eventsRegistery.uploadSuccess.apply(this, [file, serverData, responseReceived]);
		},
		uploadComplete: function(){
			this._eventsRegistery.uploadComplete.apply(this, arguments);

			if (this.uploader.getStats().files_queued > 0) {
				this.uploader.startUpload();
			} else {	
				
			}
		}
	};

	var FileUploader = function(settings){
			this.init(settings);

			this.uploader = new SWFUpload(this._settings);
			// console.log(this.uploader);

			this._eventsRegistery = {};
		},
		proto = FileUploader.prototype;

	proto.constructor = FileUploader;

	proto.init = function(settings){
		var _this = this,
			eventsHandlers = {
				swfupload_loaded_handler : _fireEvents(_this, 'swfLoaded'),
				file_dialog_start_handler : _fireEvents(_this, 'dialogStart'),
				file_queued_handler : _fireEvents(_this, 'fileQueued'),
				file_queue_error_handler : _fireEvents(_this, 'queueError'),
				file_dialog_complete_handler : _fireEvents(_this, 'dialogComplete'),
				upload_start_handler : _fireEvents(_this, 'uploadStart'),
				upload_progress_handler : _fireEvents(_this, 'uploadProgress'),
				upload_error_handler : _fireEvents(_this, 'uploadError'),
				upload_success_handler : _fireEvents(_this, 'uploadSuccess'),
				upload_complete_handler : _fireEvents(_this, 'uploadComplete')
			};

		this._settings = $.extend({}, _defaultSettings, settings || {});
		this._settings = $.extend({}, this._settings, eventsHandlers);
	};

	proto.on = function (eventName, func) {
    	this._eventsRegistery[eventName] = func;
    };

	module.exports = FileUploader;
});