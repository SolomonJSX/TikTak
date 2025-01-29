namespace TikTak.Resourse.DTOs;

public record UserClaimsDto(string FullName, int UserId, DateTime ExpiresIn, string Key);