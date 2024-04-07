import { useSearchParams } from '@solidjs/router';

export const useSelectedPlans = () => {
  const [searchParams, setSearchParams] = useSearchParams<{ plans: string }>();

  const selectedPlans = () => {
    const plans = searchParams.plans;
    return plans?.split(',') ?? [];
  };

  const setSelectedPlans = (plans: string[]) => {
    setSearchParams({ plans: plans.join(',') });
  };

  return [selectedPlans, setSelectedPlans] as const;
};
