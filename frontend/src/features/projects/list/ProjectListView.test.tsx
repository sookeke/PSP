import { useKeycloak } from '@react-keycloak/web';
import { fireEvent } from '@testing-library/dom';
import { act, cleanup, render } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import { Formik } from 'formik';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ILookupCode, lookupCodesSlice } from 'store/slices/lookupCodes';
import { fillInput } from 'utils/testUtils';

import service from '../apiService';
import ProjectListView from './ProjectListView';

const mockAxios = new MockAdapter(axios);
mockAxios.onAny().reply(200, {});

jest.mock('@react-keycloak/web');
const mockKeycloak = (claims: string[]) => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: {
      userInfo: {
        agencies: [1],
        roles: claims,
      },
      subject: 'test',
    },
  });
};

const testData = {
  items: [
    {
      projectNumber: 'SPP-10015',
      name: 'Project name 16',
      statusId: 0,
      status: 'Draft',
      tierLevelId: 1,
      tierLevel: 'Tier 1',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      note: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      agencyId: 35,
      agency: 'AEST',
      subAgency: 'UOV',
      properties: [
        {
          id: 1,
          propertyTypeId: 1,
          description:
            'Gym, teaching kitchen, energy lab, greenhouse. Building full name: Center for Excellence in Sustainability',
          classification: 'Core Operational',
          agencyId: 0,
          subAgency: 'Nichola Valley Institute of Technology',
          agencyCode: 'AEST',
          address: '4155 Belshaw St',
          city: 'Merritt',
          netBook: 0,
          assessed: 0,
          market: 0,
          landArea: 26.9,
          createdOn: '2020-05-28T18:48:03.181977',
          rowVersion: 'AAAAAAAAfRA=',
        },
      ],
      createdBy: 'User, Administrator',
      createdOn: '2020-05-28T18:48:03.181976',
      rowVersion: 'AAAAAAAAfQ8=',
    },
  ],
  page: 1,
  quantity: 10,
  pageIndex: 0,
  total: 1,
};

// Set all module functions to jest.fn
jest.mock('../apiService');
const mockedService = service as jest.Mocked<typeof service>;

const mockStore = configureMockStore([thunk]);

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    {
      name: 'classificationVal',
      id: '1',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};

const store = mockStore({
  [lookupCodesSlice.name]: lCodes,
});
mockAxios.onAny().reply(200, {});
const history = createMemoryHistory();

const testRender = () =>
  render(
    <Formik initialValues={{}} onSubmit={noop}>
      <Provider store={store}>
        <Router history={history}>
          <ProjectListView />
        </Router>
      </Provider>
    </Formik>,
  );

describe('Project list view tests', () => {
  // clear mocks before each test
  beforeEach(() => {
    mockedService.getProjectList.mockClear();
    mockedService.deleteProject.mockClear();
    mockKeycloak([]);
  });
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('Matches snapshot', async () => {
    mockedService.getProjectList.mockResolvedValueOnce(testData as any);
    mockAxios.onAny().reply(200, {});

    await act(async () => {
      const { container } = testRender();
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('Displays message for empty list', async () => {
    mockedService.getProjectList.mockResolvedValueOnce({
      quantity: 0,
      total: 0,
      page: 1,
      pageIndex: 0,
      items: [],
    });

    await act(async () => {
      const { findByText, container } = testRender();

      // default table message when there is no data to display
      const noResults = await findByText('No rows to display');
      expect(noResults).toBeVisible();
      expect(container.querySelector('span[class="spinner-border"]')).not.toBeInTheDocument();
    });
  });

  it('Can reset the search filter', async () => {
    mockedService.getProjectList.mockResolvedValue({
      quantity: 0,
      total: 0,
      page: 1,
      pageIndex: 0,
      items: [],
    });

    await act(async () => {
      const { container, getByDisplayValue, getByTestId } = testRender();
      await fillInput(container, 'name', 'test');
      expect(getByDisplayValue('test')).toBeVisible();
      const resetButton = getByTestId('reset-button');
      fireEvent.click(resetButton);
      expect(container.querySelector(`input[name="name"]`)).toHaveValue('');
    });
  });

  it('Does not display export buttons by default', async () => {
    mockedService.getProjectList.mockResolvedValueOnce({
      quantity: 0,
      total: 0,
      page: 1,
      pageIndex: 0,
      items: [],
    });

    await act(async () => {
      const { queryByTestId, container } = testRender();
      expect(queryByTestId('excel-icon')).not.toBeInTheDocument();
      expect(queryByTestId('csv-icon')).not.toBeInTheDocument();
      expect(container.querySelector('span[class="spinner-border"]')).not.toBeInTheDocument();
    });
  });

  it('Displays export buttons with view reports permission', async () => {
    mockKeycloak([Claims.REPORTS_VIEW, Claims.PROJECT_VIEW]);
    mockedService.getProjectList.mockResolvedValueOnce({
      quantity: 0,
      total: 0,
      page: 1,
      pageIndex: 0,
      items: [],
    });

    await act(async () => {
      const { getByTestId, container } = testRender();
      expect(getByTestId('excel-icon')).toBeInTheDocument();
      expect(getByTestId('csv-icon')).toBeInTheDocument();
      expect(container.querySelector('span[class="spinner-border"]')).not.toBeInTheDocument();
    });
  });
});
