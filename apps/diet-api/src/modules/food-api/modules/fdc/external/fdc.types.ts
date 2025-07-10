import * as z from 'zod';

export const FdcDateSchema = z.string().date();
export type FdcDate = z.infer<typeof FdcDateSchema>;

export const FDC_DATA_TYPE = {
  BRANDED: 'Branded',
  FOUNDATION: 'Foundation',
  SURVEY: 'Survey (FNDDS)',
  LEGACY: 'SR Legacy',
} as const;

export const FDC_UNIT_NAME = {
  UG: 'UG',
  MG: 'MG',
  G: 'G',
  IU: 'IU',
  KJ: 'kJ',
  KCAL: 'KCAL',
  MG_ATE: 'MG_ATE',
} as const;

export const FDC_SORT_BY = {
  DATA_TYPE_KEYWORD: 'dataType.keyword',
  LOWERCASE_DESCRIPTION_KEYWORD: 'lowercaseDescription.keyword',
  FDC_ID: 'fdcId',
  PUBLISHED_DATE: 'publishedDate',
};

export const FDC_SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FdcDataTypeSchema = z.array(z.nativeEnum(FDC_DATA_TYPE)).min(1).max(4);

export const FdcFoodSearchCriteriaSchema = z.object({
  query: z.string(),
  dataType: FdcDataTypeSchema.optional(),
  pageSize: z.number().min(1).max(200).optional(),
  pageNumber: z.number().nonnegative().optional(),
  sortBy: z.nativeEnum(FDC_SORT_BY).optional(),
  sortOrder: z.nativeEnum(FDC_SORT_ORDER).optional(),
  brandOwner: z.string().optional(),
});

export const FdcFoodNutrientAbridgedSchema = z.object({
  nutrientId: z.number().nonnegative(),
  nutrientName: z.string(),
  nutrientNumber: z.string(),
  unitName: z.nativeEnum(FDC_UNIT_NAME),
  derivationCode: z.string().optional(),
  derivationDescription: z.string().optional(),
  value: z.number().optional(),
});
export type FdcFoodNutrientAbridged = z.infer<typeof FdcFoodNutrientAbridgedSchema>;

export const FdcSearchResultFoodSchema = z.object({
  fdcId: z.number().nonnegative(),
  dataType: z.nativeEnum(FDC_DATA_TYPE).optional(),
  description: z.string(),
  foodCategory: z.string().optional(),
  foodCode: z.number().optional(),
  foodNutrients: z.array(FdcFoodNutrientAbridgedSchema).optional(),
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
