using AutoMapper;
using EvaluationTaskYash.DTOs;
using EvaluationTaskYash.Models;
using PartyProductWebApi.DTOs;


namespace PartyProductWebApi.Helpers
{
    public class ApplicationMappers : Profile
    {
        public ApplicationMappers()
        {
            CreateMap<Party, PartyDTO>().ReverseMap();
            CreateMap<PartyCreationDTO, Party>();

            CreateMap<Product, ProductDTO>().ReverseMap();
            CreateMap<ProductCreationDTO, Product>();

            CreateMap<ProductRate, ProductRateDTO>().ReverseMap();
            CreateMap<ProductRateCreationDTO, ProductRate>();

            CreateMap<AssignParty, AssignPartyDTO>().ReverseMap();
            CreateMap<AssignPartyCreationDTO, AssignParty>();

            CreateMap<Invoice, InvoiceDTO>().ReverseMap();
            CreateMap<InvoiceCreationDTO, Invoice>();

            CreateMap<InvoiceDatum, InvoiceDataDTO>().ReverseMap();
            CreateMap<InvoiceDataCreationDTO, InvoiceDatum>();

            //CreateMap<InvoiceDetail, InvoiceDetailDTO>().ReverseMap();
            //CreateMap<InvoiceDetailCreationDTO, InvoiceDetail>();
        }
    }
}
