import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import PlanForm from '../components/PlanForm';

const EditProjectPlan: Component = () => {
  const navigate = useNavigate();

  const handleClose = (open: boolean) => {
    if (!open) {
      navigate('../..');
    }
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <PlanForm />
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectPlan;
