import { LOOKUP_CODE } from './../../../constants/reducerTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILookupCodeState, ILookupCode } from '.';

export const initialState: ILookupCodeState = {
  lookupCodes: [],
};
/**
 * The lookup code reducer stores the complete list of lookup codes used within the application.
 */
export const lookupCodesSlice = createSlice({
  name: LOOKUP_CODE,
  initialState: initialState,
  reducers: {
    storeLookupCodes(state: ILookupCodeState, action: PayloadAction<ILookupCode[]>) {
      state.lookupCodes = action.payload;
    },
  },
});

// Destructure and export the plain action creators
export const { storeLookupCodes } = lookupCodesSlice.actions;