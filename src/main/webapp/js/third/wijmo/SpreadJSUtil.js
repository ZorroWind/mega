//获取单元格选择范围
function getActualCellRange(cellRange, rowCount, columnCount) {
    if (cellRange.row == -1 && cellRange.col == -1) {
        return new $.wijmo.wijspread.Range(0, 0, rowCount, columnCount);
    }
    else if (cellRange.row == -1) {
        return new $.wijmo.wijspread.Range(0, cellRange.col, rowCount, cellRange.colCount);
    }
    else if (cellRange.col == -1) {
        return new $.wijmo.wijspread.Range(cellRange.row, 0, cellRange.rowCount, columnCount);
    }
    return cellRange;
}

//文字对齐
function spreadJsAlign(commandName){
	var spread = $("#excelEditor").wijspread("spread"); // get instance of wijspread control
	var sheet = spread.getActiveSheet(); // get active worksheet of the wijspread control
    sheet.isPaintSuspended(true);
	var align = $.wijmo.wijspread.HorizontalAlign.left;
    if (commandName == "center") align = $.wijmo.wijspread.HorizontalAlign.center;
    if (commandName == "right") align = $.wijmo.wijspread.HorizontalAlign.right;
    var sels = sheet.getSelections();
    for (var n = 0; n < sels.length; n++) {
    	var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
    	sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1, $.wijmo.wijspread.SheetArea.viewport).hAlign(align);
    }
    sheet.isPaintSuspended(false);
}

//粗体斜体设置
function fontBoldAndItalic(commandName){
	var spread = $("#excelEditor").wijspread("spread"); // get instance of wijspread control
	var sheet = spread.getActiveSheet();
    sheet.isPaintSuspended(true);
	var styleEle = document.getElementById("colorSample");
    var font = sheet.getCell(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex(), $.wijmo.wijspread.SheetArea.viewport).font();
    if (font != undefined) {
        styleEle.style.font = font;
    } else {
        styleEle.style.font = "10pt 宋体";
    }
    if (commandName == "bold") {
        if (styleEle.style.fontWeight == "bold") {
            styleEle.style.fontWeight = "";
        } else {
            styleEle.style.fontWeight = "bold";
        }
    } else if (commandName== "italic") {
        if (styleEle.style.fontStyle == "italic") {
            styleEle.style.fontStyle = "";
        } else {
            styleEle.style.fontStyle = "italic";
        }
    }
    var sels = sheet.getSelections();
    for (var n = 0; n < sels.length; n++) {
        var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
        sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1, $.wijmo.wijspread.SheetArea.viewport).font(styleEle.style.font);
    }
    sheet.isPaintSuspended(false);
}

//下划线
function setUnderLine(){
	 var spread = $("#excelEditor").wijspread("spread");
     var sheet = spread.getActiveSheet();
     sheet.isPaintSuspended(true);
     var sels = sheet.getSelections(),
     underline = $.wijmo.wijspread.TextDecorationType.Underline;
	 for (var n = 0; n < sels.length; n++) {
 		 var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount()),
         textDecoration = sheet.getCell(sel.row, sel.col, $.wijmo.wijspread.SheetArea.viewport).textDecoration();
		 if ((textDecoration & underline) === underline) {
		     textDecoration = textDecoration - underline;
		 } else {
		     textDecoration = textDecoration | underline;
		 }
 		sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1, $.wijmo.wijspread.SheetArea.viewport).textDecoration(textDecoration);
	}
	 sheet.isPaintSuspended(false);
}

/**
 * 设置字体和大小
 */
function setFont(fontName,fontSize){
	//var fontName = $("#fontName").val();
	//var fontSize = $("#fontSize").val();
	if(fontName == null){
		fontName = "黑体";
	}
	var styleEle = document.getElementById("colorSample");
	var spread = $("#excelEditor").wijspread("spread"); // get instance of wijspread control
	var sheet = spread.getActiveSheet(); // get active worksheet of the wijspread control
    sheet.isPaintSuspended(true);
    var font = sheet.getCell(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex(), $.wijmo.wijspread.SheetArea.viewport).font();
    if (font) {
        styleEle.style.font = font;
    }
    else {
        styleEle.style.font = "10pt 宋体";
    }
    
    if(fontName){
    	styleEle.style.fontFamily = fontName;
    }
    
    if(fontSize){
    	styleEle.style.fontSize = fontSize;
    }
    
	var sels = sheet.getSelections();
    for (var n = 0; n < sels.length; n++) {
    	var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
    	sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1, $.wijmo.wijspread.SheetArea.viewport).font(styleEle.style.font);
    }
    sheet.isPaintSuspended(false);
}
//删除线
function strikethrough(){
	
}



/**
 * 显示颜色面板
 */
function showColorPanle(){
	$("#colordialog").removeClass();
	$("#colordialog").addClass('colorFontPanel');
	$("#colordialog").show();
	$("#colordialog table").attr("type","font");
}
function colorSelected(event) {
    var event = event || window.event;
    var target = event.srcElement || event.target;
    $("#selectedColor").val(target.bgColor);
    $("#colorSample").attr("style", "background-color:" + target.bgColor);
    if($("#colordialog table").attr("type")=='font'){
    	 setFontColor(target.bgColor);
    	 hideColorPanle();
    }else{
    	setBackColor(target.bgColor);
    	hideBackColorPanle();
    }
   
}

