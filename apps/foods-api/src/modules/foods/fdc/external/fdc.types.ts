import * as z from 'zod';

export const FdcDateSchema = z.string().date();
export type FdcDate = z.infer<typeof FdcDateSchema>;

export const FdcDataTypeEnumSchema = z.enum([
  'Branded',
  'Foundation',
  'Survey (FNDDS)',
  'SR Legacy',
]);
export type FdcDataTypeEnum = z.infer<typeof FdcDataTypeEnumSchema>;

export const FdcSortByEnumSchema = z.enum([
  'dataType.keyword',
  'lowercaseDescription.keyword',
  'fdcId',
  'publishedDate',
]);
export type FdcSortByEnum = z.infer<typeof FdcSortByEnumSchema>;

export const FdcSortOrderEnumSchema = z.enum(['asc', 'desc']);
export type FdcSortOrderEnum = z.infer<typeof FdcSortOrderEnumSchema>;

export const FdcDataTypeSchema = z.array(FdcDataTypeEnumSchema).min(1).max(4);
export type FdcDataType = z.infer<typeof FdcDataTypeSchema>;

export const FdcFoodSearchCriteriaSchema = z.object({
  query: z.string(),
  dataType: FdcDataTypeSchema.optional(),
  pageSize: z.number().min(1).max(200).optional(),
  pageNumber: z.number().nonnegative().optional(),
  sortBy: FdcSortByEnumSchema.optional(),
  sortOrder: FdcSortOrderEnumSchema.optional(),
  brandOwner: z.string().optional(),
});
export type FdcFoodSearchCriteria = z.infer<typeof FdcFoodSearchCriteriaSchema>;

export const FdcFoodNutritientAbridgedSchema = z.object({
  nutrientId: z.number().nonnegative(),
  nutrientName: z.string(),
  nutrientNumber: z.string(),
  unitName: z.string(),
  derivationCode: z.string().optional(),
  derivationDescription: z.string().optional(),
  value: z.number().optional(),
});
export type FdcFoodNutritientAbridged = z.infer<typeof FdcFoodNutritientAbridgedSchema>;

export const FdcSearchResultFoodSchema = z.object({
  fdcId: z.number().nonnegative(),
  dataType: FdcDataTypeEnumSchema.optional(),
  description: z.string(),
  foodCode: z.number().optional(),
  foodNutritients: z.array(FdcFoodNutritientAbridgedSchema).optional(),
  publishedDate: FdcDateSchema.optional(),
  scientificName: z.string().optional(), 
  brandOwner: z.string().optional(),
  gtinUpc: z.string().optional(),
  ingredients: z.string().optional(),
  ndbNumber: z.number().optional(),
  additionalDescriptions: z.string().optional(),
  score: z.number().optional(),
});
export type FdcSearchResultFood = z.infer<typeof FdcSearchResultFoodSchema>;

export const FdcSearchResponseDataSchema = z.object({
  foodSearchCriteria: FdcFoodSearchCriteriaSchema,
  totalHits: z.number().nonnegative(),
  currentPage: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
  foods: z.array(FdcSearchResultFoodSchema),
});
export type FdcSearchResponseData = z.infer<typeof FdcSearchResponseDataSchema>;
