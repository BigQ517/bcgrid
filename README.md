## BCGrid
A grid plugin for jquery.
Flexible, convenient and free!
##How to use:
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
 ##Options:
  ```js
   id: '',
      width: '', //宽度值
      height: '', //宽度值
      enabledCsrf: false,
      csrfName: '_csrf',
      lang: 'en',
      csrf: '',
      url: '', //ajax url
      data: {}, //初始化数据
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
      showFirst: true,
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
      dataSource: 'server', //数据源：本地(local)或(server),本地是将读取p.data。不需要配置，取决于设置了data或是url
      showCheckbox: false, //是否显示复选框
      showSerialNum: true, //是否显示序号
      showBorder: true, //是否显示边框
      showStripe: true,//是否显示条纹间隔效果
      showHover: true,//是否显示hover效果
      showHead: true,
      showTitle: false,
      title: "",
      noDataText: '<div class="center">暂无任何记录</div>',
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
      onRowClick: null, //选择行事件
      onTreeExpandOrCollapse: null,//树展开/收缩事件
      tree: null
  ```