function insertrow(){
	var spread = $("#excelEditor").wijspread("spread"); // get instance of wijspread control
	var sheet = spread.getActiveSheet(); // get active worksheet of the wijspread control
    sheet.isPaintSuspended(true);
	 sheet.addRows(sheet.getActiveRowIndex(), 1);
	 sheet.isPaintSuspended(false);
}

function delrow(){
	var spread = $("#excelEditor").wijspread("spread"); // get instance of wijspread control
	var sheet = spread.getActiveSheet(); // get active worksheet of the wijspread control
    sheet.isPaintSuspended(true);
    sheet.deleteRows(sheet.getActiveRowIndex(), 1);
	sheet.isPaintSuspended(false);
}

function insertcol(){
	var spread = $("#excelEditor").wijspread("spread"); // get instance of wijspread control
	var sheet = spread.getActiveSheet(); // get active worksheet of the wijspread control
    sheet.isPaintSuspended(true);
    sheet.addColumns(sheet.getActiveColumnIndex(), 1);
sheet.isPaintSuspended(false);
}

function delcol(){
	var spread = $("#excelEditor").wijspread("spread"); // get instance of wijspread control
	var sheet = spread.getActiveSheet(); // get active worksheet of the wijspread control
    sheet.isPaintSuspended(true);
    sheet.deleteColumns(sheet.getActiveColumnIndex(), 1);
	sheet.isPaintSuspended(false);
}

/**
 * 隐藏颜色面板
 */
function hideColorPanle(){
	$("#colordialog").hide();
}

/**
 * 显示背景颜色面板
 */
function showBackColorPanle(){
	$("#colordialog").removeClass();
	$("#colordialog").addClass('colorBackPanel');
	$("#colordialog").show();
	$("#colordialog table").attr("type","bg");
}


/**
 * 隐藏背景颜色面板
 */
function hideBackColorPanle(){
	$("#colordialog").hide();
}

/**
 * 设置字体颜色
 */
function setFontColor(colorValue){
	var spread = $("#excelEditor").wijspread("spread"); // get instance of wijspread control
	var sheet = spread.getActiveSheet(); // get active worksheet of the wijspread control
    sheet.isPaintSuspended(true);
    var sels = sheet.getSelections();
    for (var n = 0; n < sels.length; n++) {
        var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
        sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1, $.wijmo.wijspread.SheetArea.viewport).foreColor(colorValue);
    }
    sheet.isPaintSuspended(false);
    //$("#fontShowColor").attr('style','background:'+colorValue+";");
    $("#fontShowColor").css('background',colorValue);
}


/**
 * 设置背景颜色
 */
function setBackColor(colorValue){
	var spread = $("#excelEditor").wijspread("spread"); // get instance of wijspread control
	var sheet = spread.getActiveSheet(); // get active worksheet of the wijspread control
    sheet.isPaintSuspended(true);
    var sels = sheet.getSelections();
    for (var n = 0; n < sels.length; n++) {
        var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
        sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1, $.wijmo.wijspread.SheetArea.viewport).backColor(colorValue);
    }
    sheet.isPaintSuspended(false);
    $("#backShowColor").attr('style','background:'+colorValue+";");
}

/**
 * 合并拆分单元格
 */
function mergeCell(hasSpan){
	var spread = $("#excelEditor").wijspread("spread"); // get instance of wijspread control
	var sheet = spread.getActiveSheet(); // get active worksheet of the wijspread control
    sheet.isPaintSuspended(true);
    var sels = sheet.getSelections();
    var hasSpan = false;
    for (var n = 0; n < sels.length; n++) {
        var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
        if (sheet.getSpans(sel, $.wijmo.wijspread.SheetArea.viewport).length > 0) {
            for (var i = 0; i < sel.rowCount; i++) {
                for (var j = 0; j < sel.colCount; j++) {
                    sheet.removeSpan(i + sel.row, j + sel.col);
                }
            }
            hasSpan = true;
        }
    }
    if (!hasSpan) {
        for (var n = 0; n < sels.length; n++) {
            var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
            sheet.addSpan(sel.row, sel.col, sel.rowCount, sel.colCount);
        }
    }
    sheet.isPaintSuspended(false);
}



function getHitTest(pageX, pageY, sheet) {
    var offset = $("#excelEditor").offset(),
            x = pageX - offset.left,
            y = pageY - offset.top;
    return sheet.hitTest(x, y);
}
function showMergeContextMenu(sheet) {
    var selections = sheet.getSelections();
    if (selections && selections.length > 0) {
        var spans = sheet.getSpans(selections[selections.length - 1], $.wijmo.wijspread.SheetArea.viewport);
        if (spans && spans.length > 0) {
            $(".context-merge").hide();
            $(".context-unmerge").show();
        } else {
            $(".context-merge").show();
            $(".context-unmerge").hide();
        }
    }
}



