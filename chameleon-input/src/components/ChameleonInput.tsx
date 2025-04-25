import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  TextFieldProps, 
  Box, 
  FormHelperText 
} from '@mui/material';

// define possible format patterns
type FormatPattern = {
  pattern: RegExp;
  format: (value: string) => string;
}

// define input validation rule
type ValidationRule = {
  test: (value: string) => boolean;
  message: string;
}

interface ChameleonInputProps extends Omit<TextFieldProps, 'onChange'> {
  formatPatterns?: FormatPattern[];
  validationRules?: ValidationRule[];
  onChange?: (value: string) => void;
  formatTypeId?: string;
}

const ChameleonInput: React.FC<ChameleonInputProps> = ({
  formatPatterns = [],
  validationRules = [],
  onChange,
  formatTypeId = 'default',
  ...textFieldProps
}) => {
  const [inputValue, setInputValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setInputValue('');
    setFormattedValue('');
    setError(null);
  }, [formatTypeId]);
  
  // format the input based on patterns
  const formatInput = (value: string): string => {
    let formatted = value;
    
    // try each format pattern until one matches
    for (const { pattern, format } of formatPatterns) {
      if (pattern.test(value)) {
        const result = format(value);
        console.log('Format applied:', { value, result });
        formatted = result;
        break;
      }
    }
    
    return formatted;
  };
  
  // validate the input
  const validateInput = (value: string): string | null => {
    for (const { test, message } of validationRules) {
      if (!test(value)) {
        return message;
      }
    }
    return null;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Input change:', newValue);
    
    // special handling for phone numbers
    if (formatTypeId === 'phone') {
      const digitsOnly = newValue.replace(/\D/g, '');
      setInputValue(digitsOnly);
      
      // format with digits only
      const newFormattedValue = formatInput(digitsOnly);
      console.log('Formatted value (phone):', newFormattedValue);
      setFormattedValue(newFormattedValue);
      
      // validate with digits only
      const validationError = validateInput(digitsOnly);
      setError(validationError);
      
      // call parent's onChange with raw value
      if (onChange) {
        onChange(digitsOnly);
      }
    } else {
      // handle other formats normally
      setInputValue(newValue);
      
      // format the input
      const newFormattedValue = formatInput(newValue);
      console.log('Formatted value:', newFormattedValue);
      setFormattedValue(newFormattedValue);
      
      // validate the input
      const validationError = validateInput(newValue);
      setError(validationError);
      
      // call parent's onChange with raw value
      if (onChange) {
        onChange(newValue);
      }
    }
  };
  
  return (
    <Box>
      <TextField
        {...textFieldProps}
        value={formattedValue}
        onChange={handleChange}
        error={!!error}
        className={`${textFieldProps.className || ''}`}
        key={formatTypeId}
      />
      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Box>
  );
};

export default ChameleonInput; 