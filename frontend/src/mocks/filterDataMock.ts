import { IAccessRequest } from 'interfaces';
import { IBuilding } from './../actions/parcelsActions';
import { ILookupCode } from '../actions/lookupActions';
import { IParcel, IProperty } from 'actions/parcelsActions';
import { IProperty as IFlatProperty } from 'features/properties/list';
import { Workflows } from 'constants/index';
import { AccessRequestStatus } from 'constants/accessStatus';

export const SELECTEDCLASSIFICATION = {
  name: 'Core Operational',
  id: 0,
  isDisabled: false,
  type: 'Classification',
};

export const DISABLED = [
  {
    name: 'Core Operational',
    id: 0,
    isDisabled: false,
    type: 'Classification',
  },
  {
    name: 'Core Strategic',
    id: 1,
    isDisabled: true,
    type: 'Classification',
  },
];

export const CLASSIFICATIONS = [
  {
    name: 'Core Operational',
    id: '0',
    isDisabled: false,
    type: 'Classification',
    sortOrder: 1,
    isVisible: true,
  },
  {
    name: 'Core Strategic',
    id: '1',
    isDisabled: false,
    type: 'Classification',
    sortOrder: 2,
    isVisible: true,
  },
  {
    name: 'Surplus Active',
    id: '2',
    isDisabled: false,
    type: 'Classification',
    sortOrder: 3,
    isVisible: true,
  },
  {
    name: 'Surplus Encumbered',
    id: '3',
    isDisabled: false,
    type: 'Classification',
    sortOrder: 4,
    isVisible: true,
  },
  {
    name: 'Disposed',
    id: '4',
    isDisabled: false,
    type: 'Classification',
    sortOrder: 5,
    isVisible: false,
  },
] as ILookupCode[];

export const ADMINISTRATIVEAREAS = [
  {
    code: '0',
    name: 'Victoria',
    id: '0',
    isDisabled: false,
    type: 'AdministrativeArea',
  },
  {
    code: '1',
    name: 'Royal Oak',
    id: '1',
    isDisabled: false,
    type: 'AdministrativeArea',
  },
] as ILookupCode[];

export const AGENCIES = [
  {
    code: 'AEST',
    name: 'AEST',
    id: '1',
    isDisabled: false,
    type: 'Agency',
  },
  {
    code: 'HTLH',
    name: 'HTLH',
    id: '2',
    isDisabled: false,
    type: 'Agency',
  },
  {
    code: 'MOTI',
    name: 'MOTI',
    id: '3',
    isDisabled: false,
    type: 'Agency',
  },
  {
    code: 'FLNR',
    name: 'FLNR',
    id: '4',
    isDisabled: false,
    type: 'Agency',
  },
  {
    code: 'MAH',
    name: 'MAH',
    id: '5',
    isDisabled: false,
    type: 'Agency',
  },
];

export const PARCELS = [
  { id: 1, latitude: 48, longitude: 123 },
  { id: 2, latitude: 50, longitude: 133 },
] as IProperty[];

export const mockParcel = {
  id: 1,
  pid: '000-000-000',
  pin: '',
  projectNumber: '',
  zoning: '',
  zoningPotential: '',
  classificationId: 1,
  encumbranceReason: '',
  agencyId: '',
  isSensitive: false,
  latitude: 48,
  longitude: 123,
  classification: 'Core Operational',
  name: 'test name',
  description: 'test',
  assessedLand: 10000,
  assessedBuilding: 11000,
  evaluations: [
    {
      date: new Date(),
      key: 'Assessed',
      value: 10000,
    },
  ],
  fiscals: [
    {
      fiscalYear: 2020,
      key: 'NetBook',
      value: 10000,
    },
  ],
  address: {
    id: 1,
    line1: '1234 mock Street',
    line2: 'N/A',
    administrativeArea: 'Victoria',
    province: 'BC',
    postal: 'V1V1V1',
    provinceId: '1',
  },
  landArea: 123,
  landLegalDescription: 'test description',
  buildings: [],
  parcels: [],
  agency: 'AEST',
  agencyFullName: 'Ministry of Advanced Education',
  subAgency: 'KPU',
  subAgencyFullName: 'Kwantlen Polytechnic University',
  projectNumbers: ['SPP-00001'],
  projectStatus: 'In ERP',
  projectWorkflow: Workflows.ERP,
} as IParcel;

