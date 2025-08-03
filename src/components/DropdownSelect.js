import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Divider} from 'react-native-paper';

const DropdownSelect = ({options, placeholder, onSelect, selectedValue}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(selectedValue);
  }, [selectedValue]);

  const handleSelect = option => {
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option);
  };

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleShowOptions}>
        <View style={styles.selectContainer}>
          {selectedOption ? (
            <Text style={styles.selectedOption}>{selectedOption.label}</Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
          <Text style={styles.arrowDown}>▼</Text>
        </View>
      </TouchableOpacity>
      {showOptions && (
        <>
          <Divider />
          <ScrollView
            style={styles.optionsContainer}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            bounces={false}
            keyboardShouldPersistTaps="handled">
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(option)}>
                <Text style={styles.option}>{option.label}</Text>
                <Divider />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    marginVertical: 5,
    borderRadius: 2,
    borderColor: '#a5b4fc',
    borderWidth: 1,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 2,
    width: '100%',
    borderRadius: 2,
  },
  selectedOption: {
    fontSize: 14,
    color: '#333',
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
  },
  arrowDown: {
    fontSize: 14,
    color: '#333',
  },
  optionsContainer: {
    maxHeight: 150,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  option: {
    fontSize: 14,
    color: '#333',
    padding: 15,
  },
});

export default DropdownSelect;
