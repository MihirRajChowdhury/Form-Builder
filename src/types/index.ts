export type FieldType = 
  | 'text' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'custom';
  value?: string | number;
  message: string;
  enabled: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  validationRules: ValidationRule[];
  isDerived: boolean;
  parentFields?: string[];
  derivedFormula?: string;
  derivedType?: 'calculation' | 'concatenation' | 'conditional';
  options?: SelectOption[];
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormBuilderState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
  isPreviewMode: boolean;
}

export interface FormValues {
  [fieldId: string]: any;
}

export interface FormErrors {
  [fieldId: string]: string[];
}

export interface FormSubmissionResult {
  success: boolean;
  values: FormValues;
}
