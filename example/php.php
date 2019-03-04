<?php
function generateData($page,$pageSzie,$sortNameParamName,$sortOrderParamName,$filterMap=[]){
    //做些你想做的搜索 通常搞搞SQL这里就不搞了，搞不动。
    $list=[];
    for($i = 0;$i < $pageSzie;$i++){
        $item = [
            'id'=>($page -1) *$pageSzie+$i,
            'num'=>'BQ_'.date("YmdHi",time()),
            'gender'=> rand(1,2),
             'age'=> rand(20,35),
            'email'=>'bigq517@qq.com',
            'mobile'=>'139*****517',
            'name'=> isset($filterMap['name'])?$filterMap['name'].($i+1):'老王_'.($i+1),
            'datetime'=>time() - $i * 60 * 60 *24
        ];
        array_push($list,$item);
    }
    return $list;
}
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $page =  isset($_POST["page"])?$_POST["page"]:1;
    $pageSize =  isset($_POST["pagesize"])?$_POST["pagesize"]:40;
    $sortNameParamName=isset($_POST["sortname"])?$_POST["sortname"]:'';
    $sortOrderParamName=isset($_POST["sortorder"])?$_POST["sortorder"]:'';
    $name = isset($_POST["name"])?$_POST["name"]:'';
    $num = isset($_POST["num"])?$_POST["num"]:'';
    $map =[];
    if($name!==''){
        $map['name'] = $name;
    }
    if($num!==''){
        $map['num'] = $num;
    }

    $rows = generateData($page,$pageSize,$sortNameParamName,$sortOrderParamName,$map);
    $total = 9999;//搞搞 select count()
    //
    $resData=['total'=>$total,'rows'=>$rows];//注意 total  rows
    print(json_encode($resData));
    exit(0);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>BC Gird</title>
    <link rel="stylesheet" href="../dist/css/font-awesome/4.7.0/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="../dist/css/bc.grid.min.css"/>
    <script src="../lib/jquery-11.1.min.js"></script>
    <script src="../dist/bc.grid.min.js"></script>
</head>
<body>
<div>
    <form id="form1"><div>姓名：<input name="name" id="name"  value=""/>&nbsp;&nbsp;&nbsp;&nbsp;编号：<input name="num" id="num"  value=""/>&nbsp;&nbsp;<button type="button" id="searchBtn">搜索</button></div></form>
    <div id="dataTable" style="margin-top: 20px"></div>
</div>
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
            //url: 'php.php',//如果数据路径同展示页面路径可以省略此参数
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
        grid.set({params:paramsData});
        grid.reload();

    }
</script>
</body>
</html>




