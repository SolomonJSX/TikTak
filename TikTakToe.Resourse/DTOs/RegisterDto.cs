using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TikTakToe.Resourse.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Fullname is required")]
        [StringLength(100, ErrorMessage = "Fullname is required.")]
        public string FullName { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email must be valid.")]
        [StringLength(100, ErrorMessage = "Email is required.")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password is required")]
        [StringLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "ConfirmPassword is required")]
        [StringLength(100, ErrorMessage = "ConfirmPassword is required.")]
        public string ConfirmPassword { get; set; } = null!;


    }
}
