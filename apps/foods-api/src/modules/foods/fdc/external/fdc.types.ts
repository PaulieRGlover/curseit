import z from 'zod';

export const FdcDate = z.string().date();
export const FdcDataTypeEnum = z.enum([
  'Branded',
  'Foundation',
  'Survey (FNDDS)',
  'SR Legacy',
]);
export const FdcSortByEnum = z.enum([
  'dataType.keyword',
  'lowercaseDescription.keyword',
  'fdcId',
  'publishedDate',
]);
export const FdcSortOrderEnum = z.enum(['asc', 'desc']);

export const FdcDataType = z.array(FdcDataTypeEnum).min(1).max(4);

export const FdcFoodSearchCriteria = z.object({
  query: z.string(),
  dataType: z.array(FdcDataType).optional(),
  pageSize: z.number().min(1).max(200).optional(),
  pageNumber: z.number().nonnegative().optional(),
  sortBy: FdcSortByEnum.optional(),
  sortOrder: FdcSortOrderEnum.optional(),
  brandOwner: z.string().optional(),
});

export const FdcFoodNutritientAbridged = z.object({
  nutrientId: z.number().nonnegative(),
  nutrientName: z.string(),
  nutrientNumber: z.string(),
  unitName: z.string(),
  derivationCode: z.string().optional(),
  derivationDescription: z.string().optional(),
  value: z.number().optional(),
});

export const FdcSearchResultFood = z.object({
  fdcId: z.number().nonnegative(),
  dataType: FdcDataType.optional(),
  description: z.string(),
  foodCode: z.string().optional(),
  foodNutritients: z.array(FdcFoodNutritientAbridged).optional(),
  publishedDate: FdcDate.optional(),
  scientificName: z.string().optional(),
  brandOwner: z.string().optional(),
});

export const FdcSearchResponseDataSchema = z.object({
  foodSearchCriteria: FdcFoodSearchCriteria,
  totalHits: z.number().nonnegative(),
  currentPage: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
  foods: z.array(FdcSearchResultFood),
});
