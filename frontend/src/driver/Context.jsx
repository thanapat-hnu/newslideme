import { createContext, useState } from 'react';

export const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [personalData, setPersonalData] = useState({
    firstName: "A321",
    lastName: "B321",
    idCardNumber: "1231231234111",
    birthDate: "1990-01-01",
    phoneNumber: "0123456321",
    email: "e321@e.com",
    idCardImage: null
  });

  const [vehicleData, setVehicleData] = useState({
    personalId: 2,
    licenseType: "ใบขับขี่รถยนต์",
    licenseNumber: "1231231234",
    licenseExpiryDate: "2026-12-31",
    licenseImage: null,
    vehicleType: "รถยนต์",
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