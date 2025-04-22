import { createContext, useState } from "react";

export const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [personalData, setPersonalData] = useState({
    firstName: "admin",
    lastName: "admin",
    idCardNumber: "1234567890123",
    birthDate: "1990-01-01",
    phoneNumber: "1234567890",
    email: "admin@admin.com",
    idCardImage: null,
  });

  const [vehicleData, setVehicleData] = useState({
    personalId: null,
    licenseType: "ใบขับขี่รถยนต์",
    licenseNumber: "1234567890123",
    licenseExpiryDate: "2026-12-31",
    licenseImage: null,
    vehicleType: "รถยนต์",
    vehicleBrand: "Toyota",
    vehicleModel: "Vios",
    plateNumber: "1admin",
    vehicleImage: null,
    plateImage: null,
  });

  const [location, setLocation] = useState({
    lonA: 0,
    latA: 0,
    lonB: 0,
    latB: 0,
  });

  const [status, setStatus] = useState("");

  const [order, setOrder] = useState({
    destination: "",
    order_datetime: "",
    order_id: "",
    origin: "",
    phone: "",
    price: "",
    shop_name: "",
    vehicle_type: "",
  });

  const [description, setDescription] = useState({
    descriptionA: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    descriptionB: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  });

  return (
    <RegistrationContext.Provider
      value={{
        personalData,
        setPersonalData,
        vehicleData,
        setVehicleData,
        location,
        setLocation,
        status,
        setStatus,
        description,
        setDescription,
        order,
        setOrder,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}
