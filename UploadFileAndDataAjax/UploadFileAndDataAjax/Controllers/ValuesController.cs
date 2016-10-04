using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace UploadFileAndDataAjax.Controllers
{
    public class ValuesController : ApiController
    {
        // GET api/values
        [HttpPost]
        [ActionName("UploadMultipleFileAndData")]
        public async Task<IEnumerable<string>> UploadMultipleFileAndData()
        {
            var root = HttpContext.Current.Server.MapPath("/");
            Directory.CreateDirectory(root);
            var provider = new MultipartFormDataStreamProvider(root);
            var request =HttpContext.Current.Request;
            var modelsJson = request.Form["model"];
            //var files = request.Files;

            var result = await Request.Content.ReadAsMultipartAsync(provider);
            if (result.FileData.Count > 0)
            {
            }
            //result.
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
