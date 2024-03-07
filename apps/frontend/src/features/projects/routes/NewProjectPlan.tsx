import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useNavigate, useParams } from '@solidjs/router';
import PlanForm, { ProjectPlanForm } from '../components/PlanForm';
import { useProjectPlansMutation } from '../api';

const NewProjectPlan = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { create } = useProjectPlansMutation(params.id);

  const handleClose = (open: boolean) => {
    if (!open) {
      navigate('../..');
    }
  };

  const handleSubmit = async (values: ProjectPlanForm) => {
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
        <DialogTitle>New project plan</DialogTitle>
        <PlanForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectPlan;
