using Microsoft.EntityFrameworkCore;
using LeadManagerAPI.Models;

namespace LeadManagerAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Lead> Leads { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // SQLite usa REAL para decimal
            modelBuilder.Entity<Lead>()
                .Property(l => l.Price)
                .HasColumnType("REAL");
        }
    }
}