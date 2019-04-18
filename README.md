BCGrid
------------
A grid plugin for jquery.


Flexible, convenient and free!


Change Log(V1.2.0):
------------
* Fixed bug
* Add rowStyle
* Add allowNewline
* Add filterData


How to use:
------------
```html
    <link rel="stylesheet" href="../dist/css/font-awesome/4.7.0/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="../dist/css/bc.grid.min.css"/>
    <script src="../lib/jquery-11.1.min.js"></script>
    <script src="../dist/bc.grid.min.js"></script>
```


```js
 var grid=BCGrid.create("#table",{
            columns: [
                {id: 'id', name: 'id', display: 'ID', align: 'center', hide: true},
                {id: 'name', name: 'name', display: 'Name'},
                {
                    name: 'gender', display: 'Gender', render: function (item, index) {
                    if (item.gender == 1) {
                        return "Boy";
                    }
                    if (item.gender == 2) {
                        return "Girl";
                    }
                }
                },
                {name: 'age', display: 'Age', format: '{value}Years', enableSort: true},
                {name: 'email', display: 'Email', enableSort: true},
                {name: 'mobile', display: 'Mobile'},
                {name: 'sign', display: 'Sign',maxLength:10},
                {name: 'time', display: 'Time',type:'dateTime',format:'MM/dd yyyy hh:mm:ss'}
            ],
            title:'BC Grid',
            showTitle:true,
            showCheckbox: true,
            showSerialNum: true,
            url: 'handler/data.php'
        });
 ```


 Options:
------------
  ```js
      id: '',
      width: '', //宽度值
      height: '', //宽度值
      enableCsrf: false,
      csrfName: '_csrf',
      lang: 'en',
      csrf: '',
      url: '', //ajax url
      localData: [],
      autoLoadData: true,
      showLoading: true, //是否显示加载状态提示
      loadingTip: 'Loading',//加载提示信息
      loadingStyle: 3,//加载样式
      enablePager: true, //是否分页
      page: 1, //默认当前页
      pageSize: 40, //每页默认的结果数 all全部
      pageSizeOptions: [10, 20, 30, 40, 50, 100], //可选择设定的每页结果数 支持 all
      pagerOption: {
      showFirst: true,//显示首页
      showLast: true,
      showPrev: true, //
      showNext: true, //
      showWhenever: true, //是否永久显示分页
      showPageSizeOpt: true,
      firstText: 'First', //首页
      lastText: 'Last', //末页
      prevText: 'Previous', //上一页
      nextText: 'Next', //下一页
      ellipseText: "...",
      pageInfoTpl:'Page {currentPage} of {pageCount},{pageSize} records per page,total {recordCount} records'
      },
      sortName: "", //排序列字段
      sortOrder: "", //排序方向
      params: [], //提交到服务器的参数
      columns: [], //数据源
      dataSource: 'server', //数据源：本地(local)或(server),推荐使用默认值(server)
      ajaxType:'post', //ajax数据提交方式 get/post
      showCheckbox: false, //是否显示复选框
      showSerialNum: true, //是否显示序号
      showBorder: true, //是否显示边框
      showStripe: true,//是否显示条纹间隔效果
      showHover: true,//是否显示hover效果
      showHeadColor: true,//是否表头显示背景色
      showHead: true,
      showTitle: false,
      serialNumWidth:null,//序号列宽
      title: "",//标题文字
      showFoot: false,//显示foot true/false
      foot: "",//foot 内容
      footAlign: null,//foot内容对齐方向 null/left/right/center
      titleAlign: null,//标题对齐方向
      noDataText: '<div class="center">暂无任何记录</div>',//没有数据的提示内容
      dateFormat: 'yyyy-MM-dd hh:mm:ss', //默认时间显示格式
      wrapCssClass: '', //类名
      cssClass: 'bc-table', //类名
      rows: 'rows', //数据源字段名
      total: 'total', //数据源记录数字段名
      pageParamName: 'page', //页索引参数名，(提交给服务器)
      pageSizeParamName: 'pagesize', //页记录数参数名，(提交给服务器)
      sortNameParamName: 'sortname', //页排序列名(提交给服务器)
      sortOrderParamName: 'sortorder', //页排序方向(提交给服务器)
      pagerElement: null, //分页容器
      enableSelectRow: true, //是否可选择行
      enableMultiSelectRow: false,//是否允许行多选
      onCheckClick: null, //选择事件(复选框)
      onCheckAllClick: null, //选择点击数据（全选/全不选）
      onError: null, //错误事件
      onCompleted: null, //加载完函数
      onLoadData: null, //加载数据前事件
      onLoadedData: null, //加载完数据事件
      onSelectedRow: null, //选择行事件
      onRowClick: null, //单击行事件
      onRowDbClick: null, //双击行事件
      rowDetail: null,//行明细
      rowStyle:null,//行样式function
      onRowDetailExpandOrCollapse:null,//行明细 展开/收缩事件
      onTreeExpandOrCollapse: null,//树展开/收缩事件
      tree: null
  ```


ColumnOptions:
------------
 ```js
    var defaultOpt = {
              display: '',//标题显示
              id: '',//id
              name: 'name',//数据name
              type: 'text',//数据类型
              render: null,//执行行数
              hide: false,//是否隐藏
              width:null,//列宽
              align: null,//数据对齐方式
              headAlign:null,//标题对齐方式
              maxLength: null,//显示的最大长度
              format: null,//显示数据格式(date)
              enableSort: false,//是否可以排序,
              allowNewline:false,//是否允许自动换行
          };
```


TreeOptions:
------------
```js
     var defaultOpt = {
             displayID: '',
             key: 'id',
             parentKey: 'parentid',
             expand: false
          };
```


RowDetailOption:
------------
```js
   var defaultOpt = {
              content: function (rowIndex, rowData) {
                       return "";
               },//明细内容string / function(rowIndex,rowData){return string/false;}
               ctrlStyle: 'db',//控制图标样式 db/sg/pm
               align: null, // null/center/left/right
               expand: false
  };
```