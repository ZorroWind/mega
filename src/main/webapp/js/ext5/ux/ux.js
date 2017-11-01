/* 
 *	Notification extension for Ext JS 4.0.2+
 *	Version: 2.1.3
 *
 *	Copyright (c) 2011 Eirik Lorentsen (http://www.eirik.net/)
 *
 *	Follow project on GitHub: https://github.com/EirikLorentsen/Ext.ux.window.Notification
 *
 *	Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 *	and GPL (http://opensource.org/licenses/GPL-3.0) licenses.
 *
 */

Ext.define('Ext.ux.window.Notification', {
	extend: 'Ext.window.Window',
	alias: 'widget.uxNotification',

	cls: 'ux-notification-window',
	autoClose: true,
	autoHeight: true,
	plain: false,
	draggable: false,
	shadow: false,
	focus: Ext.emptyFn,

	// For alignment and to store array of rendered notifications. Defaults to document if not set.
	manager: null,

	useXAxis: false,

	// Options: br, bl, tr, tl, t, l, b, r
	position: 'br',

	// Pixels between each notification
	spacing: 6,

	// Pixels from the managers borders to start the first notification
	paddingX: 30,
	paddingY: 10,

	slideInAnimation: 'easeIn',
	slideBackAnimation: 'bounceOut',
	slideInDuration: 1500,
	slideBackDuration: 1000,
	hideDuration: 500,
	autoCloseDelay: 7000,
	stickOnClick: true,
	stickWhileHover: true,

	// Private. Do not override!
	isHiding: false,
	isFading: false,
	destroyAfterHide: false,
	closeOnMouseOut: false,

	// Caching coordinates to be able to align to final position of siblings being animated
	xPos: 0,
	yPos: 0,

	statics: {
		defaultManager: {
			el: null
		}
	},

	initComponent: function() {
		var me = this;

		// Backwards compatibility
		if (Ext.isDefined(me.corner)) {
			me.position = me.corner;
		}
		if (Ext.isDefined(me.slideDownAnimation)) {
			me.slideBackAnimation = me.slideDownAnimation;
		}
		if (Ext.isDefined(me.autoDestroyDelay)) {
			me.autoCloseDelay = me.autoDestroyDelay;
		}
		if (Ext.isDefined(me.autoHideDelay)) {
			me.autoCloseDelay = me.autoHideDelay;
		}
		if (Ext.isDefined(me.autoHide)) {
			me.autoClose = me.autoHide;
		}
		if (Ext.isDefined(me.slideInDelay)) {
			me.slideInDuration = me.slideInDelay;
		}
		if (Ext.isDefined(me.slideDownDelay)) {
			me.slideBackDuration = me.slideDownDelay;
		}
		if (Ext.isDefined(me.fadeDelay)) {
			me.hideDuration = me.fadeDelay;
		}

		// 'bc', lc', 'rc', 'tc' compatibility
		me.position = me.position.replace(/c/, '');

		me.updateAlignment(me.position);

		me.setManager(me.manager);

		me.callParent(arguments);
	},

	onRender: function() {
		var me = this;
		me.callParent(arguments);

		me.el.hover(
			function () {
				me.mouseIsOver = true;
			},
			function () {
				me.mouseIsOver = false;
				if (me.closeOnMouseOut) {
					me.closeOnMouseOut = false;
					me.close();
				}
			},
			me
		);

	},
	
	updateAlignment: function (position) {
		var me = this;

		switch (position) {
			case 'br':
				me.paddingFactorX = -1;
				me.paddingFactorY = -1;
				me.siblingAlignment = "br-br";
				if (me.useXAxis) {
					me.managerAlignment = "bl-br";
				} else {
					me.managerAlignment = "tr-br";
				}
				break;
			case 'bl':
				me.paddingFactorX = 1;
				me.paddingFactorY = -1;
				me.siblingAlignment = "bl-bl";
				if (me.useXAxis) {
					me.managerAlignment = "br-bl";
				} else {
					me.managerAlignment = "tl-bl";
				}
				break;
			case 'tr':
				me.paddingFactorX = -1;
				me.paddingFactorY = 1;
				me.siblingAlignment = "tr-tr";
				if (me.useXAxis) {
					me.managerAlignment = "tl-tr";
				} else {
					me.managerAlignment = "br-tr";
				}
				break;
			case 'tl':
				me.paddingFactorX = 1;
				me.paddingFactorY = 1;
				me.siblingAlignment = "tl-tl";
				if (me.useXAxis) {
					me.managerAlignment = "tr-tl";
				} else {
					me.managerAlignment = "bl-tl";
				}
				break;
			case 'b':
				me.paddingFactorX = 0;
				me.paddingFactorY = -1;
				me.siblingAlignment = "b-b";
				me.useXAxis = 0;
				me.managerAlignment = "t-b";
				break;
			case 't':
				me.paddingFactorX = 0;
				me.paddingFactorY = 1;
				me.siblingAlignment = "t-t";
				me.useXAxis = 0;
				me.managerAlignment = "b-t";
				break;
			case 'l':
				me.paddingFactorX = 1;
				me.paddingFactorY = 0;
				me.siblingAlignment = "l-l";
				me.useXAxis = 1;
				me.managerAlignment = "r-l";
				break;
			case 'r':
				me.paddingFactorX = -1;
				me.paddingFactorY = 0;
				me.siblingAlignment = "r-r";
				me.useXAxis = 1;
				me.managerAlignment = "l-r";
				break;
			}
	},
	
	getXposAlignedToManager: function () {
		var me = this;

		var xPos = 0;

		// Avoid error messages if the manager does not have a dom element
		if (me.manager && me.manager.el && me.manager.el.dom) {
			if (!me.useXAxis) {
				// Element should already be aligned vertically
				return me.el.getLeft();
			} else {
				// Using getAnchorXY instead of getTop/getBottom should give a correct placement when document is used
				// as the manager but is still 0 px high. Before rendering the viewport.
				if (me.position == 'br' || me.position == 'tr' || me.position == 'r') {
					xPos += me.manager.el.getAnchorXY('r')[0];
					xPos -= (me.el.getWidth() + me.paddingX);
				} else {
					xPos += me.manager.el.getAnchorXY('l')[0];
					xPos += me.paddingX;
				}
			}
		}

		return xPos;
	},

	getYposAlignedToManager: function () {
		var me = this;

		var yPos = 0;

		// Avoid error messages if the manager does not have a dom element
		if (me.manager && me.manager.el && me.manager.el.dom) {
			if (me.useXAxis) {
				// Element should already be aligned horizontally
				return me.el.getTop();
			} else {
				// Using getAnchorXY instead of getTop/getBottom should give a correct placement when document is used
				// as the manager but is still 0 px high. Before rendering the viewport.
				if (me.position == 'br' || me.position == 'bl' || me.position == 'b') {
					yPos += me.manager.el.getAnchorXY('b')[1];
					yPos -= (me.el.getHeight() + me.paddingY);
				} else {
					yPos += me.manager.el.getAnchorXY('t')[1];
					yPos += me.paddingY;
				}
			}
		}

		return yPos;
	},

	getXposAlignedToSibling: function (sibling) {
		var me = this;

		if (me.useXAxis) {
			if (me.position == 'tl' || me.position == 'bl' || me.position == 'l') {
				// Using sibling's width when adding
				return (sibling.xPos + sibling.el.getWidth() + sibling.spacing);
			} else {
				// Using own width when subtracting
				return (sibling.xPos - me.el.getWidth() - me.spacing);
			}
		} else {
			return me.el.getLeft();
		}

	},

	getYposAlignedToSibling: function (sibling) {
		var me = this;

		if (me.useXAxis) {
			return me.el.getTop();
		} else {
			if (me.position == 'tr' || me.position == 'tl' || me.position == 't') {
				// Using sibling's width when adding
				return (sibling.yPos + sibling.el.getHeight() + sibling.spacing);				
			} else {
				// Using own width when subtracting
				return (sibling.yPos - me.el.getHeight() - sibling.spacing);
			}
		}
	},

	getNotifications: function (alignment) {
		var me = this;

		if (!me.manager.notifications[alignment]) {
			me.manager.notifications[alignment] = [];
		}

		return me.manager.notifications[alignment];
	},

	setManager: function (manager) {
		var me = this;

		me.manager = manager;

		if (typeof me.manager == 'string') {
			me.manager = Ext.getCmp(me.manager);
		}

		// If no manager is provided or found, then the static object is used and the el property pointed to the body document.
		if (!me.manager) {
			me.manager = me.statics().defaultManager;

			if (!me.manager.el) {
				me.manager.el = Ext.getBody();
			}
		}
		
		if (typeof me.manager.notifications == 'undefined') {
			me.manager.notifications = {};
		}
	},
	
	beforeShow: function () {
		var me = this;

		if (me.stickOnClick) {
			if (me.body && me.body.dom) {
				Ext.fly(me.body.dom).on('click', function () {
					me.cancelAutoClose();
					me.addCls('notification-fixed');
				}, me);
			}
		}

		if (me.autoClose) {
			me.task = new Ext.util.DelayedTask(me.doAutoClose, me);
			me.task.delay(me.autoCloseDelay);
		}

		// Shunting offscreen to avoid flicker
		me.el.setX(-10000);
		me.el.setOpacity(1);
		
	},

	afterShow: function () {
		var me = this;

		me.callParent(arguments);

		var notifications = me.getNotifications(me.managerAlignment);

		if (notifications.length) {
			me.el.alignTo(notifications[notifications.length - 1].el, me.siblingAlignment, [0, 0]);
			me.xPos = me.getXposAlignedToSibling(notifications[notifications.length - 1]);
			me.yPos = me.getYposAlignedToSibling(notifications[notifications.length - 1]);
		} else {
			me.el.alignTo(me.manager.el, me.managerAlignment, [(me.paddingX * me.paddingFactorX), (me.paddingY * me.paddingFactorY)], false);
			me.xPos = me.getXposAlignedToManager();
			me.yPos = me.getYposAlignedToManager();
		}

		Ext.Array.include(notifications, me);

		// Repeating from coordinates makes sure the windows does not flicker into the center of the viewport during animation
		me.el.animate({
			from: {
				x: me.el.getX(),
				y: me.el.getY()
			},
			to: {
				x: me.xPos,
				y: me.yPos,
				opacity: 1
			},
			easing: me.slideInAnimation,
			duration: me.slideInDuration,
			dynamic: true
		});

	},
	
	slideBack: function () {
		var me = this;

		var notifications = me.getNotifications(me.managerAlignment);
		var index = Ext.Array.indexOf(notifications, me)

		// Not animating the element if it already started to hide itself or if the manager is not present in the dom
		if (!me.isHiding && me.el && me.manager && me.manager.el && me.manager.el.dom && me.manager.el.isVisible()) {

			if (index) {
				me.xPos = me.getXposAlignedToSibling(notifications[index - 1]);
				me.yPos = me.getYposAlignedToSibling(notifications[index - 1]);
			} else {
				me.xPos = me.getXposAlignedToManager();
				me.yPos = me.getYposAlignedToManager();
			}

			me.stopAnimation();

			me.el.animate({
				to: {
					x: me.xPos,
					y: me.yPos
				},
				easing: me.slideBackAnimation,
				duration: me.slideBackDuration,
				dynamic: true
			});
		}
	},

	cancelAutoClose: function() {
		var me = this;

		if (me.autoClose) {
			me.task.cancel();
		}
	},

	doAutoClose: function () {
		var me = this;

		if (!(me.stickWhileHover && me.mouseIsOver)) {
			// Close immediately
			me.close();
		} else {
			// Delayed closing when mouse leaves the component.
			me.closeOnMouseOut = true;
		}
	},

	removeFromManager: function () {
		var me = this;

		if (me.manager) {
			var notifications = me.getNotifications(me.managerAlignment);
			var index = Ext.Array.indexOf(notifications, me);
			if (index != -1) {
				// Requires Ext JS 4.0.2
				Ext.Array.erase(notifications, index, 1);

				// Slide "down" all notifications "above" the hidden one
				for (;index < notifications.length; index++) {
					notifications[index].slideBack();
				}
			}
		}
	},

	hide: function () {
		var me = this;

		if (me.isHiding) {
			if (!me.isFading) {
				me.callParent(arguments);
				// Must come after callParent() since it will pass through hide() again triggered by destroy()
				me.isHiding = false;
			}
		} else {
			// Must be set right away in case of double clicks on the close button
			me.isHiding = true;
			me.isFading = true;

			me.cancelAutoClose();

			if (me.el) {
				me.el.fadeOut({
					opacity: 0,
					easing: 'easeIn',
					duration: me.hideDuration,
					remove: me.destroyAfterHide,
					listeners: {
						afteranimate: function () {
							me.isFading = false;
							me.removeCls('notification-fixed');
							me.removeFromManager();
							me.hide(me.animateTarget, me.doClose, me);
						}
					}
				});
			}
		}

		return me;
	},

	destroy: function () {
		var me = this;
		if (!me.hidden) {
			me.destroyAfterHide = true;
			me.hide(me.animateTarget, me.doClose, me);
		} else {
			me.callParent(arguments);
		}
	}

});

