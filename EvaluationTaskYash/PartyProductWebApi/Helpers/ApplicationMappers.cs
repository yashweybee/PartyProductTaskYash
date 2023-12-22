using AutoMapper;
using PartyProductWebApi.DTOs;
using PartyProductWebApi.Models;

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
        }
    }
}
