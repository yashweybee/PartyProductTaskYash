﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace EvaluationTaskYash.Models;

public partial class PartyProductWebApiContext : DbContext
{
    public PartyProductWebApiContext()
    {
    }

    public PartyProductWebApiContext(DbContextOptions<PartyProductWebApiContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AssignParty> AssignParties { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<InvoiceDatum> InvoiceData { get; set; }

    public virtual DbSet<InvoiceDetail> InvoiceDetails { get; set; }

    public virtual DbSet<Party> Parties { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductRate> ProductRates { get; set; }

    public virtual DbSet<ProductRateLog> ProductRateLogs { get; set; }

    public virtual DbSet<Usere> Useres { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=DESKTOP-I8CAHS7;Database=PartyProductWebApi;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AssignParty>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AssignPa__3214EC070204EA22");

            entity.ToTable("AssignParty");

            entity.HasOne(d => d.Party).WithMany(p => p.AssignParties)
                .HasForeignKey(d => d.PartyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AssignPar__Party__47DBAE45");

            entity.HasOne(d => d.Product).WithMany(p => p.AssignParties)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AssignPar__Produ__48CFD27E");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Invoice__3214EC078EA691E1");

            entity.ToTable("Invoice");

            entity.Property(e => e.Date).HasColumnType("date");

            entity.HasOne(d => d.Party).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.PartyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Invoice__PartyId__412EB0B6");

            entity.HasOne(d => d.Product).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Invoice__Product__4222D4EF");
        });

        modelBuilder.Entity<InvoiceDatum>(entity =>
        {
            entity.Property(e => e.Date).HasColumnType("date");

            entity.HasOne(d => d.Party).WithMany(p => p.InvoiceData)
                .HasForeignKey(d => d.PartyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InvoiceData_Party");
        });

        modelBuilder.Entity<InvoiceDetail>(entity =>
        {
            entity.HasOne(d => d.Invoice).WithMany(p => p.InvoiceDetails)
                .HasForeignKey(d => d.InvoiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InvoiceDetails_InvoiceData");

            entity.HasOne(d => d.Product).WithMany(p => p.InvoiceDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InvoiceDetails_Product");
        });

        modelBuilder.Entity<Party>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Party__3214EC076D3DC541");

            entity.ToTable("Party");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Product__3214EC0725BD5FA2");

            entity.ToTable("Product");
        });

        modelBuilder.Entity<ProductRate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ProductR__3214EC0731EA6B61");

            entity.ToTable("ProductRate", tb => tb.HasTrigger("trInsertProductRateLog"));

            entity.HasOne(d => d.Product).WithMany(p => p.ProductRates)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductRa__Produ__3E52440B");
        });

        modelBuilder.Entity<ProductRateLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ProductR__3214EC0757118224");

            entity.Property(e => e.Date).HasColumnType("date");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductRateLogs)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductRa__Produ__44FF419A");
        });

        modelBuilder.Entity<Usere>(entity =>
        {
            entity.ToTable("useres");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserName).HasColumnName("userName");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
