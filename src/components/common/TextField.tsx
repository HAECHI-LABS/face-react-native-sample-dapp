import { StyleSheet } from 'react-native';
import { Colors, Incubator, Text, View } from 'react-native-ui-lib';

interface FieldProps {
  label?: string;
  value?: string;
  onChange?: (text: string) => void;
}

function TextField({ label, value, onChange }: FieldProps) {
  return (
    <View>
      <Text text70>{label}</Text>
      <Incubator.TextField
        value={value}
        placeholder={label}
        text70
        onChangeText={onChange}
        floatingPlaceholder
        containerStyle={{ marginBottom: 10 }}
        fieldStyle={styles.withUnderline}
        floatingPlaceholderStyle={styles.place}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  withUnderline: {
    borderBottomWidth: 1,
    borderColor: Colors.grey50,
    paddingBottom: 8,
    paddingTop: 4,
    paddingLeft: 4,
    paddingRight: 4,
  },
  place: {
    paddingBottom: 24,
  },
});

export default TextField;