/*
* @author wangzilong
* update Ext - 4.1 27/04/2012
* 
* @author ebett
* update Ext 5.1.0 19/03/2015
*/
Ext.define('Ext.ux.form.field.DateTimeField', {
	  extend: 'Ext.form.field.Date',
	  alias: 'widget.mdatetimefield',
	  //requires: ['Ext.ux.DateTimePicker'],

	  initComponent: function() {
		  this.format = this.format + ' ' + 'H:i:s';
		  this.callParent();
	  },
	  //Fix auto-close picker
	 collapseIf: function(e) {
	  	var me = this;
 
	  	if (!me.isDestroyed && !e.within(me.bodyEl, false, true) && !e.within(me.picker.el, false, true)) {
			me.collapse();
	  	}
    },
	  // overwrite
	  createPicker: function() {
		  var me = this,
			  format = Ext.String.format;

		  return Ext.create('Ext.ux.DateTimePicker', {
			    ownerCt: me.ownerCt,
			    renderTo: document.body,
			    floating: true,
			    hidden: true,
			    focusOnShow: true,
			    minDate: me.minValue,
			    maxDate: me.maxValue,
			    disabledDatesRE: me.disabledDatesRE,
			    disabledDatesText: me.disabledDatesText,
			    disabledDays: me.disabledDays,
			    disabledDaysText: me.disabledDaysText,
			    format: me.format,
			    showToday: me.showToday,
			    startDay: me.startDay,
			    minText: format(me.minText, me.formatDate(me.minValue)),
			    maxText: format(me.maxText, me.formatDate(me.maxValue)),
			    listeners: {
				    scope: me,
				    select: me.onSelect
			    },
			    keyNavConfig: {
				    esc: function() {
					    me.collapse();
				    }
			    }
		    });
	  },
	onSelect: function(m, d) {
        var me = this;
		var d=Ext.Date.format(d, this.format);
        me.setValue(d);
        me.fireEvent('select', me, d);
        me.collapse();
    }
  });

  /**
* @author wangzilong
* update Ext - 4.1 27/04/2012
* 
* @author ebett
* update Ext 5.1.0 19/03/2015
*/
Ext.define('Ext.ux.form.field.TimePickerField', {
  extend: 'Ext.form.field.Base',
  alias: 'widget.timepickerfield',
  alternateClassName: 'Ext.form.field.TimePickerField',
  requires: [
    'Ext.form.field.Number'
  ],

  // 隐藏BaseField的输入框 , hidden basefield's input
  inputType: 'hidden',

  //style: 'padding:4px 0 0 0;margin-bottom:0px',
  style: 'padding: 0px 0px 0px 10px',
  /**
   * @cfg {String} value
   * initValue, format: 'H:i:s'
   */
  value: null,

  /**
  * @cfg {Object} spinnerCfg
  * 数字输入框参数, number input config
  */
  spinnerCfg: {
	  width: 50
  },

  /** Override. */
  initComponent: function() {
	  var me = this;

	  me.value = me.value || Ext.Date.format(new Date(), 'H:i:s');

	  me.callParent();// called setValue

	  me.spinners = [];
	  var cfg = Ext.apply({}, me.spinnerCfg, {
			readOnly: me.readOnly,
			disabled: me.disabled,				
			style: 'float: left',
			listeners: {
				change: {
					fn: me.onSpinnerChange,
					scope: me
				}
			}			
		});

	  me.hoursSpinner = Ext.create('Ext.form.field.Number', Ext.apply({}, cfg, {
			  minValue: 0,
			  maxValue: 23
		  }));
	  me.minutesSpinner = Ext.create('Ext.form.field.Number', Ext.apply({}, cfg, {
			  minValue: 0,
			  maxValue: 59
		  }));
	  // TODO timeformat maybe second field is not always need.
	  me.secondsSpinner = Ext.create('Ext.form.field.Number', Ext.apply({}, cfg, {
			  minValue: 0,
			  maxValue: 59
		  }));

	  me.spinners.push(me.hoursSpinner, me.minutesSpinner, me.secondsSpinner);
	
	
  },
  /**
	  * @private
	  * Override.
	  */
onRender: function() {		
  var me = this/*, spinnerWrapDom*/, spinnerWrap;
  
  me.callParent();

	// render to original BaseField input td
	spinnerWrap = Ext.get(Ext.DomQuery.selectNode('div', this.el.dom));
	me.callSpinnersFunction('render', spinnerWrap);

	/*Ext.core.DomHelper.append(spinnerWrap, {
		tag: 'div',
		cls: 'x-form-clear-left'
	});*/

	this.setRawValue(this.value);		
},

  _valueSplit: function(v) {
	  if(Ext.isDate(v)) {
		  v = Ext.Date.format(v, 'H:i:s');
	  }
	  var split = v.split(':');
	  return {
		  h: split.length > 0 ? split[0] : 0,
		  m: split.length > 1 ? split[1] : 0,
		  s: split.length > 2 ? split[2] : 0
	  };
  },
  onSpinnerChange: function() {
	  if(!this.rendered) {
		  return;
	  }
	  this.fireEvent('change', this, this.getValue(), this.getRawValue());
  },
  // 依次调用各输入框函数, call each spinner's function
  callSpinnersFunction: function(funName, args) {
	  for(var i = 0; i < this.spinners.length; i++) {
		  this.spinners[i][funName](args);
	  }
  },
  // @private get time as object,
  getRawValue: function() {
	  if(!this.rendered) {
		  var date = this.value || new Date();
		  return this._valueSplit(date);
	  } else {
		  return {
			  h: this.hoursSpinner.getValue(),
			  m: this.minutesSpinner.getValue(),
			  s: this.secondsSpinner.getValue()
		  };
	  }
  },

  // private
  setRawValue: function(value) {
	  value = this._valueSplit(value);
	  if(this.hoursSpinner) {
		  this.hoursSpinner.setValue(value.h);
		  this.minutesSpinner.setValue(value.m);
		  this.secondsSpinner.setValue(value.s);
	  }
  },
  // overwrite
  getValue: function() {
	  var v = this.getRawValue();
	  return Ext.String.leftPad(v.h, 2, '0') + ':' + Ext.String.leftPad(v.m, 2, '0') + ':'
		+ Ext.String.leftPad(v.s, 2, '0');
  },
  // overwrite
  setValue: function(value) {
	  this.value = Ext.isDate(value) ? Ext.Date.format(value, 'H:i:s') : value;
	  if(!this.rendered) {
		  return;
	  }
	  this.setRawValue(this.value);
	  this.validate();
  },
  // overwrite
  disable: function() {
	  this.callParent();
	  this.callSpinnersFunction('disable', arguments);
  },
  // overwrite
  enable: function() {
	  this.callParent();
	  this.callSpinnersFunction('enable', arguments);
  },
  // overwrite
  setReadOnly: function() {
	  this.callParent();
	  this.callSpinnersFunction('setReadOnly', arguments);
  },
  // overwrite
  clearInvalid: function() {
	  this.callParent();
	  this.callSpinnersFunction('clearInvalid', arguments);
  },
  // overwrite
  isValid: function(preventMark) {
	  return this.hoursSpinner.isValid(preventMark) && this.minutesSpinner.isValid(preventMark)
		&& this.secondsSpinner.isValid(preventMark);
  },
  // overwrite
  validate: function() {
	  return this.hoursSpinner.validate() && this.minutesSpinner.validate() && this.secondsSpinner.validate();
  }
});

