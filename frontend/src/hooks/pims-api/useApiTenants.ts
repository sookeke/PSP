import React from 'react';

import { IApiTenants, ITenantConfig, useApi } from '.';

/**
 * PIMS API wrapper to centralize all AJAX requests to the tenants endpoints.
 * @returns Object containing functions to make requests to the PIMS API.
 */
export const useApiTenants = () => {
  const api = useApi();

  return React.useMemo(
    () =>
      ({
        getSettings: () => api.get<ITenantConfig>('tenants'),
      } as IApiTenants),
    [api],
  );
};
