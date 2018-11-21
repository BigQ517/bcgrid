<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.*,java.util.*" %>
<%!
    class preson{
	   private int id = 0;
	   private String name="";
	   private String num="";
	   private int gender = 1;
       private int age = 0;
       private String email = "";
       private String mobile = "";
       private long dateTime=0;
	   public preson(){
	   }
	   public int getId(){
		return this.id;
	   }
	   public void setId(int id){
		  this.id = id;
	   }
	   public int getGender(){
		return this.gender;
	   }
	   public void setGender(int gender){
		  this.gender = gender;
	   }
	   public void setAge(int age){
		  this.age = age;
	   }
	   public int getAge(){
		return this.age;
	   }

	   public void setNum(String num){
		  this.num = num;
	   }
	   public String getNum(){
		return this.num;
	   }
	   public void setName(String name){
		  this.name = name;
	   }
	   public String getName(){
		return this.name;
	   }
	   public void setMobile(String mobile){
		  this.mobile = mobile;
	   }
	   public String getMobile(){
		return this.mobile;
	   }
	   public void setEmail(String email){
		  this.email = email;
	   }
	   public String getEmail(){
		return this.email;
	   }
	   public void setDateTime(long dateTime){
		  this.dateTime = dateTime;
	   }
	   public long getDateTime(){
		return this.dateTime;
	   }
	  public String toString() { 
		  String str = "";
          str = str+"\"id\":"+this.id+",";
		  str = str+"\"num\":\""+this.num+"\",";
		  str = str+"\"name\":\""+this.name+"\",";
		  str = str+"\"gender\":"+this.gender+",";
		  str = str+"\"age\":"+this.age+",";
		  str = str+"\"email\":\""+this.email+"\",";
		  str = str+"\"mobile\":\""+this.mobile+"\",";
		  str = str+"\"datetime\":"+this.dateTime; 
         return "{"+str+"}";
     }
	  
	}
	 public String generateData(int pageNum,int pageSize,String sortNameParamName,String sortOrderParamName,String name ,String num){
	   //做些你想做的搜索 通常搞搞SQL这里就不搞了，搞不动。
	   String res = "";
	   preson item;
        for (int i = 0;i < pageSize;i++){
            item = new preson();
            item.setId((pageNum - 1) *pageSize +i);
            item.setNum("NUM_" + item.getId());
            item.setGender((i % 2 == 0) ? 1 : 2);
            item.setAge((i % 2 == 0) ? 20 : 32);
            item.setEmail("bigq517@qq.com");
            item.setMobile("139*****517");
            item.setName((name==null || name=="") ? "老王_" + (i+1) : name+"_"+(i+1));
			long dt = System.currentTimeMillis() /1000;
            item.setDateTime(dt-i * 60 * 60 *24);
            res = res+item.toString(); 
			if(i +1 < pageSize){
			 res = res+",";
			}
        } 
        return "["+res+"]"; 
	}
%>
<%
   String reqMethod = request.getMethod();
   if(reqMethod =="POST"){
        int pageNum = request.getParameter("page") == null ? 1 : Integer.parseInt(request.getParameter("page"));
        int pageSize = request.getParameter("pagesize") == null ? 40: Integer.parseInt(request.getParameter("pagesize"));
        String sortNameParamName = request.getParameter("sortname");
        String sortOrderParamName = request.getParameter("sortorder");
        String name =request.getParameter("name"); 
        String num =request.getParameter("num");
        String rows = generateData(pageNum, pageSize, sortNameParamName, sortOrderParamName, name, num);
        int total = 9999;//搞搞sql select count()
        String resData = "{\"total\":" + total + ",\"rows\":" + rows + "}";//注意 total  rows 
		request.setCharacterEncoding("UTF-8");
        out.print(resData);
        out.close();
   }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>BC Gird</title>
    <link rel="stylesheet" href="../dist/css/font-awesome/4.7.0/css/font-awesome.min.css"/>
        <link rel="stylesheet" href="../dist/css/bc.grid-1.0.5.min.css"/>
        <script src="../lib/jquery-11.1.min.js"></script>
        <script src="../dist/bc.grid-1.0.5.min.js"></script>
</head>
<body>
<div>
    <form id="form1"><div>姓名：<input name="name" id="name"  value=""/>&nbsp;&nbsp;&nbsp;&nbsp;编号：<input name="num" id="num"  value=""/>&nbsp;&nbsp;<button type="button" id="searchBtn">搜索</button></div></form>
    <div id="dataTable" style="margin-top: 20px"></div>
</div>
<script>
    $(function () {
        $grid=BCGrid.create("#dataTable",{
            columns: [
                {id: 'id', name: 'id', display: 'ID', align: 'center'},
                {name: 'name', display: '姓名'},
                {name: 'num', display: '编号',align: 'right'},
                {name: 'gender', display: '性别',render: function (item, index) {
                 if (item.gender == 1) {
                   return "男";
                  }
                  if (item.gender == 2) {
                    return "女";
                    }
                   }
                },
               {name: 'age', display: '年龄', format: '{value}岁'},
               {name: 'email', display: 'Email'},
               {name: 'mobile', display: '电话'},
               {name: 'datetime', display: '时间',type:'date',enableSort:true},
               {name: 'id', display: '操作',render:function (rowItem,rowIndex) {
                 return BCGrid.getTableAction([
                        {type: "text",title:'详情', href: "edit?id=" + rowItem.id,target:true},
                        {type: "text",color:'blue',title:'详情', href: "edit?id=" + rowItem.id},
                        {type: "edit", href: "edit?id=" + rowItem.id},
                        {type: "info", href: "edit?id=" + rowItem.id,target:true},
                        {type: "set", href: "edit?id=" + rowItem.id},
                        {type: "delete",href: "javascript:deleteRow(" + rowItem.id + "," + rowIndex + ");"}]);
              }}
        ],
            enablePager:true,
            lang:'zh',
			//url: 'java.jsp',//如果数据路径同展示页面路径可以省略此参数
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
        $grid.set({params:paramsData});
        $grid.loadData(true);

    }
  function deleteRow(id,index){
        $grid.deleteRow(index);
        }
</script>
</body>
</html>