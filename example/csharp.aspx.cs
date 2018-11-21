using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
public partial class csharp : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
      
        if (Request.RequestType.Equals("POST"))
        {
            int page = String.IsNullOrEmpty(Request.Form["page"]) ? 1 : int.Parse(Request.Form["page"]);
            int pageSize = String.IsNullOrEmpty(Request.Form["pagesize"]) ? 40 : int.Parse(Request.Form["pagesize"]);
            string sortNameParamName = Request.Form["sortname"];
            string sortOrderParamName = Request.Form["sortorder"];
            string name = Request.Form["name"]; 
            string num = Request.Form["num"];
            string rows = GenerateData(page, pageSize, sortNameParamName, sortOrderParamName, name, num);
            int total = 9999;//搞搞sql select count()
            string resData = "{\"total\":" + total.ToString() + ",\"rows\":" + rows + "}";//注意 total  rows 
            Response.Write(resData);
            Response.End();
        }


    }
    protected string GenerateData(int page,int pageSize,string sortNameParamName,string sortOrderParamName,string name ,string num) {
        //做些你想做的搜索 通常搞搞SQL这里就不搞了，搞不动。
        StringBuilder sb = new StringBuilder() ;
        Person item;
        for (int i = 0;i < pageSize;i++){
            item = new Person();
            item.id = (page - 1) *pageSize +i;
            item.num = "NUM_" + item.id.ToString();
            item.gender = (i % 2 == 0) ? 1 : 2;
            item.age = (i % 2 == 0) ? 20 : 32;
            item.email = "bigq517@qq.com";
            item.mobile = "139*****517";
            item.name = String.IsNullOrEmpty(name) ? "老王_" + (i+1).ToString() : name+"_"+(i+1).ToString();
            item.datetime = DateTime.Now.AddDays(0 - i);
            sb.Append(item.ToString()+",");
        }
        string res = sb.ToString();
        if (res.Length > 0) {
            res = res.Remove(res.Length - 1, 1);
        }
        return "["+res+"]";
    }
}
class Person{
    private int _id = 0;
    private string _num = "";
    private string _name = "";
    private int _gender = 1;
    private int _age = 0;
    private string _email = "";
    private string _mobile = "";
    private DateTime _datetime = DateTime.Now;
    public Person() { }

    public int id
    {
        get
        {
            return _id;
        }

        set
        {
            _id = value;
        }
    }

    public string num
    {
        get
        {
            return _num;
        }

        set
        {
            _num = value;
        }
    }

    public string name
    {
        get
        {
            return _name;
        }

        set
        {
            _name = value;
        }
    }

    public int gender
    {
        get
        {
            return _gender;
        }

        set
        {
            _gender = value;
        }
    }

    public int age
    {
        get
        {
            return _age;
        }

        set
        {
            _age = value;
        }
    }

    public string email
    {
        get
        {
            return _email;
        }

        set
        {
            _email = value;
        }
    }

    public string mobile
    {
        get
        {
            return _mobile;
        }

        set
        {
            _mobile = value;
        }
    }

    public DateTime datetime
    {
        get
        {
            return _datetime;
        }

        set
        {
            _datetime = value;
        }
    }
    public override string ToString()
    { 
        StringBuilder sb = new StringBuilder();
        sb.AppendFormat("\"id\":{0},",this._id.ToString());
        sb.AppendFormat("\"num\":\"{0}\",", this._num);
        sb.AppendFormat("\"name\":\"{0}\",", this._name);
        sb.AppendFormat("\"gender\":{0},", this._gender);
        sb.AppendFormat("\"age\":{0},", this._age);
        sb.AppendFormat("\"email\":\"{0}\",", this._email);
        sb.AppendFormat("\"mobile\":\"{0}\",", this._mobile);
        sb.AppendFormat("\"datetime\":{0}", GetTimeSpan(this._datetime));
        return "{"+sb.ToString()+"}";
    }

    private long GetTimeSpan(DateTime time)
    {
        DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0, 0));
        return (long)(time - startTime).TotalSeconds;
    }
}