using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace UploadFileAndDataAjax.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            return View();
        }
        public ActionResult UploadFileAndData() {
        return View();
        }

        public ActionResult UploadMultipleFile()
        {
            return View();
        }

        public ActionResult UploadMultipleFileAndData()
        {
            return View();
        }
    }
}
