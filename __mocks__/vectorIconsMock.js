import React from 'react';
const { View } = require('react-native');

// Buat komponen palsu untuk semua ikon
const createIconSet = () => {
  return class Icon extends React.Component {
    render() {
      return <View />;
    }
  };
};

// Ekspor set ikon palsu
module.exports = {
  Ionicons: createIconSet(),
};