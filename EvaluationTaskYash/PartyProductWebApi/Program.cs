using AutoMapper;
using PartyProductWebApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<PartyProductWebApiContext>();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddCors();
//builder.Services.AddMvc();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(builder => builder
    .AllowAnyOrigin()
     .AllowAnyMethod()
     .AllowAnyHeader()
    );
}



app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//app.UseMvc();

app.Run();

