import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { FormValues, SignUpForm } from "./types";

interface FormValuesType {
  formValues: SignUpForm;
  updateFormValues: (values: FormValues) => void;
}

const SignUpFormContext = createContext<FormValuesType | null>(null);

const defaultValues: SignUpForm = {
  accessCode: "",
  email: "",
  fullname: "",
  companyName: "",
  companyWebsite: "",
};

export const SignUpFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formValues, setFormValues] = useState<SignUpForm>(defaultValues);

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
    <SignUpFormContext.Provider value={values}>
      {children}
    </SignUpFormContext.Provider>
  );
};

export const useSignUpFormContext = () => {
  const context = useContext(SignUpFormContext);

  if (context === null) {
    throw new Error("SignUp context must be used within the context provider");
  }

  return context;
};
