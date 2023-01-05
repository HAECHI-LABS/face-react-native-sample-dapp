import { StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

import { View, Text } from 'react-native-ui-lib';

interface PickerProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  items: string[];
}

function Picker({ title, value, onChange, items }: PickerProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title} text80M>
        {title}
      </Text>
      <SelectDropdown
        data={items}
        onSelect={(selectedItem) => onChange?.(selectedItem)}
        onChangeSearchInputText={() => null}
        defaultValue={value}
        buttonTextAfterSelection={(selectedItem) => {
          return selectedItem;
        }}
        rowTextForSelection={(item) => {
          return item;
        }}
        buttonStyle={styles.pickerButton}
        buttonTextStyle={styles.pickerText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    paddingRight: 10,
    width: 100,
  },
  pickerButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    color: 'black',
  },
  pickerText: {
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#dddddd',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  viewContainer: {
    flexGrow: 1,
  },
});

export default Picker;
