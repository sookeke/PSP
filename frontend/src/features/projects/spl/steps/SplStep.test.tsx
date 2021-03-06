import { useKeycloak } from '@react-keycloak/web';
import { act, cleanup, render, screen, wait } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Claims from 'constants/claims';
import { PropertyTypes } from 'constants/propertyTypes';
import { createMemoryHistory } from 'history';
import _ from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { IProject, SPPApprovalTabs } from '../../common';
import { AgencyResponses, ReviewWorkflowStatus } from '../../common/interfaces';
import { getStore, mockFlatProject, mockProject as defaultProject } from '../../dispose/testUtils';
import { SplStep } from '..';

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

const history = createMemoryHistory();
const mockAxios = new MockAdapter(axios);
const mockProject = _.cloneDeep(defaultProject);
mockProject.statusCode = ReviewWorkflowStatus.PreMarketing;
mockProject.approvedOn = '2020-07-15';
mockProject.submittedOn = '2020-07-15';

const getSplStep = (storeOverride?: any) => (
  <Provider store={storeOverride ?? getStore(mockProject)}>
    <Router history={history}>
      <SplStep />
    </Router>
  </Provider>
);

describe('SPL Approval Step', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
    mockAxios.reset();
  });
  beforeAll(() => {
    mockAxios.onAny().reply(200, {});
  });
  it('renders correctly', () => {
    mockKeycloak([]);
    const { container } = render(getSplStep());
    expect(container.firstChild).toMatchSnapshot();
  });
  describe('SPL tab Display', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });
    it('Displays Project Information Tab', async () => {
      const store = getStore(mockProject, SPPApprovalTabs.projectInformation);
      const { getByText } = render(getSplStep(store));
      expect(getByText(/Project No\./)).toBeVisible();
    });
    it('Displays Documentation Tab', () => {
      const store = getStore(mockProject, SPPApprovalTabs.documentation);
      const { getByText } = render(getSplStep(store));
      expect(getByText(/First Nations Consultation/)).toBeVisible();
    });
    it('Displays ERP Tab', () => {
      const store = getStore(mockProject, SPPApprovalTabs.erp);
      const { getByText } = render(getSplStep(store));
      expect(getByText(/Enhanced Referral Process Complete/)).toBeVisible();
    });
    it('Displays SPL Tab', () => {
      const store = getStore(mockProject, SPPApprovalTabs.spl);
      const { getByText } = render(getSplStep(store));
      expect(getByText(/Date Entered Market/)).toBeVisible();
    });
    it('Displays close out Tab', async () => {
      const store = getStore(mockProject, SPPApprovalTabs.closeOutForm);
      const { getByText } = render(getSplStep(store));
      expect(getByText(/Signed by Chief Financial Officer/)).toBeVisible();
    });
  });
  describe('Display when user has required claims', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });

    it('save button is visible and not disabled', () => {
      const { getByText } = render(getSplStep());
      const saveButton = getByText(/Save/);
      expect(saveButton).toBeVisible();
      expect(saveButton).not.toBeDisabled();
    });
    it('cancel button is visible and not disabled', () => {
      const { getByText } = render(getSplStep());
      const cancelButton = getByText(/Cancel Project/);
      expect(cancelButton).toBeVisible();
      expect(cancelButton).not.toBeDisabled();
    });
    it('form fields are not disabled', () => {
      const { queryAllByRole } = render(getSplStep());
      const textboxes = queryAllByRole('textbox');
      textboxes.forEach(textbox => {
        expect(textbox).toBeVisible();
        if (!textbox.className.includes('date-picker') && textbox.id !== 'input-note') {
          expect(textbox).not.toBeDisabled();
        }
      });
    });
  });
  describe('Display when user missing claims', () => {
    beforeAll(() => {
      mockKeycloak([]);
    });
    it('save button is not rendered', () => {
      const { queryByText } = render(getSplStep());
      const saveButton = queryByText(/Save/);
      expect(saveButton).toBeNull();
    });
    it('cancel button is not rendered', () => {
      const { queryByText } = render(getSplStep());
      const cancelButton = queryByText(/Cancel Project/);
      expect(cancelButton).toBeNull();
    });
    it('form fields are disabled', () => {
      const component = render(getSplStep());
      const textboxes = component.queryAllByRole('textbox');
      textboxes.forEach(textbox => {
        expect(textbox).toBeVisible();
        expect(textbox).toBeDisabled();
      });
    });
  });
  describe('Display when project is cancelled', () => {
    let project: IProject;
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
      project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.Cancelled;
    });
    it('save button is visible and disabled', () => {
      const { queryByText } = render(getSplStep(getStore(project)));
      const saveButton = queryByText(/Save/);
      expect(saveButton).toBeNull();
    });
    it('cancel button is visible and disabled', () => {
      const { queryByText } = render(getSplStep(getStore(project)));
      const cancelButton = queryByText(/Cancel Project/);
      expect(cancelButton).toBeNull();
    });
    it('form fields are disabled', () => {
      const component = render(getSplStep(getStore(project)));
      const textboxes = component.queryAllByRole('textbox');
      textboxes.forEach(textbox => {
        expect(textbox).toBeVisible();
        expect(textbox).toBeDisabled();
      });
    });
  });
  describe('form actions', () => {
    beforeAll(() => {
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });
    it('enables Change status to marketing when date entered', () => {
      const project = _.cloneDeep(mockProject);
      project.marketedOn = new Date();

      const { getByText } = render(getSplStep(getStore(project)));
      const marketingButton = getByText(/Marketing/);
      expect(marketingButton).not.toBeDisabled();
    });
    it('enables change status to contract in place - conditional button when date entered', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.OnMarket;
      project.offerAmount = 12345;
      project.clearanceNotificationSentOn = new Date();

      const { getByText } = render(getSplStep(getStore(project)));
      const contractInPlaceButton = getByText(/Conditional/);
      expect(contractInPlaceButton).not.toBeDisabled();
    });
    it('enables change status to contract in place - unconditional button when date entered', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.OnMarket;
      project.offerAmount = 12345;
      project.clearanceNotificationSentOn = new Date();

      const { getByText } = render(getSplStep(getStore(project)));
      const contractInPlaceButton = getByText(/Unconditional/);
      expect(contractInPlaceButton).not.toBeDisabled();
    });
    it('toggles change status to unconditional when status is contract in place', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.ContractInPlaceConditional;

      const component = render(getSplStep(getStore(project)));
      const preMarketingButton = component.getAllByText(/Unconditional/)[0];
      expect(preMarketingButton).not.toBeDisabled();
    });
    it('displays modal when cancel button clicked', async () => {
      const component = render(getSplStep());
      const cancelButton = component.getByText(/Cancel Project/);
      act(() => {
        cancelButton.click();
      });
      const cancelModel = await screen.findByText(/Really Cancel Project/);
      expect(cancelModel).toBeVisible();
    });
    it('displays modal when proceed to change status to disposed externally button clicked', async () => {
      const project = _.cloneDeep(mockProject);
      project.disposedOn = new Date();
      project.statusCode = ReviewWorkflowStatus.ContractInPlaceConditional;
      project.offerAcceptedOn = new Date();
      project.purchaser = 'purchaser';
      project.offerAmount = 12345;
      project.marketedOn = new Date();
      project.assessed = 123;
      project.market = 123;
      project.netBook = 123;

      const component = render(getSplStep(getStore(project)));
      const disposedButton = component.getAllByText(/Dispose/)[0];
      act(() => {
        disposedButton.click();
      });
      const proceedModal = await screen.findByText(/Really Dispose Project/);
      expect(proceedModal).toBeVisible();
    });
    it('spl performs no validation on save', async () => {
      const project = _.cloneDeep(mockProject);
      project.tasks[0].isOptional = false;

      render(getSplStep(getStore(project)));
      const saveButton = screen.getByText(/Save/);
      act(() => {
        saveButton.click();
      });

      const errorSummary = await screen.queryByText(/The following tabs have errors/);
      expect(errorSummary).toBeNull();
    });
    it('performs validation on dispose', async () => {
      const project = _.cloneDeep(mockProject);
      project.disposedOn = undefined;
      project.marketedOn = undefined;
      project.statusCode = ReviewWorkflowStatus.ContractInPlaceConditional;

      const component = render(getSplStep(getStore(project)));

      const disposeButton = component.getAllByText(/^Dispose$/)[0];
      act(() => {
        disposeButton.click();
      });

      await screen.findByText('Really Dispose Project?');
      const disposeProjectButton = component.getAllByText(/^Dispose Project$/)[0];
      act(() => {
        disposeProjectButton.click();
      });

      const errorSummary = await screen.findByText(/The form has errors/);
      expect(errorSummary).toBeVisible();
    });
    it('spl filters agency responses on save', async () => {
      const project = _.cloneDeep(mockProject);
      project.projectAgencyResponses = [
        {
          projectId: project.id ?? 1,
          agencyId: project.agencyId,
          response: AgencyResponses.Unsubscribe,
        },
      ];

      const { findByDisplayValue } = render(getSplStep(getStore(project)));
      const saveButton = screen.getByText(/Save/);
      mockAxios
        .onPut()
        .reply(200, { properties: [], purchaser: 'purchaser' })
        .onAny()
        .reply(200, { properties: [], purchaser: 'purchaser' });

      act(() => {
        saveButton.click();
      });
      await wait(async () => {
        expect(await findByDisplayValue('purchaser')).toBeVisible();
      });
    });

    it('spl disposes project', async () => {
      const project = _.cloneDeep(mockProject);
      project.disposedOn = new Date();
      project.statusCode = ReviewWorkflowStatus.ContractInPlaceConditional;
      project.assessed = 123;
      project.market = 123;
      project.netBook = 123;
      project.properties = [];

      await wait(async () => {
        const component = render(getSplStep(getStore(project)));
        const disposeButton = component.getAllByText('Dispose')[0];

        disposeButton.click();
        const disposePopupButton = await component.findAllByText(/Dispose Project/);
        disposePopupButton[1].click();
        expect(mockAxios.history.put).toHaveLength(1);
      });
    });

    it('spl disposes project with subdivisions', async () => {
      const project = _.cloneDeep(mockFlatProject as any);
      project.disposedOn = new Date();
      project.statusCode = ReviewWorkflowStatus.ContractInPlaceConditional;
      project.assessed = 123;
      project.market = 123;
      project.netBook = 123;
      project.properties[0].propertyTypeId = PropertyTypes.SUBDIVISION;
      project.properties[0].parcels = [{ id: 1, pid: '123456789', pin: 1 }];

      const component = render(getSplStep(getStore(project)));
      const disposeButton = component.getAllByText('Dispose')[0];

      await act(async () => {
        disposeButton.click();
        await component.findAllByText(/Are you sure you want to complete this disposal project?/);
        expect(await screen.findByText('PID 123-456-789')).toBeVisible();
      });
    });
  });

  describe('close out form tab', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      cleanup();
      mockKeycloak([Claims.ADMIN_PROJECTS]);
    });
    afterEach(() => {
      mockAxios.reset();
    });
    const store = getStore(mockProject, SPPApprovalTabs.closeOutForm);
    it('renders correctly', () => {
      const { container } = render(getSplStep(store));
      expect(container.firstChild).toMatchSnapshot();
    });

    it('displays close out form tab by default if project disposed', () => {
      const project = _.cloneDeep(mockProject);
      project.statusCode = ReviewWorkflowStatus.Disposed;
      const { getByText } = render(getSplStep(getStore(project)));
      expect(getByText('Financial Summary')).toBeVisible();
    });

    it('displays close out notes', () => {
      const { getByText } = render(getSplStep(store));
      expect(getByText('Adjustment to Prior Year Sale Notes')).toBeVisible();
      expect(getByText('Project Comments')).toBeVisible();
      expect(getByText('OCG Variance Notes')).toBeVisible();
    });
  });
});
