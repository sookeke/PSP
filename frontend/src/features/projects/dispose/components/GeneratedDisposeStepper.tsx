import Stepper from 'components/common/Stepper';
import { IStatus } from 'features/projects/common';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';

import { useStepper } from '..';

interface GeneratedDisposeStepperProps {
  activeStep: number;
  basePath: string;
}

/**
 * Generate workflow steps from the workflow statuses
 * @param param0 GeneratedDisposeStepperProps
 */
const GeneratedDisposeStepper = ({ activeStep, basePath }: GeneratedDisposeStepperProps) => {
  const workflowStatuses = useAppSelector(state => state.projectWorkflow as any);
  const { projectStatusCompleted, canGoToStatus, project } = useStepper();
  const history = useHistory();
  const steps = workflowStatuses
    .filter((i: { isOptional: any }) => !i.isOptional)
    .map((wfs: IStatus | undefined) => ({
      title: wfs?.name,
      route: `${basePath}${wfs?.route}?projectNumber=${project.projectNumber}`,
      completed: projectStatusCompleted(wfs),
      canGoToStep: canGoToStatus(wfs),
    }));
  return (
    <Stepper
      onChange={step => history.push(step.route)}
      activeStep={activeStep}
      steps={steps}
      activeStepMessage="Complete this form to apply to the Enhanced Referral Process or Request Exemption"
    ></Stepper>
  );
};

export default GeneratedDisposeStepper;
