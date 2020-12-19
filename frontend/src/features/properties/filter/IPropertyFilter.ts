import { TrueFalse } from 'constants/trueFalse';

/**
 * Property filter options used by Formik.
 */
export interface IPropertyFilter {
  /** Select one of the search options [address, pid, projectNumber, location]. */
  searchBy: string;
  /** The page number. */
  page?: string;
  /** The quantity to return in a single request for paging. */
  quantity?: string;
  /** The unique PID of the parcel. */
  pid: string;
  /** The address of the property. */
  address: string;
  /** The location of the property. */
  administrativeArea: string;
  /** The project number the property is part of. */
  projectNumber: string;
  /** comma-separated list of agencies to filter by */
  agencies: string;
  /** The classification of the property. */
  classificationId: string;
  /** The minimum lot size of the property. */
  minLotSize: string;
  /** The maxium lot size of the property. */
  maxLotSize: string;
  /** Whether the property is in SPP. */
  inSurplusPropertyProgram?: TrueFalse;
  /** Whether the property is in ERP. */
  inEnhancedReferralProcess?: TrueFalse;
  /** Select on of the property types [Land, Building]. */
  propertyType?: string;
  /** The name of desired target */
  name?: string;
  /** The building construction type id */
  constructionTypeId?: string;
  /** The building predominant use id */
  predominateUseId?: string;
  /** The building number of floors */
  floorCount?: string;
  /** Flag for whether to include buildings */
  bareLandOnly?: boolean;
  /** filter for building rentable area */
  rentableArea: string;
}