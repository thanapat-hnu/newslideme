import { createContext, useState } from 'react';

export const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [personalData, setPersonalData] = useState({
    firstName: "A",
    lastName: "B",
    idCardNumber: "1234567890123",
    birthDate: "1990-01-01",
    phoneNumber: "0123456789",
    email: "e@e.com",
    address: "address",
    idCardImage: null
  });

  const [vehicleData, setVehicleData] = useState({
    licenseType: "Type A",
    licenseNumber: "ABC123456",
    licenseExpiryDate: "2026-12-31",
    licenseImage: null,
    vehicleType: "Car",
    vehicleBrand: "Toyota",
    vehicleModel: "Vios",
    plateNumber: "1กก1234",
    vehicleImage: null,
    plateImage: null
  });

  return (
    <RegistrationContext.Provider 
      value={{ 
        personalData, 
        setPersonalData, 
        vehicleData, 
        setVehicleData 
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}