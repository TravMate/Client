// CustomTextInput.tsx
import React, { FC, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  StyleSheet,
  StyleSheetProperties,
} from "react-native";
import * as Icons from "react-native-heroicons/outline";

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  inputStyles?: object;
  error?: string;
  password?: boolean;
  onFocus?: () => void;
}

const CustomTextInput: FC<CustomTextInputProps> = ({
  label,
  inputStyles,
  error,
  password = false,
  onFocus = () => {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(password);

  return (
    <View style={[inputStyles]}>
      <View
        style={[
          {
            borderColor: error ? "#FF6C6C" : isFocused ? "#fb923c" : "#E8E8E8",
          },
          styles.inputContainer,
        ]}
      >
        <TextInput
          secureTextEntry={hidePassword}
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={label}
          style={styles.textInput}
          {...props}
        />
        {password && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            {hidePassword ? (
              <Icons.EyeSlashIcon size={20} color={"#1A1A1A"} />
            ) : (
              <Icons.EyeIcon size={20} color={"#1A1A1A"} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "white",
    marginLeft: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  inputContainer: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 2,
    borderRadius: 8,
  },
  textInput: {
    flex: 1,
    color: "#0F2650", // text-gray-700
    fontSize: 16,
  },
  errorText: {
    color: "#FF6C6C", // text-red-500
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default CustomTextInput;
