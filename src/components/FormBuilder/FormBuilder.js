import React from 'react';
import { TextField, MenuItem, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';

const FormBuilder = ({ fields, values, onChange }) => {
  return (
    <>
      {fields.map((field) => {
        const commonProps = {
			name: field.name,
			label: field.label,
			value: values[field.name] || '',
			onChange,
			fullWidth: true
		};

        switch (field.type) {
          case 'text':
            return <TextField {...commonProps} />;
          case 'dropdown':
            return (
              <TextField {...commonProps} select>
               {field.options.map((opt) => {
					const value = typeof opt === 'object' ? opt.value : opt;
					const label = typeof opt === 'object' ? opt.label : opt;
					return <MenuItem key={value} value={value}>{label}</MenuItem>;
				})}

              </TextField>
            );
          case 'radio':
            return (
              <RadioGroup
                key={field.name}
                name={field.name}
                value={values[field.name] || ''}
                onChange={onChange}
              >
                {field.options.map(opt => (
                  <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                ))}
              </RadioGroup>
            );
          case 'checkbox':
            return (
              <FormControlLabel
                key={field.name}
                control={
                  <Checkbox
                    checked={values[field.name] || false}
                    onChange={(e) => onChange({
                      target: { name: field.name, value: e.target.checked }
                    })}
                  />
                }
                label={field.label}
              />
            );
          case 'date':
            return (
              <TextField
                {...commonProps}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            );
          case 'datetime':
            return (
              <TextField
                {...commonProps}
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default FormBuilder;