/*
* @author wangzilong
* update Ext - 4.1 27/04/2012
* 
* @author ebett
* update Ext 5.1.0 19/03/2015
*/
Ext.define('Ext.ux.DateTimePicker', {
	extend: 'Ext.picker.Date',
	alias: 'widget.datetimepicker',
	requires: [
		'Ext.ux.form.field.TimePickerField', 
		'Ext.button.Button'
	],
	todayText: '现在',
	timeLabel: '时间',
	applyLabel: '确定',	
	childEls: [
		'innerEl', 'eventEl', 'prevEl', 'nextEl', 'middleBtnEl', 'footerEl', 'acceptEl'
	],
	initComponent: function() {
	  // keep time part for value
	  var value = this.value || this.config.value || new Date();
	  
	  this.callParent();
	  this.on('show', function(){
		this.timefield.hoursSpinner.focus();	
	  });
		/**
		 * @event todayClick
		 * Fires when the today button is clicked
		 * @param {Ext.picker.Date} this DatePicker
		 * @param {Date} date The selected date
		 */
		
	 
	  this.value = value;
	},

	  /**
	 * @cfg
	 * @inheritdoc
	 */
	renderTpl: [
		'<div id="{id}-innerEl" data-ref="innerEl">',
			'<div class="{baseCls}-header">',
				'<div id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-prev {baseCls}-arrow" role="button" title="{prevText}"></div>',
				'<div id="{id}-middleBtnEl" data-ref="middleBtnEl" class="{baseCls}-month" role="heading">{%this.renderMonthBtn(values, out)%}</div>',
				'<div id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-next {baseCls}-arrow" role="button" title="{nextText}"></div>',
			'</div>',
			'<table role="grid" id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" {%',
				// If the DatePicker is focusable, make its eventEl tabbable.
				// Note that we're looking at the `focusable` property because
				// calling `isFocusable()` will always return false at that point
				// as the picker is not yet rendered.
				'if (values.$comp.focusable) {out.push("tabindex=\\\"0\\\"");}',
			'%} cellspacing="0">',
				'<thead><tr role="row">',
					'<tpl for="dayNames">',
						'<th role="columnheader" class="{parent.baseCls}-column-header" aria-label="{.}">',
							'<div role="presentation" class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
						'</th>',
					'</tpl>',
				'</tr></thead>',
				'<tbody><tr role="row">',
					'<tpl for="days">',
						'{#:this.isEndOfWeek}',
						'<td role="gridcell">',
							'<div hidefocus="on" class="{parent.baseCls}-date"></div>',
						'</td>',
					'</tpl>',
				'</tr></tbody>',
			'</table>',
			'<div role="presentation" class="x-datepicker-footer ux-timefield"></div>',
			'<table role="grid" id="{id}-footerEl" data-ref="footerEl" class="{baseCls}-inner" cellspacing="0">',
			'<tbody><tr role="row" style="text-align:center;">',
			'<tpl if="showToday">',
				'<td role="gridcell"><div role="presentation">{%this.renderTodayBtn(values, out)%}</div></td>',
			'</tpl>',
			'<td role="gridcell"><div id="{id}-acceptEl" data-ref="acceptEl" role="presentation">{%this.renderAcceptBtn(values, out)%}</div></td>',
			'</tr></tbody>',
			'</table>',
		'</div>',
		{
			firstInitial: function(value) {
				return Ext.picker.Date.prototype.getDayInitial(value);
			},
			isEndOfWeek: function(value) {
				// convert from 1 based index to 0 based
				// by decrementing value once.
				value--;
				var end = value % 7 === 0 && value !== 0;
				return end ? '</tr><tr role="row">' : '';
			},
			renderTodayBtn: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
			},
			renderMonthBtn: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
			},
			renderAcceptBtn: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.acceptBtn.getRenderTree(), out);
			}
		}
	],	
	beforeRender: function () {
		var me = this;
		me.acceptBtn = Ext.create('Ext.button.Button',{
			ownerCt: me,
			ownerLayout: me.getComponentLayout(),
			text: me.applyLabel,                
			handler: me.acceptClick,
			width: 60,
			scope: me
		});
		me.timefield = Ext.create('Ext.ux.form.field.TimePickerField', {
			ownerCt: me,
			ownerLayout: me.getComponentLayout(),
			fieldLabel: me.timeLabel,
			//width: 160,
			labelWidth: 30,
			value: Ext.Date.format(me.value, 'H:i:s')
		});

		me.callParent();
		
		if (me.showToday) {
			me.todayBtn.setWidth(60);
		}
	 },
	 getRefItems: function() {
		  var results = this.callParent();
		results.push(this.timefield);
		results.push(this.acceptBtn);
		return results;
	},
	 privates: {
		finishRenderChildren: function () {
			this.callParent();
			this.acceptBtn.finishRender();
		}
	},
	onRender: function(container, position) {
		this.callParent(arguments);
		this.timefield.render(this.el.child('div div.ux-timefield'));
		//this.timefield.on('change', this.timeChange, this);
	},
	acceptClick: function(tf, time, rawtime){
		var me=this;
		me.fireEvent('select', me, me.value);
		if(me.handler) {
			me.handler.call(me.scope || me, me, me.value);
		}
		me.onSelect();
	},
	// listener 时间域修改, timefield change
	timeChange: function(tf, time, rawtime) {
		this.setValue(this.fillDateTime(this.value));	  
	},
	// @private
	fillDateTime: function(value) {
	  if(this.timefield) {
		  var rawtime = this.timefield.getRawValue();
		  value.setHours(rawtime.h);
		  value.setMinutes(rawtime.m);
		  value.setSeconds(rawtime.s);
	  }
	  return value;
	},
	// @private
	changeTimeFiledValue: function(value) {
	  //this.timefield.un('change', this.timeChange, this);
	  this.timefield.setValue(this.value);
	  //this.timefield.on('change', this.timeChange, this);
	},

	/* TODO 时间值与输入框绑定, 考虑: 创建this.timeValue 将日期和时间分开保存. */
	// overwrite
	setValue: function(value) {
	  this.value = value;
	  // this.value = value ? Ext.Date.clearTime(value, true) : null;
	  this.changeTimeFiledValue(value);
	  return this.update(this.value);
	},
	// overwrite
	getValue: function() {
	  return this.fillDateTime(this.value);
	},

	// overwrite : fill time before setValue
	handleDateClick: function(e, t) {
	  var me = this,
		  handler = me.handler;

	  e.stopEvent();
	  if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
		  me.doCancelFocus = me.focusOnSelect === false;
		  me.setValue(this.fillDateTime(new Date(t.dateValue))); // overwrite: fill time before setValue
		  delete me.doCancelFocus;
		  me.fireEvent('select', me, me.value);
		  if(handler) {
			  handler.call(me.scope || me, me, me.value);
		  }
		  me.onSelect();
	  }
	},

	// overwrite : fill time before setValue
	selectToday: function() {
	  var me = this,
		  btn = me.todayBtn,
		  handler = me.handler;

	  if(btn && !btn.disabled) {
		  // me.setValue(Ext.Date.clearTime(new Date())); //src
		  me.setValue(new Date());// overwrite: fill time before setValue
		  me.fireEvent('select', me, me.value);
		  me.fireEvent('todayClick', me, me.value);
		  
		  if(handler) {
			  handler.call(me.scope || me, me, me.value);
		  }
		  me.onSelect();
	  }
	  return me;
	}
	});

