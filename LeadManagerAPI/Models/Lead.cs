using System.ComponentModel.DataAnnotations;

namespace LeadManagerAPI.Models
{
    public class Lead
    {
        public int Id { get; set; }
        
        [Required]
        public string ContactFirstName { get; set; } = string.Empty;
        
        [Required]
        public string ContactLastName { get; set; } = string.Empty;
        
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Suburb { get; set; } = string.Empty;
        
        [Required]
        public string Category { get; set; } = string.Empty;
        
        public string Phone { get; set; } = "N/A";
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        public decimal Price { get; set; }
        
        public string Status { get; set; } = "New";
    }
}