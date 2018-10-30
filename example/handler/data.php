<?php
function generateData($page,$pageSzie,$sortNameParamName,$sortOrderParamName,$filterMap=[]){
    //做些你想做的搜索 通常搞搞SQL这里就不搞了，搞不动。
    $list=[];
    for($i = 0;$i < $pageSzie;$i++){
        $item = [
            'id'=>($page -1) *$pageSzie+$i,
            'num'=>'BQ_'.date("YmdHi",time()),
            'name'=> isset($filterMap['name'])?$filterMap['name'].($i+1):'老王_'.($i+1),
            'datetime'=>time() - $i * 60 * 60 *24
        ];
        array_push($list,$item);
    }
    return $list;
}
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $page =  isset($_POST["page"])?$_POST["page"]:1;
    $pageSize =  isset($_POST["pageszie"])?$_POST["pageszie"]:40;
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




