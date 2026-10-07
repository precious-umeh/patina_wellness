import throwError from "./throwError.js";

export function getPaginationParams(
  query,
  { defaultLimit = 20, maxLimit = 100 } = {},
) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? defaultLimit);

  if (!Number.isInteger(page) || page < 1) {
    throwError("page must be a valid number", 400);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    throwError(`Limit must be a whole number between 1 and ${maxLimit}`, 400);
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function buildPaginationMeta(
  page,
  limit,
  totalItems,
  totalKey = "totalItems",
) {
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

  return {
    currentPage: page,
    pageSize: limit,
    [totalKey]: totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
