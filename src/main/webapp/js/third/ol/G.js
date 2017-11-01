var G = {
	version: '1.0.0'
};

function expose() {
	var old = window.G;

	G.noConflict = function() {
		window.G = old;
		return this;
	};

	window.G = G;
}

// define G for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = G;
} else if (typeof define === 'function' && define.amd) { // define G as an AMD module
	define(P);
}

// define gispace as a global G variable, saving the original G to restore later if needed
if (typeof window !== 'undefined') {
	expose();
}
// 常用工具组合
G.Utils = {
	_stampId: 0
};
/**
 * [去掉字符串的前后空格]
 * @param  {[type]} str [字符串]
 * @return {[type]}     [description]
 */
G.Utils.trim = function(str) {
	return str.trim ? str.trim() : str.replace(/^\s+|\+s+$/g, '');
};
G.Utils.stamp = function(obj) {
	var key = '_g_id_';
	obj[key] = obj[key] || this._stampId++;
	return obj[key];
};
/**
 * [继承]
 * @param  {[type]} Child  [子类]
 * @param  {[type]} Parent [父类]
 * @return {[type]}        [description]
 */
G.Utils.inherits = function(Child, Parent) {
	var F = function() {};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
};
/**
 * [扩展新对象，将源对象自由属性拷贝到目标对象]
 * @param  {[type]} target [description]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
G.Utils.extend = function(target, source) {
	for (var p in source) {
		if (p != 'constructor') {
			if (source.hasOwnProperty(p)) {
				target[p] = source[p];
			}
		}
	}
	return target;
};
// 常用DOM操作 
G.DomUtils = {};
/**
 * [创建新元素]
 * @param  {[type]} tagName   [元素标签]
 * @param  {[type]} className [元素的className]
 * @param  {[type]} parent    [元素的父节点]
 * @param  {[type]} id        [元素的ID]
 * @return {[type]}           [返回的创建的新元素]
 */
G.DomUtils.create = function(tagName, className, parent, id) {
	var element = document.createElement(tagName);
	element.className = className || '';
	if (id) {
		element.id = id;
	}
	if (parent) {
		parent.appendChild(element);
	}
	return element;
};
/**
 * [通过ID获取元素]
 * @param  {[type]} id [元素的ID]
 * @return {[type]}    [description]
 */
G.DomUtils.getId = function(id) {
	return document.getElementById(id);
};
/**
 * [显示传入的元素]
 * @param  {[type]} element [需要显示的元素]
 * @return {[type]}         [description]
 */
G.DomUtils.show = function(element) {
	element.style.display = 'block';
};
/**
 * [影藏传入的元素]
 * @param  {[type]} element [需要隐藏的元素]
 * @return {[type]}         [description]
 */
G.DomUtils.hide = function(element) {
	element.style.display = 'none';
};
/**
 * [切换传入的元素的显示影藏]
 * @param  {[type]} element [需要切换的元素]
 * @return {[type]}         [description]
 */
G.DomUtils.toggle = function(element) {
	if (element.style.display === 'none') {
		G.DomUtils.show(element);
	} else if (element.style.display === 'block') {
		G.DomUtils.hide(element);
	}
};
/**
 * [获取元素相对于viewPort的绝对坐标值]
 * @param  {[HTMLElement]} object [传入的DOM元素]
 * @return {[Object]}        [返回object的top left]
 * @example
 * return {top:20,left:30}
 */
G.DomUtils.getPosition = function(object) {
	var position = {
		left: 0,
		top: 0
	}
	while (object && object.offsetParent) {
		position.left += object.offsetLeft;
		position.top += object.offsetTop;
		object = object.offsetParent;
	}
	return position;
};
/**
 * [模板引擎]
 * @param  {[String]} template [模板]
 * @param  {[Object]} data     [数据]
 * @return {[String]}          [模板编译后的字符串]
 */
