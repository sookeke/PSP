import './ProjectDisposeView.scss';

import queryString from 'query-string';
import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { match as Match } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';

import { clearProject, fetchProject } from '../common';
import { ProjectActions } from '../common/slices/projectActions';
import { StepContextProvider } from '.';
import ProjectDisposeLayout from './ProjectDisposeLayout';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeView = ({ match, location }: { match: Match; location: Location }) => {
  const query = location?.search ?? {};
  const projectNumber = queryString.parse(query).projectNumber;
  const dispatch = useDispatch();
  const getProjectRequest = useAppSelector(
    state => state.network[ProjectActions.GET_PROJECT] as any,
  );
  useEffect(() => {
    if (projectNumber !== null && projectNumber !== undefined) {
      dispatch(clearProject());
      dispatch(fetchProject(projectNumber as string));
    }
  }, [dispatch, projectNumber]);

  if (projectNumber !== null && projectNumber !== undefined && getProjectRequest?.error) {
    throw Error(`Unable to load project number ${projectNumber}`);
  }
  return (
    <StepContextProvider>
      <Container fluid className="ProjectDisposeView">
        <ProjectDisposeLayout {...{ match, location }}></ProjectDisposeLayout>
      </Container>
    </StepContextProvider>
  );
};

export default ProjectDisposeView;
