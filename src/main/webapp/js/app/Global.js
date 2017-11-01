/**
 * Created by Administrator on 2017/10/30.
 */
var G_LOAD='LOAD';
var G_SAVE='SAVE';
var G_INSERT='INSERT';
var G_UPDATE='UPDATE';
var G_DELETE='DELETE';
var PAGE_SIZE=20;
var SCREEN_WIDTH=screen.width;
var SCREEN_HEIGHT=screen.height;
var ROWINDEX=0;
var TRA_STORE;
var PER_STATUS=false;
var special_02_color_list=['#11d1e2','#2ecc77','#f0892e','#dd4444','#7d6025','#3e364e','#000000'];
var errorPath='resources/images/demo/demo001.jpg';
var _jsonLoadSuccess=0;
//发布地址域名
var HOST_URL='http://'+window.location.host+"/";
//系统path
var FORECAST_HTML_URL=HOST_URL+'mega';
var FILE_HOST_URL=Window.location.origin+"/imageserver/mega/uploadfile/";
function nofind(){
    var img=event.srcElement;
    img.src=errorPath;//网络默认图片路径
    img.onerror=null;//控制不要一直跳动，防止默认图片也不存在时的死循环操作
};
//跳到系统指定菜单
function _LINK_TO_OTHER_MENU(clazz1,clazz2,clazz3){
    Ext.each(_APP.MOD_FUN,function(item){
        if(item.clazz==clazz1){
            setFirstMenu(item.clazz,item.idx);
            if(clazz2!==null){
                Ext.Array.forEach(item.children,function(sub){
                    if(sub.clazz==clazz2){
                        setSecondMenu(clazz1,clazz2,clazz3);
                        return false;
                    }
                });
                return false;
            }else{
                if(!item.children)return;
                Ext.Array.forEach(item.children,function(sub){
                    if(sub.clazz==clazz2&&clazz3!==null){
                        Ext.each(sub.children,function(subitem){
                            setThirdMenu(clazz1,clazz2,null);
                            return false;
                        });
                    }
                });
            }
            return;
        }


    },this);
    function selectFirstMenu(idx){
        var children=_APP.viewport.getEl().down('ul').dom.children;
        for(var i=0;i<children.length;i++){
            if(children[i].getAttribute('_idx')==idx){
                Ext.get(children[i].addCls('li_select'));
                break;
            }
        }
    }
    function setFirstMenu(clazz,idx){
        var cntp=_APP.viewport.down('container[name=m_center]');
        _APP.viewport.getEl().down('li.li_select').removeCls('li_select');
        selectFirstMenu(idx);
        var mod=cntp.down('[_clazz='+clazz+']');
        if(!mod){
            mod=cntp.add(Ext.create(clazz,{_clazz:clazz,_mod_idx:idx}));
        }
        cntp.setActiveItem(mod);//激活组件
    }
    function setSecondMenu(clazz1,clazz2,clazz3){
        var menus=_APP.viewport.down('container[name=m_center]').down('[_clazz='+clazz+']')
        .getEl().query('div.menu2,p.menu3');
        for(var i=0;i<menus.length;i++){
            if(menu[i].getAttribute('clazz')==clazz2){
                selectSecondMenu(clazz1,menus[i]);
                if(clazz3!==null){
                    setTirdMenu(clazz2,clazz3,null);
                }
                break;
            }
        }
    }
    function  setTirdMenu(clazz1,clazz2,clazz3){
        var menus=_APP.viewport.down('container[name=m_center]').down('[_clazz]'+calzz1+']')
        .getEl().query('dic.menu2,p.menu3');
        for (var i=0;i<menus.length;i++){
            if(menus[i].parentElement.getAttribute('clazz'==clazz2)){
                selectSecondMenu(clazz1,menus[i]);
                if(clazz3!==null){
                    setSecondMenu(clazz2,clazz3,null);
                }
                break;
            }
        }
    }
    function selectSecondMenu(clazz1,dom){
        var el=Ext.get(dom);
        var clazz;
        var iconCls;
        var cntp=_APP.viewport.down('[name=cntp]');
        if(el.hasCls('menu2')){
            //点击二级菜单下的三级菜单
            var el_third=el.parent('li').down('.downMenu');
            if(el.hasCls('level_select')){
                if(el_third){
                    if(el_third.hasCls('show')){
                        el_third.removeCls('show').addCls('hide');
                    }else{
                        el_third.removeCls('hide').addCls('show');
                    }
                }
                return false;
            }
            //之前选中二级菜单的样式
            var el_cur=_APP.viewport.down('container[name=m_center]')
                .down('[_clazz='+clazz1+"]").getEl().down('.level_select');
            if(el_cur)el_cur.removeCls('level_select');
            //之前选中的二级菜单下的三级菜单
            var el_cur_third=el_cur.parent().down('.downMenu');
            if(el_cur_third){
                var li_menu3=el_cur_third.down('li.sele');
                if(li_menu3)li_menu3.removeCls('sele');
                el_cur_third.removeCls('show').addCls('hide');
            }
            //当前选中的菜单的样式
            el.addCls('level_select');
            iconCls=el.down('span').getAttribute('class');
            //给clazz赋值
            clazz=el.getAttribute('clazz');
            //如果当前菜单有三级菜单
            if(el_third){
                var li_menu3=el_third.down('li');
                if(li_menu3)li_menu3.addCls('sele');
                el_third.removeCls('hide').addCls('show');
                clazz=li_menu3.getAttribute('clazz');
            }

        }else if(el.hasCls('menu3')){
            el.parent('ul.downMenu').down('li.sele').removeCls('sele');
            el.parent('li').addCls('sele');
            iconCls=_APP.viewport.down('container[name=m_center]').down('[_clazz='+clazz1+']')
            .getEl().down('span').getAttribute('class');
            clazz=el.parent('li').getAttribute('clazz');

        }else{
            return false;
        }
        var mod=cntp.down('[_clazz='+clazz+']');
        if(!mod){
            mod=cntp.add(Ext.create(clazz,{_clazz:clazz,_iconCls:iconCls}));
        }
        cntp.setActiveItem(mod);
    }

}