G.DomUtils.render = function(template, data) {
	if (typeof template != 'string') {
		return;
	}
	var reg = new RegExp("\{([^\}]+)}", 'g'),
		match;
	reg.lastIndex = 0;
	while (match = reg.exec(template)) {
		if (data[match[1]]) {
			template = template.replace(match[0], data[match[1]]);
			reg.lastIndex = 0;
		} else {
			template = template.replace(match[0], '');
		}
	}
	return template;
};
/**
 * [移除掉当前元素]
 * @param  {[type]} element [DOM元素]
 * @param  {[type]} parent  [父节点元素]
 * @return {[type]}         [description]
 */
G.DomUtils.remove = function(element, parent) {
	if (parent && element) {
		parent.removeChild(element);
	}
};
// 常用Event操作
G.Event = {};
/**
 * [为DOM添加事件监听]
 * @param {[HTMLElement]} element [dom]
 * @param {[String]} type    [DOM事件名称]
 * @param {[Function]} handler [事件响应函数]
 */
G.Event.addListener = function(element, type, handler) {
	var id = G.DomUtils.getId(element);
	// if (element = id) {
	var type = type.replace(/^on/, '');
	if ('addEventListener' in element) {
		element.addEventListener(type, handler, false);
	} else if ('attachEvent' in element) {
		element.attachEvent('on' + type, handler);
	}
	// }
};
/**
 * [移除DOM上的事件监听]
 * @param {[HTMLElement]} element [dom]
 * @param {[String]} type    [DOM事件名称]
 * @param {[Function]} handler [事件响应函数]
 */
G.Event.removeListener = function(element, type, handler) {
	var id = G.DomUtils.getId(element);
	if (element = id) {
		type = type.replace(/^on/, '');
		if ('removeEventListener' in element) {
			element.removeEventListener(type, handler, false);
		} else if ('detachEvent' in element) {
			element.detachEvent('on' + type, handler);
		}
	}
};
/**
 * [获取DOM事件event对象]
 * @param  {[Object]} element [DOM event 对象]
 * @return {[Object]}         [DOM event 对象]
 */
G.Event.getTarget = function(element) {
	return element || window.element;
};
/**
 * [阻止事件默认操作]
 * @param  {[Object]} element [DOM event 对象]
 * @return {[Void]}         [无返回值]
 */
G.Event.preventDefault = function(element) {
	var ele = G.Event.getTarget(element);
	if (ele.preventDefault) {
		ele.preventDefault();
	} else {
		ele.returnValue = true;
	}
};
/**
 * [阻止浏览器事件冒泡]
 * @param  {[Object]} element [DOM event 对象]
 * @return {[Void]}         [无返回值]
 */
G.Event.stopPropagation = function(element) {
	var ele = G.Event.getTarget(element);
	if (ele.stopPropagation) {
		ele.stopPropagation();
	} else {
		ele.cancelBubble = true;
	}
};
/**
 * [阻止浏览器默认事件并阻止事件冒泡]
 * @param  {[Object]} element [DOM event 对象]
 * @return {[Void]}         [无返回值]
 */
G.Event.stopAndPrevent = function(element) {
	G.Event.preventDefault(element);
	G.Event.stopPropagation(element);
};

