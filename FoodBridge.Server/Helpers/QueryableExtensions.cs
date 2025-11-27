using FoodBridge.Server.DTOs.Common;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FoodBridge.Server.Helpers
{
    public static class QueryableExtensions
    {
        public static async Task<PagedResultDto<T>> ToPagedResultAsync<T>(
        this IQueryable<T> query,
       int pageNumber,
            int pageSize)
        {
    var totalCount = await query.CountAsync();
         var items = await query
   .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
         .ToListAsync();

  return new PagedResultDto<T>
          {
        Items = items,
     TotalCount = totalCount,
    PageNumber = pageNumber,
PageSize = pageSize
      };
        }

        public static IQueryable<T> ApplySearch<T>(
    this IQueryable<T> query,
  string? searchTerm,
   params Expression<Func<T, string>>[] searchProperties)
        {
            if (string.IsNullOrWhiteSpace(searchTerm) || !searchProperties.Any())
       return query;

    var parameter = Expression.Parameter(typeof(T), "x");
            Expression? combinedExpression = null;

 foreach (var property in searchProperties)
            {
  var propertyAccess = Expression.Invoke(property, parameter);
var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
        var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });

                if (toLowerMethod == null || containsMethod == null)
  continue;

         var propertyToLower = Expression.Call(propertyAccess, toLowerMethod);
     var searchTermLower = Expression.Constant(searchTerm.ToLower());
              var containsCall = Expression.Call(propertyToLower, containsMethod, searchTermLower);

        combinedExpression = combinedExpression == null
  ? containsCall
      : Expression.OrElse(combinedExpression, containsCall);
        }

 if (combinedExpression == null)
              return query;

            var lambda = Expression.Lambda<Func<T, bool>>(combinedExpression, parameter);
            return query.Where(lambda);
        }

        public static IQueryable<T> ApplySort<T>(
            this IQueryable<T> query,
string? sortBy,
            bool sortDescending = false)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
 return query;

            var parameter = Expression.Parameter(typeof(T), "x");
            var property = typeof(T).GetProperty(sortBy);

  if (property == null)
     return query;

   var propertyAccess = Expression.MakeMemberAccess(parameter, property);
            var lambda = Expression.Lambda(propertyAccess, parameter);

            var methodName = sortDescending ? "OrderByDescending" : "OrderBy";
  var resultExpression = Expression.Call(
  typeof(Queryable),
         methodName,
 new Type[] { typeof(T), property.PropertyType },
       query.Expression,
   Expression.Quote(lambda));

            return query.Provider.CreateQuery<T>(resultExpression);
        }
    }
}
