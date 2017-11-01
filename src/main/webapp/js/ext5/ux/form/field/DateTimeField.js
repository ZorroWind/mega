/*
* @author wangzilong
* update Ext - 4.1 27/04/2012
* 
* @author ebett
* update Ext 5.1.0 19/03/2015
*/
Ext.define('Ext.ux.form.field.DateTimeField', {
	  extend: 'Ext.form.field.Date',
	  alias: 'widget.datetimefield',
	  requires: ['Ext.ux.DateTimePicker'],

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
	  }
  });