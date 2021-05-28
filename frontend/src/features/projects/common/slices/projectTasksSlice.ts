import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IProjectTask } from '..';

export const saveProjectTasks = createAction<IProjectTask[]>('saveProjectTasks');
export const clearProjectTasks = createAction('clearProjectTasks');
/**
 * Slice to handle storage of project disposal tasks.
 */
const projectTasksSlice = createSlice({
  name: 'projectTasks',
  initialState: [] as IProjectTask[],
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(
      saveProjectTasks,
      (state: IProjectTask[], action: PayloadAction<IProjectTask[]>) => {
        return action.payload;
      },
    );
    builder.addCase(clearProjectTasks, (state: IProjectTask[]) => {
      return '';
    });
  },
});

export default projectTasksSlice;
