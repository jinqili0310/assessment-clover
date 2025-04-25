import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
} from '@mui/material';
import ChameleonInput from './ChameleonInput';

// define a set of formatting and validation examples
const examples = [
  {
    id: 'phone',
    name: 'Phone Number',
    formatPatterns: [
      {
        pattern: /^\d+$/,
        format: (value: string) => {
          // format as (xxx) xxx-xxxx
          const digits = value.replace(/\D/g, '').slice(0, 10);
          console.log('Phone format - raw digits:', digits, 'length:', digits.length);
          
          if (digits.length === 0) return '';
          if (digits.length <= 3) return digits;
          if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
          
          // add the dash after position 6
          const formattedNumber = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
          console.log('Phone format - formatted output:', formattedNumber);
          return formattedNumber;
        }
      }
    ],
    validationRules: [
      {
        test: (value: string) => value.replace(/\D/g, '').length === 0 || value.replace(/\D/g, '').length === 10,
        message: 'Phone number must be 10 digits'
      }
    ],
    placeholder: 'Enter phone number'
  },
  {
    id: 'email',
    name: 'Email Address',
    formatPatterns: [
      {
        // no formatting for email, just pass through
        pattern: /.*/,
        format: (value: string) => value
      }
    ],
    validationRules: [
      {
        test: (value: string) => {
          if (value.length === 0) return true;
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(value);
        },
        message: 'Please enter a valid email address'
      }
    ],
    placeholder: 'user@example.com'
  },
  {
    id: 'zipCode',
    name: 'US ZIP Code',
    formatPatterns: [
      {
        pattern: /^\d+$/,
        format: (value: string) => {
          const digits = value.replace(/\D/g, '').slice(0, 9);
          if (digits.length <= 5) return digits;
          return `${digits.slice(0, 5)}-${digits.slice(5)}`;
        }
      }
    ],
    validationRules: [
      {
        test: (value: string) => {
          const digits = value.replace(/\D/g, '');
          return digits.length === 0 || digits.length === 5 || digits.length === 9;
        },
        message: 'ZIP code must be 5 or 9 digits'
      }
    ],
    placeholder: '12345 or 12345-6789'
  },
  {
    id: 'date',
    name: 'Date (MM/DD/YYYY)',
    formatPatterns: [
      {
        pattern: /^\d+$/,
        format: (value: string) => {
          // format as mm/dd/yyyy
          const digits = value.replace(/\D/g, '').slice(0, 8);
          if (digits.length === 0) return '';
          if (digits.length <= 2) return digits;
          if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
          return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
        }
      }
    ],
    validationRules: [
      {
        test: (value: string) => {
          if (value.replace(/\D/g, '').length === 0) return true;
          if (value.replace(/\D/g, '').length !== 8) return false;
          
          const digits = value.replace(/\D/g, '');
          const month = parseInt(digits.slice(0, 2));
          const day = parseInt(digits.slice(2, 4));
          const year = parseInt(digits.slice(4, 8));
          
          // check month and day validity
          if (month < 1 || month > 12) return false;
          if (day < 1 || day > 31) return false;
          
          // check days in month
          if ([4, 6, 9, 11].includes(month) && day > 30) return false;
          if (month === 2) {
            const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
            if (day > (isLeapYear ? 29 : 28)) return false;
          }
          
          // make sure date isn't in the future
          const inputDate = new Date(year, month - 1, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);  // set to midnight for fair comparison
          
          if (inputDate > today) return false;
          
          return true;
        },
        message: 'Invalid date or date is in the future'
      }
    ],
    placeholder: 'MM/DD/YYYY'
  },
  {
    id: 'currency',
    name: 'Currency',
    formatPatterns: [
      {
        pattern: /^[\d.,$]+$/,
        format: (value: string) => {
          // remove non-digit chars except decimal point
          const cleanValue = value.replace(/[^\d.]/g, '');
          
          // ensure only one decimal point
          const parts = cleanValue.split('.');
          let formatted = parts[0];
          if (parts.length > 1) {
            formatted += '.' + parts.slice(1).join('').slice(0, 2);
          }
          
          // add commas for thousands
          const withCommas = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          
          // add dollar sign
          return '$' + (withCommas || '0');
        }
      }
    ],
    validationRules: [
      {
        test: (value: string) => {
          const numValue = parseFloat(value.replace(/[^\d.]/g, ''));
          return !isNaN(numValue) && numValue >= 0;
        },
        message: 'Invalid currency amount'
      }
    ],
    placeholder: 'Enter amount'
  }
];

const InputValidation: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(examples[0]);
  
  const handleExampleChange = (exampleId: string) => {
    const example = examples.find(ex => ex.id === exampleId);
    if (example) {
      setSelectedExample(example);
    }
  };

  return (
    <Box className="p-4 max-w-2xl mx-auto">
      <Typography variant="h4" className="mb-4 pb-12 text-center">
        Chameleon Input Validation
      </Typography>
      
      <Card className="mb-6">
        <CardContent>
          <Typography variant="h6" className="mb-4" style={{marginBottom: '12px'}}>
            Select Format Type
          </Typography>
          
          <FormControl fullWidth className="mb-6" style={{marginBottom: '12px'}}>
            <InputLabel id="format-select-label">Format</InputLabel>
            <Select
              labelId="format-select-label"
              value={selectedExample.id}
              label="Format"
              onChange={(e) => handleExampleChange(e.target.value)}
            >
              {examples.map(example => (
                <MenuItem key={example.id} value={example.id}>
                  {example.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="h6" className="mb-2" style={{marginBottom: '12px'}}>
            {selectedExample.name} Input
          </Typography>
          
          <ChameleonInput
            label={selectedExample.name}
            formatPatterns={selectedExample.formatPatterns}
            validationRules={selectedExample.validationRules}
            placeholder={selectedExample.placeholder}
            formatTypeId={selectedExample.id}
            fullWidth
            className="mb-4"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default InputValidation; 