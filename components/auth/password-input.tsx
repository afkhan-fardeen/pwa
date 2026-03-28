"use client";

import { useId, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, TextField } from "@mui/material";

export function PasswordInput({
  id,
  InputProps,
  inputProps,
  ...props
}: React.ComponentProps<typeof TextField>) {
  const [show, setShow] = useState(false);
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <TextField
      id={inputId}
      type={show ? "text" : "password"}
      fullWidth
      autoComplete={props.autoComplete ?? "current-password"}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              tabIndex={-1}
              onClick={() => setShow((s) => !s)}
              edge="end"
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      inputProps={inputProps}
      {...props}
    />
  );
}
