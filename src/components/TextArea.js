import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const TextArea = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  disabled,
}) => {
  return (
    <View style={[styles.container, disabled && styles.disabledContainer]}>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          disabled && styles.disabledInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'#AAAAAA'}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 3,
  },
  disabledContainer: {
    opacity: 1.0,
  },
  input: {
    borderColor: '#a5b4fc',
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#4b5563',
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    paddingBottom: 12,
  },
  disabledInput: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
  },
});

export default TextArea;
