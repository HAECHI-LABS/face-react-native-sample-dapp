import { Button as RNUIButton, ButtonProps } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';

function Button(props: ButtonProps) {
  return (
    <RNUIButton
      {...props}
      outline={true}
      color="#363636"
      round={false}
      borderRadius={4}
      style={styles.button}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    borderColor: '#dbdbdb',
  },
});

export default Button;
