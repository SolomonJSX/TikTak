using TikTak.GraphQl.DataAnnotatedModelValidations.Middleware;
using TikTak.GraphQl.DataAnnotatedModelValidations.TypeInterceptors;

namespace TikTak.GraphQl.DataAnnotatedModelValidations;

public static class DataAnnotationsValidatorRegistration
{
    public static IRequestExecutorBuilder AddDataAnnotationsValidator(this IRequestExecutorBuilder requestExecutorBuilder) =>
        requestExecutorBuilder
            .TryAddTypeInterceptor<ValidatorTypeInterceptor>()
            .UseField<ValidatorMiddleware>();
}