function  _DOWNLOAD_FILE(idx){
    if(!idx)return;
    var url="file/download.action?attach="+idx;
    window.open(url,'_blank');
}

/**
 *文件下载窗口
 */
function _createDownLoadWin(combo,flag){
    var tcombo=combo.getSelectedRecord();
    if(!tcombo)
    return KPSFT.pop.msg('提示','没有选中文件！');
    var sname=tcombo.get('SNAME');
    var tname=tcombo.get('TNAME');
    var html='<a style="display: block;text-align:center;margin-top:10px;font-size: 15px" href=">';
    html+='excel/download.action?fpath='+tname+'&sname'+sname;
    if(flag){html+='&flag'+flag;}
    html+='"download="';
    html+=sname;
    html+='">';
    html+=sname;
    html+='&nbsp&nbsp&nbsp&nbsp[点击下载]</a>';
    _APP.DownWin=Ext.create('Ext.window.Window',{
        title:'导出',height:100,width:500,layout:'fit',modal:true,cls:'cus_searchWindow',html:html,
        listeners:{
            afterrender:function(win){
                var el=win.getEl().down('a');
                el.on('click',function(){
                    win.destroy();
                },this);
            },scope:this
        }
    });
    _APP.DownWin.show();
}
//移除某个对象中为空的属性
function _RM_N_P(data){
    var nd={};
    for(var p in data){
        var prop=data[p];
        if(typeOf(prop)=='string'||typeOf(prop)=='object'||typeof(prop)=='undefined'){
            if(!prop)continue;
        }
        nd[p]=prop;
    }
    return nd;
}
//全局后台交互方法
function __EXC_STEP(step,scope,_callback,disablemask,async){
    var ldflg=true;
    if(!_callback||!scope.el||disablemask)ldflg=false;
    if(ldflg){
        var mtarg=scope;
        if(scope.getXType()=="uxpagebar"){
            mtarg=scope.up('pagegrid');
        }
        var ldMask=new Ext.LoadMask({
            cls:'mask_cus',
            maskCls:'x-mask base_mask_cus',
            target:mtarg,
            msg:'',
        });
        var ctr=scope;
        if(!scope.isXType('basectrl')&&(str=scope.up('basectrl'))){
            ctr._ldMask=ldMask;
        }
        ldMask.show();

    }
    var _async=(async===undefined)?true:async;
    KPSFT.Ajax.request({
        url:'bus/step.action',
        contentType:'application/x-www-form-urlencoded;charset=utf-8',
        scope:scope,
        timeout:100000,
        async:_async,
        jsonData:{
            step:step
        },
        successed:function(data,response){
            if(ldflg){
                ldMask.destroy();
                if(ctr)delete ctr._ldMask;
                if(_callback){
                    Ext.callback(_callback,scope,[data,response]);
                }

            }
        },
        exceptted:function(rep,req){
            if(ldflg){
                ldMask.destroy();
                if(ctr)
                delete  ctr._ldMask;
            }
            var masks=Ext.ComponentQuery.query("[cls=mask_cus]");
            Ext.each(masks,function(item,idx){
                item.hide();
            });

        },
        failure:function(rep,req){
            if(ldflg){
                ldMask.destroy();
                delete  ctr._ldMask;
            }
            if(this._REQ_FAILED){
                this._REQ_FAILED(rep,req);
            }
            else if(rep.timeout){
                Ext.Msg.alert("运行超时",'运行超时，请过5分钟再查看结果！！！');
            }else{
                Ext.Msg.alert('失败','后天出现异常！！！');
            }
        }
    });

}
//全局后台交互方法，不带ldMask
function __EXC_STEP_URL(step,scope,_callback,disablemask,async,url){
    var ldflg=true;
    if(!_callback||!scope.el||disablemask)
    ldflg=false;
    if(ldflg){
        var mtarg=scope;
        if(scope.getXType()==='uxpagebar')
        mtarg=scope.up('pagegrid');
        var ldMask=new Ext.LoadMask({
            cls:'mask_cus',
            maskCls:'x-mask base_mask_cus',
            target:mtarg,
            msg:'',
        });
        var ctr=scope;
        if(!scope,isXType('basectrl')&&(ctr=scope.up('basectrl'))){
            ctr._ldMask=ldMask;
        }
        var _async=(async===undefined)?true:async;
        KPSFT.Ajax,requset({
            url:encodeURI(url,'utf-8'),
            contentType:'application/x-www-form-urlencoded;charset=utf-8',
            scope:_async,
            jsonData:{
                step:step
            },
            successed:function(data,response){
              if(ldflg){
                  if(ctr)delete ctr._ldMask;
              }
              if(_callback)Ext.callback(_callback,scope,[data,response]);

            },
            exceptted:function(){
                if(ldflg){
                    if(ctr){
                        delete ctr._ldMask;
                    }
                }
            },
            failure:function(rep,req){
                if(ldflg){
                    if(ctr)delete ctr._ldMask;
                }
                if(this.REQ_FAILED){
                    this.REQ_FAILRED(rep,req);
                }else if(rep.timeout){
                    Ext.Msg.alert('运行超时','运行超时，请过5分钟再查看即如果！！！');

                }else{
                    Ext.Msg.alert('失败','后天出现异常！！');
                }
            }
        });


    }
}
//方法：array.remove(index)，通过遍历，重构数组：功能:删除数组，参数：index删除元素的下标
Array.prototype.remove=function(index){
    if(isNaN(index)||idx>this.length){
        return false;
    }
    for(var i=0,n=0;i<this.length;i++){
        if(this[i].id!=this[index]){
            this[n++]=this[i];
        }
    }
    this.length-=1
}
//根据id删除数组元素
Array.prototype.remove=function(id){
    for(var i=0;i<this.length;i++){
        if(this[i].id==id){
            this.splice(i,1);
            break;
        }
    }
}

/*
 * 方法:Array.remove(dx) 通过遍历,重构数组
 * 功能:更新ID相同的数据.
 * 参数:obj 要替换的元素.
 */
Array.prototype.replaceById=function(obj)
{
    for(var i=0;i<this.length;i++)
    {
        if(this[i].id==obj.id)
        {
            this[i]=obj ;
        }
    }
} ;

/*
 * 方法:Array.remove(dx) 通过遍历,重构数组
 * 功能:查找元素ID是否存在.
 * 参数:id 要查询的ID.
 */
Array.prototype.findById=function(id)
{
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i].id==id)
        {
            return true;
        }
    }
    return false;
}

/*
 * 方法:Array.getTextById(dx) 通过遍历,重构数组
 * 功能:查找元素ID是对应的text值.
 * 参数:id 要查询的ID.
 */
Array.prototype.getTextById=function(id){
    for(var i=0;i<this.length;i++)
    {
        if(this[i].id==id)
        {
            return this[i].text;
        }
    }
    return '';
}

//数组去重，返回新数组
Array.prototype.unique = function() {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}
