import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { IENotSupportedPage } from './IENotSupportedPage';
import { cleanup } from '@testing-library/react';
import { ADD_ACTIVATE_USER } from 'constants/actionTypes';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import renderer from 'react-test-renderer';
import { TenantProvider } from 'tenants';
import { networkSlice } from 'store/slices/network/networkSlice';

jest.mock('axios');
jest.mock('@react-keycloak/web');
const mockStore = configureMockStore([thunk]);

const store = mockStore({
  [networkSlice.name]: {
    [ADD_ACTIVATE_USER]: {},
  },
});

describe('login error page', () => {
  afterEach(() => {
    cleanup();
  });
  it('login error page renders correctly', () => {
    process.env.REACT_APP_TENANT = 'MOTI';
    const history = createMemoryHistory();
    const tree = renderer
      .create(
        <TenantProvider>
          <Provider store={store}>
            <Router history={history}>
              <IENotSupportedPage></IENotSupportedPage>
            </Router>
          </Provider>
        </TenantProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
