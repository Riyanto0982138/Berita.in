import React, { useRef, useState, useEffect } from 'react';
import { ImageSourcePropType } from 'react-native';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
  Text,
} from 'react-native';

const Home = () => {
  const images = [
    require('../Images/Swipe/1.png'),
    require('../Images/Swipe/2.png'),
    require('../Images/Swipe/3.png'),
    require('../Images/Swipe/4.png'),
    require('../Images/Swipe/5.png'),
    require('../Images/Swipe/6.png'),
    require('../Images/Swipe/7.png'),
  ];

  const texts = [
    'Satu klik bisa merubah sudut pandang mu',
    'Ketika baik mu di sepelekan lawan dan hancurkan👊',
  ];

  const { width } = Dimensions.get('window');
  const ITEM_WIDTH = width * 0.8;
  const ITEM_SPACING = (width - ITEM_WIDTH) / 2;
  const scrollX = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef<FlatList<ImageSourcePropType> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(textFade, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);

      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_WIDTH,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp',
          });

          return (
            <View style={{ width: ITEM_WIDTH, alignItems: 'center' }}>
              <Animated.Image
                source={item}
                style={[styles.image, { transform: [{ scale }] }]}
              />
            </View>
          );
        }}
      />
      <Animated.Text style={[styles.text, { opacity: textFade }]}>
        {texts[currentIndex % texts.length]}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  text: {
    position: 'absolute',
    bottom: 30,
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(65, 62, 62, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});

export default Home;
