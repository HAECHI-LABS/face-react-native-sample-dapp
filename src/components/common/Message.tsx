import { Colors } from 'react-native-ui-lib';
import { StyleSheet, View } from 'react-native';
import React, { ReactNode } from 'react';

Colors.primary;
interface MessageProps {
  type?: 'default' | 'info' | 'danger';
  children: ReactNode;
}

function Message({ type = 'default', children }: MessageProps) {
  let colors = {
    color: '#4a4a4a',
    borderColor: '#363636',
    backgroundColor: '#fafafa',
  };
  switch (type) {
    case 'info':
      colors = {
        color: '#296fa8',
        borderColor: '#3e8ed0',
        backgroundColor: '#eff5fb',
      };
      break;
    case 'danger':
      colors = {
        color: '#cc0f35',
        borderColor: '#f14668',
        backgroundColor: '#feecf0',
      };
      break;
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { color: colors.color } as never);
    }
    return child;
  });

  return <View style={{ ...styles.message, ...colors }}>{childrenWithProps}</View>;
}

const styles = StyleSheet.create({
  message: {
    borderRadius: 3,
    borderLeftWidth: 3,
    padding: 10,
    marginBottom: 10,
  },
});

export default Message;
