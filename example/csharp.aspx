<%@ Page Language="C#" AutoEventWireup="true" CodeFile="csharp.aspx.cs" Inherits="csharp" %> 
<!DOCTYPE html> 
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
   <title>BC Gird</title>
    <link rel="stylesheet" href="../dist/css/font-awesome/4.7.0/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="../dist/css/bc.grid.min.css"/>
    <script src="../lib/jquery-11.1.min.js"></script>
    <script src="../dist/bc.grid.min.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>姓名：<input name="name" id="name"  value=""/>&nbsp;&nbsp;&nbsp;&nbsp;编号：<input name="num" id="num"  value=""/>&nbsp;&nbsp;<button type="button" id="searchBtn">搜索</button></div>
    </form>
       <div id="dataTable" style="margin-top: 20px"></div>
    <script>
    $(function () {
        grid=BCGrid.create("#dataTable",{
            columns: [
                {id: 'id', name: 'id', display: 'ID', align: 'center'},
                {name: 'name', display: '姓名'},
                {name: 'num', display: '编号',align: 'right'},
                {name: 'datetime', display: '时间',type:'date',enableSort:true}

            ],
            enablePager:true,
            lang:'zh',
            //url: 'csharp.aspx',//如果数据路径同展示页面路径可以省略此参数
            showCheckbox: true,
            onSelectedRow: function (rowIndex, rowData) { //选择行事件
                console.log(rowData);
            },
            onCheckClick: function (rowIndex, isChecked, rowData) { //选择事件(复选框)
                console.log(rowData);

            },
        });

        ///
        $("#searchBtn").on('click',function () {
            filterData();
        });

    });
    function  filterData() {
      var paramsData = BCGrid.buildParams("#form1");
        /**  或者
            var paramsData =[];
            paramsData.push({"name": "name", "value": "" + $("#name").val() + ""});
            paramsData.push({"name": "num", "value": "" + $("#num").val() + ""});
         */
      grid.set({ params: paramsData });
      grid.loadData(true);

    }
</script>
</body>
</html>
