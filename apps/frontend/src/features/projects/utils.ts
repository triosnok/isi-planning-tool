import { useSearchParams } from '@solidjs/router';

export const useProjectSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams<{
    plans: string;
    hideCompleted: string;
  }>();

  const selectedPlans = () => {
    const plans = searchParams.plans;
    return plans?.split(',') ?? [];
  };

  const setSelectedPlans = (plans: string[]) => {
    setSearchParams({ plans: plans.join(',') });
  };

  const hideCompleted = () => searchParams.hideCompleted === 'true';

  const setHideCompleted = (hideCompleted: boolean) => {
    setSearchParams({ hideCompleted: hideCompleted.toString() });
  };

  return { selectedPlans, setSelectedPlans, hideCompleted, setHideCompleted };
};
