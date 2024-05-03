import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTranslations } from '@/features/i18n';
import { useNavigate, useParams } from '@solidjs/router';
import { CreateProjectPlanSchemaValues, useProjectPlansMutation } from '../api';
import PlanForm from '../components/PlanForm';

const NewProjectPlan = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectPlans = useProjectPlansMutation(params.id);
  const { t } = useTranslations();

  const handleClose = (open: boolean) => {
    if (!open) {
      navigate('../..');
    }
  };

  const handleSubmit = async (values: CreateProjectPlanSchemaValues) => {
    try {
      await projectPlans.create.mutateAsync(values);
      navigate('../..');
    } catch (error) {
      // ignore for now
    }
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{t('PLANS.NEW_PROJECT_PLAN')}</DialogTitle>
        <PlanForm
          isError={projectPlans.create.isError}
          isLoading={projectPlans.create.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectPlan;
