import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const FormInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  disabled,
  ...props
}) => {
  return (
    <View style={[styles.container, disabled && styles.disabledContainer]}>
      <TextInput
        style={[styles.input, disabled && styles.disabledInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'#AAAAAA'}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
  disabledContainer: {
    opacity: 1.6,
  },
  input: {
    height: 48,
    borderColor: '#a5b4fc',
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#4b5563',
    backgroundColor: 'white',
  },
  disabledInput: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
  },
});

export default FormInput;
