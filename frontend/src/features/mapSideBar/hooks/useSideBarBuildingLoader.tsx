import { useAsyncError } from 'hooks/useAsyncError';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { IBuilding } from 'interfaces';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useProperties } from 'store/slices/properties/useProperties';

import { SidebarContextType } from './useQueryParamSideBar';

interface IUseSideBarBuildingLoader {
  /** whether or not the sidebar should be displayed */
  showSideBar: boolean;
  /** set the active context of the side bar */
  setSideBarContext: (context: SidebarContextType) => void;
  /** The active context of the side bar */
  sideBarContext: SidebarContextType;
  /** the buildingid specified as a url query param, indicates which parcel to display in the side bar. */
  buildingId?: number;
  /** the edit state of the property in the side bar. */
  disabled?: boolean;
}

/** hook used to load building details for the side bar, and to set the relevant side bar context based on the loaded data. */
const useSideBarBuildingLoader = ({
  showSideBar,
  sideBarContext,
  setSideBarContext,
  buildingId,
  disabled,
}: IUseSideBarBuildingLoader) => {
  const [cachedBuildingDetail, setCachedBuildingDetail] = React.useState<IBuilding | null>(null);
  const dispatch = useDispatch();
  const throwError = useAsyncError();
  const { fetchBuildingDetail } = useProperties();

  useDeepCompareEffect(() => {
    const loadBuilding = async () => {
      setSideBarContext(SidebarContextType.LOADING);
      try {
        const response: IBuilding = await fetchBuildingDetail(buildingId as number);
        setCachedBuildingDetail({
          ...response,
        });
      } catch (err) {
        throwError(err);
      }
      setSideBarContext(
        disabled ? SidebarContextType.VIEW_BUILDING : SidebarContextType.UPDATE_BUILDING,
      );
    };
    if (showSideBar && !!buildingId && buildingId !== cachedBuildingDetail?.id) {
      loadBuilding();
    } else if (!buildingId && !!cachedBuildingDetail) {
      setCachedBuildingDetail(null);
    }
  }, [dispatch, buildingId, disabled, showSideBar]);

  /**
   * Handle the user swapping between view and update of the same property.
   */
  useDeepCompareEffect(() => {
    if (!!buildingId && cachedBuildingDetail?.id === buildingId) {
      if (
        [SidebarContextType.VIEW_BUILDING, SidebarContextType.UPDATE_BUILDING].includes(
          sideBarContext,
        )
      ) {
        const newContext = disabled
          ? SidebarContextType.VIEW_BUILDING
          : SidebarContextType.UPDATE_BUILDING;
        newContext !== sideBarContext && setSideBarContext(newContext);
      }
    } else if (!!cachedBuildingDetail && !cachedBuildingDetail?.id) {
      setSideBarContext(SidebarContextType.ADD_BUILDING);
    }
  }, [buildingId, cachedBuildingDetail, disabled, sideBarContext]);

  return {
    buildingDetail: cachedBuildingDetail,
  };
};

export default useSideBarBuildingLoader;
