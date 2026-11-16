import React, {useEffect, useRef} from 'react';
import {Animated, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import {SCREEN_W} from '../constants/config';
import StitchSeam from './StitchSeam';

const GRAD_SHEET = [...theme.gradients.sheet];

/**
 * Shared modal sheet — used by the Menu settings card and the in-game pause
 * sheet. The animated wrapper carries pointerEvents="box-none" so the buttons
 * inside always receive their taps on Android release builds.
 */
export default function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const slide = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slide, {
      toValue: visible ? 0 : 1,
      tension: 60,
      friction: 11,
      useNativeDriver: true,
    }).start();
  }, [visible, slide]);

  const translateY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 340],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="CLOSE"
          onPress={onClose}
          style={styles.backdrop}
        />
        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheetWrap, {transform: [{translateY}]}]}>
          <LinearGradient colors={GRAD_SHEET} style={styles.sheet}>
            <View style={styles.seam}>
              <StitchSeam width={SCREEN_W - 2} />
            </View>
            <View style={styles.grabber} />
            <Text style={styles.title}>{title}</Text>
            {children}
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(12,8,5,0.68)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetWrap: {
    width: SCREEN_W,
  },
  sheet: {
    width: SCREEN_W,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(240,236,233,0.14)',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 10,
  },
  seam: {
    position: 'absolute',
    top: 6,
    left: 1,
  },
  grabber: {
    alignSelf: 'center',
    width: 46,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(240,236,233,0.22)',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.text.primary,
    marginBottom: 6,
  },
});