export const mockDetails = [
  {
    id: 1,
    pid: '000-000-000',
    pin: '',
    projectNumber: '',
    zoning: '',
    zoningPotential: '',
    classificationId: 1,
    encumbranceReason: '',
    agencyId: 1,
    isSensitive: false,
    latitude: 48,
    longitude: 123,
    propertyStatus: 'active',
    classification: 'Core Operational',
    name: 'test name',
    description: 'test',
    assessedLand: 10000,
    assessedBuilding: 10000,
    evaluations: [
      {
        date: new Date(),
        key: 'Assessed',
        value: 10000,
      },
    ],
    fiscals: [
      {
        fiscalYear: 2020,
        key: 'NetBook',
        value: 10000,
      },
    ],
    address: {
      id: 1,
      line1: '1234 mock Street',
      line2: 'N/A',
      administrativeArea: 'Victoria',
      province: 'BC',
      postal: 'V1V1V1',
      provinceId: '1',
    },
    landArea: 123,
    landLegalDescription: 'test',
    buildings: [],
    parcels: [],
    agency: 'MOTI',
    propertyTypeId: 0,
  },
  {
    id: 2,
    pid: '000-000-000',
    pin: '',
    zoning: '',
    zoningPotential: '',
    classificationId: 1,
    encumbranceReason: '',
    agencyId: 2,
    isSensitive: false,
    latitude: 50,
    longitude: 133,
    classification: 'Core Operational',
    name: 'test name',
    description: 'test',
    assessedLand: 10000,
    assessedBuilding: 10000,
    address: {
      id: 1,
      line1: '1234 mock Street',
      line2: 'N/A',
      administrativeArea: 'Victoria',
      provinceId: '1',
      province: 'BC',
      postal: 'V1V1V1',
    },
    landArea: 123,
    landLegalDescription: 'test',
    buildings: [],
    parcels: [],
    evaluations: [
      {
        date: new Date(),
        key: 'Assessed',
        value: 10000,
      },
    ],
    fiscals: [
      {
        fiscalYear: 2020,
        key: 'NetBook',
        value: 10000,
      },
    ],
    agency: 'HLTH',
  },
] as IParcel[];

