using DinkToPdf;
using DinkToPdf.Contracts;
using EvaluationTaskYash.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Syncfusion.HtmlConverter;
using Syncfusion.Pdf;
using IronPdf;

namespace EvaluationTaskYash.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {




        public PdfController()
        {

        }


        [HttpPost]
        [Route("generate")]
        public IActionResult GeneratePdf([FromBody] string htmlContent)
        {

            IronPdf.Logging.Logger.EnableDebugging = true;

            IronPdf.Logging.Logger.LoggingMode = IronPdf.Logging.Logger.LoggingModes.All;

            ChromePdfRenderer renderer = new ChromePdfRenderer();
            IronPdf.PdfDocument pdf = renderer.RenderHtmlAsPdf("<h1>Hello World<h1>");
            pdf.SaveAs("html-string.pdf");

            return Ok(pdf);



            //var doc = new HtmlToPdfDocument()
            //{
            //    GlobalSettings = {
            //    ColorMode = ColorMode.Color,
            //    Orientation = Orientation.Portrait,
            //    PaperSize = PaperKind.A4,
            //},
            //    Objects = {
            //    new ObjectSettings {
            //        HtmlContent = htmlContent
            //    }
            //}
            //};

            //var pdfBytes = _converter.Convert(doc);

            //return File(pdfBytes, "application/pdf", "converted.pdf");
        }
    }

}
