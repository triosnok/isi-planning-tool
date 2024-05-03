import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTranslations } from '@/features/i18n';
import { Component, Show } from 'solid-js';
import {
  UpdateProjectPlanSchemaValues,
  usePlanDetailsQuery,
  useProjectPlansMutation,
} from '../api';
import PlanForm from './PlanForm';

export interface UpdateProjectPlanDialogProps {
  planId: string;
  onOpenChange: (open: boolean) => void;
}

const UpdateProjectPlanDialog: Component<UpdateProjectPlanDialogProps> = (
  props
) => {
  const { t } = useTranslations();
  const plan = usePlanDetailsQuery(props.planId);
  const projectPlans = useProjectPlansMutation(props.planId);

  const handleSubmit = async (values: UpdateProjectPlanSchemaValues) => {
    try {
      await projectPlans.update.mutateAsync(values);
      props.onOpenChange(false);
    } catch (error) {
      // ignore for now
    }
  };

  return (
    <Show when={plan.data}>
      <Dialog open={true} onOpenChange={props.onOpenChange}>
        <DialogContent>
          <DialogTitle>{t('PLANS.EDIT_PROJECT_PLAN')}</DialogTitle>
          <PlanForm
            planId={plan.data?.id}
            importUrl={plan.data?.imports[0].url}
            startsAt={plan.data?.startsAt}
            endsAt={plan.data?.endsAt}
            vehicleId={plan.data?.vehicleId ?? undefined}
            imports={plan.data?.imports}
            onSubmit={handleSubmit}
            editing
            isLoading={projectPlans.update.isPending}
          />
        </DialogContent>
      </Dialog>
    </Show>
  );
};

export default UpdateProjectPlanDialog;