Ext.define('Ext.ux.DateTimeField',{
	extend:'Ext.form.field.Text',
	alias: 'widget.datetimefield',
	dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'',minDate:'',
	opposite:false,disabledDates:null,
	triggerCls : Ext.baseCSSPrefix + 'form-date-trigger',
	triggers :{
		foo: {
			cls: Ext.baseCSSPrefix + 'form-date-trigger',
			handler: this.showPicker
		}
	},
	
	initComponent:function(){
		this.loadLib();
		this.callParent(arguments);
		this.on('afterrender',this._afterrender,this);
		
	},
	loadLib:function(){
		if(typeof(WdatePicker)=='undefined')
			Ext.Loader.loadScript({
				url:'js/third/My97DatePicker/WdatePicker.js'
			});
	},

	showPicker:function(){
		var el=this.getEl().down('input');
		WdatePicker({
			el:el.getId(),dateFmt:this.dateFmt,maxDate:this.maxDate,minDate:this.minDate,
			opposite:this.opposite,disabledDates:this.disabledDates,
			onpicked:Ext.bind(this.onpicked,this)
		});
	},
	onpicked:function(dp){
		var nv=dp.cal.getNewDateStr();
		var ov=this.getValue();
		this.setValue(nv);
		this.fireEventArgs('change',[this,nv,ov]);
	},

	_afterrender:function(){
		this.mon(this.getEl(),'click',this.showPicker,this);
	}
});



