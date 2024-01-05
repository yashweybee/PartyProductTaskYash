using DinkToPdf.Contracts;
using DinkToPdf;

namespace EvaluationTaskYash.Services
{
    public class PdfService
    {
        private readonly IConverter _converter;

        public PdfService(IConverter converter)
        {
            _converter = converter;
        }

        public byte[] GeneratePdf(string htmlContent)
        {
            var globalSettings = new GlobalSettings
            {
                PaperSize = PaperKind.A4,
                Orientation = Orientation.Portrait,
            };

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,
                HtmlContent = htmlContent,
            };

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings },
            };

            return _converter.Convert(pdf);
        }

        //public byte[] GeneratorPdf(string htmlContent)
        //{
        //    var globalSettings = new GlobalSettings
        //    {
        //        ColorMode = ColorMode.Color,
        //        Orientation = Orientation.Portrait,
        //        PaperSize = PaperKind.A4,
        //        Margins = new MarginSettings { Top = 10, Bottom = 10, Left = 10, Right = 10 },
        //        DocumentTitle = "Generated PDF"
        //    };

        //    var objectSettings = new ObjectSettings
        //    {
        //        PagesCount = true,
        //        //HtmlContent = htmlContent,
        //        Page = "https://www.google.com/",
        //        WebSettings = { DefaultEncoding = "utf-8" },
        //        HeaderSettings = { FontSize = 12, Right = "Page [page] of [toPage]", Line = true, Spacing = 2.812 },
        //        FooterSettings = { FontSize = 12, Line = true, Right = "© " + DateTime.Now.Year }
        //    };

        //    var document = new HtmlToPdfDocument()
        //    {
        //        GlobalSettings = globalSettings,
        //        Objects = { objectSettings }
        //    };

        //    return _converter.Convert(document);
        //}
    }
}
