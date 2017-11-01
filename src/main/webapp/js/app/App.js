/**
 * Created by Administrator on 2017/10/30.
 */
Ext.loader.setConfig({
    enabled:true,
    disableCaching:true,
    paths:{
        'KPSFT':'js/app','Ext.ux':'js/ext5/ux'
    }
});
Ext.define('KPSFT._APP',{
    singleton:true,
    init:function(){
        Ext.initQuickTips();
        Ext.QickTips.init();
        var __INIDATA=Ext.get('_initF').getValue();
        var _menuPath=Ext.get('_menuPath').getValue();
        this.loadINIT(Ext.decode(__INIDATA));

        this.viewport=Ext.create('KPSFT.MainView',{});
        this._sys_style='2';
        this._menu_style="1";
        if(this._sys_style=='2'){
            var a=_APP.viewport.getEl().down('[class=xiala]');
            a.el.removeChild(a.el.getFirstChild());
        }
        //初始化加载菜单
        if(!_APP.MOD_FUN||_APP.MOD_FUN.length==0||!_APP.MOD_FUN[0].clazz){
            Ext.Msg.alert('用户未授权菜单','用户未授权菜单，请登出系统！',function(btn){
                if(btn==='ok'&&data.content=='登出系统'){
                    window.location.reload();
                }
            });
            return;
        }
        this.viewport.cntp.add(Ext.create(_APP.MOD_FUN[0].clazz,{
            _clazz:_APP.MOD_FUN[0],
            _mod_idx:_APP.MOD_FUN[0].idx
        }));
        //创建全局最大化文档查看窗口
        this.maxreportwin=Ext.create({
            xtype:'window',
            cls:'cus_searchWindow',
            title:'报告查看',
            layout:'fit',
            border:false,
            name:'win——table',
            maxmized:true,
            modal:true,
            closeAction:'hide',
            items:[
                Ext.create('Ext.ux.IFrame',{
                    name:'maxreportwin',
                    src:'about:blank'
                })
            ],
            listeners:{
                beforeclose:function(win,eOpts){
                    var iwin=win.down('[name=maxreportwin]').getWin();
                    try{
                        iwin.PDFViewerApplication.close();
                    }catch(e){}
                }
            }
        })
    },
    loadINIT:function(data){
        var empId=data.USER.idx;
        this.USER=data.USER;
        this.MOD_FUN=data.MOD_FUN;
        if (data.INIT_EXTEND){
            this.INIT_EXTEND=data.INIT_EXTEND;
        }
    },
    doQuit:function(){
        Ext.Msg.confirm('确认','确定要退出系统？',function(btn){
           if(btn!='yes')return;
            Ext.Ajax.request({
                url:'logout.action',
                success:function(response){
                    window.location.reload();
                }
            });
        });
    },
});
_APP=KPSFT._APP;

Ext.onReady(function(){
    _APP.init();
});

//概化图store
Ext.define('_TPSTORE',{
    //加载动画
    laodMask:null,
    hasloaded:false,
    tpstore:Ext.create('Ext.data.Store',{
        fields:[]
    }),
    //加载概化图数据列表
    _loadTpData:function(_callback,scope){
        this.loadMask=new Ext.LoadMask({
            msg:'',cls:'mask_cus',maskCls:'base_mask_cus x-mask',target:this,
        });
        this.loadMask.show();
        var step=[{
            JSCODE:G_LOAD,CODE:'LOAD_SVG_INFO',RCODE:'LSI',CDN:{}
        }];
        __EXC_STEP(step,this,function(data,response){
            this.tpstore.loadData(data.detail.LSI);
            this.loadMask.hide();
            this.hasloaded=true;
            if(_callback){
                Ext.callback(_callback,scope,[data,response]);
            }
        })
    },
    //数据删除
    _deleteRec:function(rec,_callback,scope){
        var step=[{
            JSCODE:G_SAVE,CODE:G_DELETE,DATA:{IDX:rec.get('IDX')},RCODE:'ENTITY',
            CLAZZ:'SYS_SVG_INFO'
        }] ;
        __EXC_STEP(step,this,function(data,response){
            this._loadTpData();
            KPSFT.pop.msg(data.title,data.content);
            if(_callback){
                Ext.callback(_callback,scope,[data,response])
            }
        })
    },

});
//虚拟store
Ext.define('_VSTSTORE',{
    hasloaded:false,
    tpstore:Ext.create('Ext.data.Store',{fields:[]}),
    //加载虚拟站数据
    _loadTpData:function(_callback,scope){
        var step=[{
           JSCODE:G_LOAD,CODE:'LOAD_VST_STATIONS',RCODE:'LVS',CDN:{}
        }];
        __EXC.STEP(step,this,function(data,response){
            this.tpstore.loadData(data.detail.LVS);
            this.hasloaded=true;
            if(_callback)Ext.callback(_callback,scope,[data,response])

        });
    },
});
//全局概化图和虚拟站的数据来源
_APP._TPSTORE=Ext.create('_TPSTORE');
_APP._VSTSTORE=Ext.create('_VSTSTORE');