export const mockBuildingWithAssociatedLand: IBuilding = {
  pid: '',
  agencyCode: 'TRAN',
  assessedLand: 0,
  assessedBuilding: 0,
  parcelId: 2,
  buildingConstructionTypeId: 1,
  buildingConstructionType: 'Masonry',
  buildingFloorCount: 0,
  buildingPredominateUseId: 20,
  buildingPredominateUse: 'Acute Care',
  buildingOccupantTypeId: 0,
  buildingOccupantType: 'Leased',
  occupantName: '',
  transferLeaseOnSale: false,
  buildingTenancy: '',
  rentableArea: 2,
  totalArea: 2,
  leasedLandMetadata: [{ parcelId: 2, type: 0, ownershipNote: '' }],
  parcels: [
    {
      agency: '',
      pid: '000-000-001',
      encumbranceReason: '',
      assessedLand: 0,
      assessedBuilding: 0,
      landArea: 13.4,
      landLegalDescription:
        'Lot 2, Plan KAP68510, Section 22, Township 91, Kamloops Division of Yale Land District',
      zoning: '',
      zoningPotential: '',
      evaluations: [
        {
          parcelId: 2,
          date: '2015-01-01T00:00:00',
          key: 'Assessed',
          value: 635000.0,
          firm: '',
        },
        {
          parcelId: 2,
          date: '2021-01-25T00:00:00',
          key: 'Appraised',
          value: 0.0,
          firm: '',
        },
      ],
      fiscals: [
        {
          parcelId: 2,
          fiscalYear: 2015,
          key: 'NetBook',
          value: 0.0,
        },
        {
          parcelId: 2,
          fiscalYear: 2021,
          key: 'NetBook',
          value: 0.0,
        },
        {
          parcelId: 2,
          fiscalYear: 2021,
          key: 'Market',
          value: 0.0,
        },
      ],
      buildings: [
        {
          pid: '',
          totalArea: 2,
          encumbranceReason: '',
          agencyCode: 'TRAN',
          assessedLand: 0,
          assessedBuilding: 0,
          parcels: [],
          parcelId: 2,
          buildingConstructionTypeId: 1,
          buildingConstructionType: 'Masonry',
          buildingFloorCount: 0,
          buildingPredominateUseId: 20,
          buildingPredominateUse: 'Acute Care',
          buildingOccupantTypeId: 0,
          buildingOccupantType: 'Leased',
          occupantName: '',
          transferLeaseOnSale: false,
          buildingTenancy: '',
          rentableArea: 2,
          evaluations: [],
          fiscals: [],
          id: 1640,
          propertyTypeId: 0,
          projectNumbers: ['DRAFT-00031'],
          name: '',
          description: '',
          classificationId: 0,
          classification: 'Core Operational',
          agencyId: 11,
          agency: 'MAG',
          address: {
            id: 2056,
            line1: 'test',
            administrativeArea: '100 Mile House',
            provinceId: 'BC',
            province: 'British Columbia',
            postal: '',
          },
          latitude: 47.113359492035364,
          longitude: -115.25849491716869,
          isSensitive: false,
        },
      ],
      parcels: [],
      id: 2,
      propertyTypeId: 0,
      projectNumbers: [],
      name: 'Traditional site',
      description: 'Traditional site',
      classificationId: 0,
      classification: 'Core Operational',
      agencyId: 41,
      address: {
        id: 80,
        line1: '4155 Belshaw St.',
        administrativeArea: 'Merritt',
        provinceId: 'BC',
        province: 'British Columbia',
        postal: 'V1K 1R1',
      },
      latitude: 50.1244,
      longitude: -120.766,
      isSensitive: false,
    },
  ],
  evaluations: [
    {
      buildingId: 2,
      date: '2015-01-01T00:00:00',
      key: 'Assessed',
      value: 635000.0,
      firm: '',
    },
    {
      buildingId: 2,
      date: '2021-01-25T00:00:00',
      key: 'Appraised',
      value: 0.0,
      firm: '',
    },
  ],
  fiscals: [
    {
      buildingId: 2,
      fiscalYear: 2015,
      key: 'NetBook',
      value: 0.0,
    },
    {
      buildingId: 2,
      fiscalYear: 2021,
      key: 'NetBook',
      value: 0.0,
    },
    {
      buildingId: 2,
      fiscalYear: 2021,
      key: 'Market',
      value: 0.0,
    },
  ],
  id: 1,
  propertyTypeId: 0,
  projectNumbers: ['DRAFT-00031'],
  name: '',
  description: '',
  classificationId: 0,
  classification: 'Core Operational',
  encumbranceReason: '',
  agencyId: 11,
  agency: 'MAG',
  address: {
    id: 2056,
    line1: 'test',
    administrativeArea: '100 Mile House',
    provinceId: 'BC',
    province: 'British Columbia',
    postal: '',
  },
  latitude: 47.113359492035364,
  longitude: -115.25849491716869,
  isSensitive: false,
};

export const mockFlatProperty: IFlatProperty = {
  name: 'Test Property',
  id: 0,
  propertyTypeId: 0,
  propertyType: 'Land',
  latitude: 23,
  longitude: 23,
  pid: '123-123-123',
  classificationId: 2,
  classification: 'Surplus Active',
  description: 'test',
  isSensitive: false,
  agencyId: 1,
  agency: 'test',
  agencyCode: 'TST',
  address: '1234 Test St',
  addressId: 1,
  administrativeArea: 'Victoria',
  province: 'BC',
  postal: 'A1A 1A1',
  market: 123,
  netBook: 223,
  assessedLand: 123,
  appraised: 1000,
  landArea: 123,
  landLegalDescription: 'test',
  city: 'Victoria',
} as IFlatProperty;

