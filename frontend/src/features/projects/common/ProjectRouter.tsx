import Claims from 'constants/claims';
import { FormikValues } from 'formik';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import queryString from 'query-string';
import { useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Redirect, Switch, useHistory } from 'react-router-dom';
import { match as Match } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector } from 'store/hooks';
import AppRoute from 'utils/AppRoute';
import PrivateRoute from 'utils/PrivateRoute';

import { ReviewApproveStep } from '../assess';
import {
  ApprovalTransitionPage,
  clearProject,
  fetchProject,
  fetchProjectWorkflow,
  IProject,
  ProjectSummaryView,
  SelectProjectPropertiesPage,
  useProject,
} from '../common';
import { ReviewWorkflowStatus } from '../common';
import { ErpStep, GreTransferStep as ErpToGre } from '../erp';
import { GreTransferStep as SplToGre, SplStep } from '../spl';
import ProjectLayout from './ProjectLayout';
import { ProjectActions } from './slices/projectActions';

/**
 * Top level component ensures proper context provided to child assessment form pages.
 * @param param0 default react router props
 */
const ProjectRouter = ({ location }: { match: Match; location: Location }) => {
  const query = location?.search ?? {};
  const history = useHistory();
  const keycloak = useKeycloakWrapper();
  const formikRef = useRef<FormikValues>();
  const projectNumber = queryString.parse(query).projectNumber;
  const { project } = useProject();
  const dispatch = useDispatch();
  const getProjectRequest = useAppSelector(
    state => state.network[ProjectActions.GET_PROJECT_WORKFLOW] as any,
  );
  useEffect(() => {
    if (projectNumber !== null && projectNumber !== undefined) {
      dispatch(clearProject());
      (dispatch(fetchProject(projectNumber as string)) as any)
        .then((project: IProject) => {
          dispatch(fetchProjectWorkflow(project?.workflowCode));
        })
        .catch(() => {
          toast.error('Failed to load project, returning to project list.');
          history.replace('/projects/list');
        });
    }
  }, [dispatch, history, projectNumber]);

  //if the user is routed to /projects, determine the correct subroute to send them to by loading the project.
  useDeepCompareEffect(() => {
    if (project.projectNumber === projectNumber && location.pathname === '/projects') {
      const ReviewWorkflowStatuses = Object.keys(ReviewWorkflowStatus).map(
        (k: string) => (ReviewWorkflowStatus as any)[k],
      );
      if (ReviewWorkflowStatuses.includes(project.statusCode)) {
        if (keycloak.hasClaim(Claims.ADMIN_PROJECTS)) {
          history.replace(`${project.status?.route}?projectNumber=${project.projectNumber}`);
        } else {
          history.replace(`/projects/summary?projectNumber=${project.projectNumber}`);
        }
      } else {
        history.replace(`/dispose${project.status?.route}?projectNumber=${project.projectNumber}`);
      }
    }
  }, [project]);

  if (projectNumber !== null && projectNumber !== undefined && getProjectRequest?.error) {
    throw Error(`Unable to load project number ${projectNumber}`);
  }
  return (
    <>
      {getProjectRequest?.isFetching === false && projectNumber === project.projectNumber ? (
        <Switch>
          {/*TODO: this will probably need to be update to a map of routes/components as well.*/}
          <PrivateRoute
            layout={ProjectLayout}
            claim={[Claims.ADMIN_PROJECTS, Claims.DISPOSE_APPROVE]}
            path="/projects/assess/properties/update"
            component={SelectProjectPropertiesPage}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={[Claims.ADMIN_PROJECTS, Claims.DISPOSE_APPROVE]}
            exact
            path="/projects/assess/properties"
            component={ReviewApproveStep}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={Claims.ADMIN_PROJECTS}
            path="/projects/erp/gretransfer"
            component={ErpToGre}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={Claims.ADMIN_PROJECTS}
            path="/projects/spl/gretransfer"
            component={SplToGre}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={Claims.ADMIN_PROJECTS}
            path={['/projects/approved']}
            component={ApprovalTransitionPage}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={Claims.ADMIN_PROJECTS}
            path={['/projects/onHold', '/projects/erp']}
            component={ErpStep}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={Claims.ADMIN_PROJECTS}
            path={[
              '/projects/premarketing',
              '/projects/marketing',
              '/projects/contractinplace',
              '/projects/disposed',
            ]}
            component={SplStep}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={Claims.PROJECT_VIEW}
            path={[
              '/projects/summary',
              '/projects/transferred',
              '/projects/denied',
              '/projects/cancelled',
              '/projects/premarketing',
              '/projects/marketing',
              '/projects/contractinplace',
              '/projects/disposed',
            ]}
            component={ProjectSummaryView}
            componentProps={{ formikRef }}
          />
          {/** Due to the use of dynamic routes within the project workflows, manually redirect to not found if no valid /projects route exists */}
          <AppRoute
            title="*"
            path="/projects/*"
            component={() => <Redirect to="/page-not-found" />}
          />
        </Switch>
      ) : (
        <Container fluid style={{ textAlign: 'center' }}>
          <Spinner animation="border"></Spinner>
        </Container>
      )}
    </>
  );
};

export default ProjectRouter;
