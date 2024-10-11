"use client";

import type { FormValues, LoginForm } from "@mott/validators";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface FormValuesType {
  formValues: LoginForm;
  updateFormValues: (values: FormValues) => void;
}

const LoginFormContext = createContext<FormValuesType | null>(null);

const defaultValues: LoginForm = {
  accessCode: "",
  email: "",
  fullName: "",
  companyName: "",
  companyWebsite: "",
};

export const LoginFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formValues, setFormValues] = useState<LoginForm>(defaultValues);

  const updateFormValues = useCallback((updatedData: FormValues) => {
    setFormValues((prevData) => ({ ...prevData, ...updatedData }));
  }, []);

  const values = useMemo(() => {
    return {
      formValues,
      updateFormValues,
    };
  }, [formValues, updateFormValues]);

  return (
    <LoginFormContext.Provider value={values}>
      {children}
    </LoginFormContext.Provider>
  );
};

export const useLoginFormContext = () => {
  const context = useContext(LoginFormContext);

  if (context === null) {
    throw new Error(
      "LoginForm context must be used within the context provider",
    );
  }

  return context;
};
