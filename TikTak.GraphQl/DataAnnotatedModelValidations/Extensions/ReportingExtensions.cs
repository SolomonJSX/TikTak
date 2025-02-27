using Path = HotChocolate.Path;
using RegexUtils = TikTak.GraphQl.DataAnnotatedModelValidations.Utils.RegexUtils;

namespace TikTak.GraphQl.DataAnnotatedModelValidations.Extensions;

internal static class ReportingExtensions
{
    internal static string GetNormalizedMemberName(this string memberName) =>
        RegexUtils.BracketsRegularExpression.Replace(memberName.Camelize(), ReportingConsts.BracketReplacement);

    internal static IEnumerable<string> ToTokenizedMemberNames(this string trimmedMemberName) =>
        trimmedMemberName
            .Split(ReportingConsts.MemberNameTokenizationChar)
            .Select(GetNormalizedMemberName);

    internal static IEnumerable<string> ToComposedMemberNames(
        this IInputField argument,
        string? memberName,
        bool? valueValidation
    ) =>
        (memberName?.Trim(), valueValidation) switch
        {
            ({ Length: > 0 } trimmedMemberName, true) =>
                trimmedMemberName.ToTokenizedMemberNames(),
            ({ Length: > 0 } trimmedMemberName, _) =>
                trimmedMemberName.ToTokenizedMemberNames().Prepend(argument.Name),
            _ => argument.Name.AsEnumerable()
        };

    internal static Path ToArgumentPath(this IReadOnlyCollection<string> contextPath, IEnumerable<string> composedMemberNames) =>
        contextPath
            .Concat(composedMemberNames)
            .Aggregate(Path.Root, (acc, item) => acc.Append(item));

    internal static void ReportError(
        this IMiddlewareContext context,
        IInputField argument,
        IReadOnlyCollection<string> contextPathList,
        bool? valueValidation,
        string? message = default,
        string? memberName = default
    ) =>
        context.ReportError(
            ErrorBuilder
                .New()
                .SetMessage(message switch
                {
                    { Length: > 0 } => message,
                    _ => ReportingConsts.GenericErrorMessage
                })
                .SetCode(ReportingConsts.GenericErrorCode)
                .SetPath(
                    contextPathList.ToArgumentPath(
                        argument.ToComposedMemberNames(memberName, valueValidation)
                    )
                )
                .SetExtension(memberName!.Camelize()!, message switch
                {
                    { Length: > 0 } => message,
                    _ => ReportingConsts.GenericErrorMessage
                })
                .Build()
        );
}
