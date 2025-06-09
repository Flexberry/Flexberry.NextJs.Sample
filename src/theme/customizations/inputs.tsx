import { Icon } from '@mui/material';
import { Theme, Components } from '@mui/material/styles';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { buttonBaseClasses } from '@mui/material/ButtonBase';
import { inputBaseClasses } from '@mui/material/InputBase';
import { filledInputClasses } from '@mui/material/FilledInput';
import { inputLabelClasses } from '@mui/material/InputLabel';

export const inputsCustomizations: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        padding: '0.125em 0.625em',
      },
      startIcon: {
        marginRight: '5px',
        '& > *:nth-of-type(1)': {
          fontSize: '24px',
        },
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: '0.125em',
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }),
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: '0.875rem',
        position: 'relative',
        transform: 'none',
        order: -1,
        marginBottom: '4px',
        ...theme.applyStyles('light', {
          color: theme.palette.text.primary,
          [`&.${inputLabelClasses.error}, &.${inputLabelClasses.disabled}`]: {
            color: theme.palette.text.primary,
          },
          [`& .${inputLabelClasses.asterisk}`]: {
            color: theme.palette.error.main,
          },
        }),
      }),
    },
  },

  MuiAutocomplete: {
    defaultProps: {
      popupIcon: <Icon className="icon-arrow-down-s" />,
    },
    styleOverrides: {
      root: {
        [`& .${filledInputClasses.root}`]: {
          paddingTop: '0.875em',
          paddingBottom: '0.875em',
          paddingLeft: '1rem',
          [`& .${filledInputClasses.input}`]: {
            padding: '0',
            lineHeight: '24px',
            height: 'auto',
          },
        },
      },
    },
  },

  MuiSelect: {
    defaultProps: {
      IconComponent: () => {
        return <Icon className="icon-arrow-down-s" sx={{ position: 'absolute', right: '0', pointerEvents: 'none' }} />;
      },
    },
  },

  MuiTextField: {
    defaultProps: {
      variant: 'filled',
      fullWidth: true,
      rows: 2,
      slotProps: {
        input: { disableUnderline: true },
        inputLabel: { shrink: true },
      },
      sx: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        [`& .${formHelperTextClasses.root}`]: {
          order: -1,
          alignSelf: 'flex-start',
          mb: 0.5,
          mt: 0,
        },
      },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        input: {
          padding: '0.875em 1rem',
          lineHeight: '24px',
          height: 'auto',
        },
        [`& .${filledInputClasses.multiline}`]: {
          padding: '0.875em 1rem',
        },

        [`& .${inputBaseClasses.root}`]: {
          borderRadius: theme.shape.borderRadius / 2,
          [`&.${inputBaseClasses.focused}`]: {
            boxShadow: 'inset 0 0 0 2px #99B1E6',
          },
          [`&.${inputBaseClasses.error}`]: {
            backgroundColor: theme.palette.error.light,
            [`& .${buttonBaseClasses.root}`]: {
              color: theme.palette.error.dark,
            },
          },
          [`&.${inputBaseClasses.disabled}`]: {
            input: {
              color: theme.palette.text.primary,
              WebkitTextFillColor: theme.palette.text.primary,
            },
            textarea: {
              WebkitTextFillColor: theme.palette.text.primary,
            },
          },
        },
      }),
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: {
        marginLeft: 0,
        fontSize: '0.875rem',
        lineHeight: '1.428em',
      },
    },
  },
};