Ext.define('Ext.ux.tab.Toolbar', {
    alias : 'plugin.tabtoolbar',

    constructor : function(config) {
        Ext.apply(this, config || {});
    },

    /**
     * @cfg {String} position The position where the toolbar will appear inside the tabbar. Supported values are
     *      'left' and 'right' (defaults to right).
     */
    position : 'right',

    // private
    init : function(tabPanel) {
        var me = this;
        var toolbarId = me.id;
        delete me.id;

        Ext.apply(tabPanel, me.parentOverrides);
        me.tabPanel = tabPanel;
        me.tabBar = tabPanel.tabBar;

        // ensure we have a valid position
        if (this.position !== 'left') {
            this.position = 'right';
        }

        me.tabBar.on({
            afterlayout : function() {
                me.layout = me.tabBar.layout;

                // we need to subtract the toolbar width from this function result
                me.layout.availableSpaceOffset += this.width;

                var scrollerEl = me.tabBar.body.child('.' + Ext.baseCSSPrefix + 'box-scroller-' + this.position), contentEl = me.tabBar.body
                        .createChild({
                                    style : 'width:' + this.width + 'px;',
                                    cls : Ext.baseCSSPrefix + 'tab-toolbar-' + this.position
                                }, scrollerEl);

                // if scroller is not created (only one tab)
                // we need to add the floating style to the tab bar
                if (scrollerEl == undefined) {
                    me.tabBar.body.child('.' + Ext.baseCSSPrefix + 'box-inner').setStyle({
                                'float' : this.position == 'left' ? 'right' : 'left'
                            })
                }

                me.toolbar = new Ext.toolbar.Toolbar({
                            cls : 'x-tab-toolbar',
                            renderTo : contentEl,
                            items : Ext.Array.from(this.items),
                            id : toolbarId
                        });
            },
            beforedestroy : function() {
                me.toolbar.destroy();
            },
            scope : this,
            single : true
        });
    }

});