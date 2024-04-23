import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Component, Show, createEffect } from 'solid-js';
import {
  ProjectPlanSchemaValues,
  usePlanDetailsQuery,
  useProjectPlansMutation,
} from '../api';
import PlanForm from './PlanForm';
import { useTranslations } from '@/features/i18n';

export interface UpdateProjectPlanDialogProps {
  planId: string;
  onOpenChange: (open: boolean) => void;
}

const UpdateProjectPlanDialog: Component<UpdateProjectPlanDialogProps> = (
  props
) => {
  const { t } = useTranslations();
  const plan = usePlanDetailsQuery(props.planId);
  const { update } = useProjectPlansMutation(props.planId);

  const handleSubmit = async (values: ProjectPlanSchemaValues) => {
    try {
      await update.mutateAsync(values);
      props.onOpenChange(false);
    } catch (error) {
      // ignore for now
    }
  };

  createEffect(() => {
    console.log(plan.data?.startsAt);
  });

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
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </Show>
  );
};

export default UpdateProjectPlanDialog;