export const mockFlatBuildingProperty: IFlatProperty = {
  address: '6460 Applecross Road',
  propertyType: 'Building',
  propertyTypeId: 0,
  city: 'Victoria',
  addressId: 267,
  netBook: 223,
  market: 1241,
  administrativeArea: 'Nanaimo',
  agency: 'Transportation & Infrastructure',
  agencyCode: 'TRAN',
  agencyId: 250,
  classification: 'Core Operational',
  classificationId: 0,
  constructionType: 'Concrete',
  constructionTypeId: 0,
  description: 'Claims Centre',
  floorCount: 1,
  id: 199,
  isSensitive: false,
  landArea: 0.9793,
  landLegalDescription: 'Lot 1 Plan VIP27659 District Lot 48 Wellington Land District',
  latitude: 49.2362329,
  longitude: -124.0425559,
  name: '6460 Claims Centre',
  occupantType: 'Leased',
  occupantTypeId: 0,
  pid: '002-165-236',
  postal: '',
  predominateUse: 'Commercial',
  predominateUseId: 26,
  projectNumbers: [],
  province: 'British Columbia',
  rentableArea: 0,
  subAgency: 'Insurance Corporation of BC',
  subAgencyCode: 'ICBC',
  tenancy: '100% ICBC',
  transferLeaseOnSale: false,
};

export const ACTIVE = {
  id: 1,
  pid: '000-000-000',
  pin: '',
  projectNumber: '',
  zoning: '',
  zoningPotential: '',
  classificationId: 1,
  encumbranceReason: '',
  agencyId: '',
  isSensitive: false,
  latitude: 48,
  longitude: 123,
  classification: 'Core Operational',
  name: 'test name',
  description: 'test',
  assessedLand: 10000,
  assessedBuilding: 10000,
  evaluations: [
    {
      date: new Date(),
      key: 'Assessed',
      value: 10000,
    },
  ],
  fiscals: [
    {
      fiscalYear: 2020,
      key: 'NetBook',
      value: 10000,
    },
  ],
  address: {
    id: 1,
    line1: '1234 mock Street',
    line2: 'N/A',
    administrativeArea: 'Victoria',
    province: 'BC',
    postal: 'V1V1V1',
    provinceId: '1',
  },
  landArea: 123,
  landLegalDescription: 'test',
  buildings: [],
  parcels: [],
  agency: 'FIN',
} as IParcel;

export const mockAccessRequest: IAccessRequest = {
  id: 2,
  userId: '14c9a273-6f4a-4859-8d59-9264d3cee53f',
  status: AccessRequestStatus.OnHold,
  note: '',
  user: {
    id: '14c9a273-6f4a-4859-8d59-9264d3cee53f',
    displayName: 'User, Admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@pims.gov.bc.ca',
    username: 'admin',
    position: '',
    createdOn: '2021-05-04T19:07:09.6920606',
  },
  agencies: [
    {
      description: '',
      code: 'AG',
      id: 251,
      name: 'Attorney General',
      isDisabled: false,
      sortOrder: 0,
      createdOn: '2021-05-07T00:37:06.2457312',
    },
  ],
  roles: [
    {
      description: 'Real Estate Manager can manage properties within their agencies.',
      id: 'aad8c03d-892c-4cc3-b992-5b41c4f2392c',
      name: 'Real Estate Manager',
      isDisabled: false,
      sortOrder: 0,
      createdOn: '2021-05-07T00:37:06.2457315',
      updatedByName: 'unknown',
      updatedByEmail: 'unknown',
      rowVersion: 'AAAAAAAAJyM=',
    },
  ],
  createdOn: '2021-05-07T00:37:06.2457303',
};