// Control 组件
G.Control = function Control(opts) {
	this._type = "Control";
	this._map = null;
	this._mapContainer = null;
	opts = opts || {};
	this._opts = {};
	this._visible = opts['visible'] != void 0 ? opts['visible'] : true;
};
G.Control.prototype = {
	_init: function(map) {
		if (this._container) {
			return;
		} else {
			this._container = this['initialize'](map);
		}
	},
	initialize: function(map) {
		this.map = map;
		this._mapContainer = map._map.getViewport().parentNode;

	},
	render: function() {
		var div = G.DomUtils.create('div');
		div.style.cssText = ("position:absolute;z-index:" + this._opts.zindex);
		div.setAttribute('unselectable', 'on');
		this._container = div;

		this._mapContainer.appendChild(div);
		if (!this._visible) {
			this._container.style.display = 'none';
			this._visible = false;
		}
		// var me = this;
		// me._position();


		var c = this._container;
		if (!c) {
			return;
		}
		c.style.top = 'auto';
		c.style.left = 'auto';
		c.style.bottom = 'auto';
		c.style.right = 'auto';
		var x = this._opts.offset[0],
			y = this._opts.offset[1];
		switch (this._opts.anchor) {
			case 'topleft':
				c.style.top = y + 'px';
				c.style.left = x + 'px';
				break;
			case 'topright':
				c.style.top = y + 'px';
				c.style.right = x + 'px';
				break;
			case 'bottomleft':
				c.style.bottom = y + 'px';
				c.style.left = x + 'px';
				break;
			case 'bottomright':
				c.style.bottom = y + 'px';
				c.style.right = x + 'px';
				break;
			default:
				break;
		};
	},
	// 计算控件位置
	_position: function() {
		var c = this._container;
		if (!c) {
			return;
		}
		c.style.top = 'auto';
		c.style.left = 'auto';
		c.style.bottom = 'auto';
		c.style.right = 'auto';
		var x = this._opts.offset[0],
			y = this._opts.offset[1];
		switch (this._opts.anchor) {
			case 'topleft':
				c.style.top = y + 'px';
				c.style.left = x + 'px';
				break;
			case 'topright':
				c.style.top = y + 'px';
				c.style.right = x + 'px';
				break;
			case 'bottomleft':
				c.style.bottom = y + 'px';
				c.style.left = x + 'px';
				break;
			case 'bottomright':
				c.style.bottom = y + 'px';
				c.style.right = x + 'px';
				break;
			default:
				break;
		}

	},
	// 隐藏控件
	"hide": function() {
		if (!this._container) {
			return;
		}
		G.DomUtils.hide(this._container);
		this._visible = false;
	},
	// 显示控件
	"show": function() {
		if (!this._container) {
			return;
		}
		G.DomUtils.show(this._container);
		this._visible = true;
	},
	// 设置锚点
	"setAnchor": function(anchor) {
		this._opts.anchor = anchor;
		this._position();
	},
	// 得到锚点
	"getAnchor": function() {
		return this._opts.anchor;
	},
	// 得到偏移位置
	"getOffset": function() {
		return this._opts.offset;
	},
	// 设置偏移位置
	"setOffset": function(offset) {
		if (offset) {
			this._opts.offset = offset.slice(0, 2);
			this._position();
		}
	}
};

G.ajax = function(options) {
	options = options || {
		url: ""
	};
	options.type = options.type || 'GET';
	options.dataType = options.dataType || 'json';
	options.headers = options.headers || {};
	options.timeout = parseInt(options.timeout) || 0;
	options.success = options.success || function() {};
	options.error = options.error || function() {};
	options.async = typeof options.async === 'undefined' ? true : options.async;

	var client = new XMLHttpRequest();
	if (options.timeout > 0) {
		client.timeout = options.timeout;
		client.ontimeout = function() {
			options.error('timeout', 'timeout', client);
		}
	}
	client.open(options.type, options.url, options.async);

	for (var i in options.headers) {
		if (options.headers.hasOwnProperty(i)) {
			client.setRequestHeader(i, options.headers[i]);
		}
	}

	client.send(options.data);
	client.onreadystatechange = function() {
		if (this.readyState == 4 && (this.status == 200 || this.status == 304)) {
			var data = this.responseText;
			var contentType = this.getResponseHeader('Content-Type');
			if (options.dataType === 'json' || (contentType && contentType.match(/json/))) {
				data = JSON.parse(this.responseText);
			}
			options.success(data, this.statusText, this);
		} else if (this.readyState == 4) {
			options.error(this.status, this.statusText, this);
		}
	};

	if (options.async == false) {
		if (client.readyState == 4 && client.status == 200) {
			options.success(client.responseText, client);
		} else if (client.readyState == 4) {
			options.error(client.status, client.statusText, client);
		}
	}
};