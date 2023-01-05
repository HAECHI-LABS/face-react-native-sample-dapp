import { Card, Text, View } from 'react-native-ui-lib';
import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

interface BoxProps {
  title?: string;
  children: ReactNode;
}

function Box({ title, children }: BoxProps) {
  return (
    <Card style={styles.boxContainer}>
      <Text text60M>{title}</Text>
      <View style={styles.contents}>{children}</View>
    </Card>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    padding: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  contents: {
    marginTop: 20,
  },
});

export default Box;
