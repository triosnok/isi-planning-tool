import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useNavigate, useParams } from '@solidjs/router';
import PlanForm from '../components/PlanForm';
import { ProjectPlanSchemaValues, useProjectPlansMutation } from '../api';
import { useTranslations } from '@/features/i18n';

const NewProjectPlan = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { create } = useProjectPlansMutation(params.id);
  const { t } = useTranslations();

  const handleClose = (open: boolean) => {
    if (!open) {
      navigate('../..');
    }
  };

  const handleSubmit = async (values: ProjectPlanSchemaValues) => {
    try {
      await create.mutateAsync(values);
      navigate('../..');
    } catch (error) {
      // ignore for now
    }
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{t('PLANS.NEW_PROJECT_PLAN')}</DialogTitle>
        <PlanForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectPlan;
