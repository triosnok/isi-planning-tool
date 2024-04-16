import { VehicleDetails } from '@isi-insight/client';
import {
  Component,
  JSX,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from 'solid-js';

const VEHICLE_LOCALSTORAGE_KEY = 'selected-vehicle';

interface VehicleContextValue {
  selectedVehicle: () => VehicleDetails | undefined;
  setSelectedVehicle: (vehicle: VehicleDetails | undefined) => void;
}

const VehicleContext = createContext<VehicleContextValue>();

export const VehicleProvider: Component<{ children: JSX.Element }> = (props: {
  children: JSX.Element;
}) => {
  const [selectedVehicle, setSelectedVehicle] = createSignal<
    VehicleDetails | undefined
  >(JSON.parse(localStorage.getItem(VEHICLE_LOCALSTORAGE_KEY) || 'null'));

  createEffect(() => {
    const vehicle = selectedVehicle();
    localStorage.setItem(VEHICLE_LOCALSTORAGE_KEY, JSON.stringify(vehicle));
  });

  return (
    <VehicleContext.Provider value={{ selectedVehicle, setSelectedVehicle }}>
      {props.children}
    </VehicleContext.Provider>
  );
};

export const vehiclePreference = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
