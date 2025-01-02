namespace TikTakToe.Resourse.DTOs;

public record UserClaimsDto(string FullName, Guid UserId, DateTime ExpiresIn, string Key);