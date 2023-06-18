import React, { useEffect, useState } from 'react';
import { View, Button, SafeAreaView, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import path from 'path';


const VideoUploader = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://192.168.1.118:3000/videos');
      const data = await response.json();
      const filteredVideos = data.filter(video => !video.includes('.DS_Store'));
      const videoNames = filteredVideos.map(video => path.basename(video));

      setVideos(videoNames);
    } catch (error) {
      console.error(error);
    }
  };

  const Item = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => setSelectedVideo(item)}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleVideoUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });

      const formData = new FormData();
      formData.append('video', {
        uri: res[0].uri,
        type: res[0].type,
        name: res[0].name,
      });

      const response = await fetch('http://192.168.1.118:3000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Sunucudan gelen yanıtı işle
      console.log(response);
      fetchVideos();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlay = async () => {
    console.log(selectedVideo)
    try {
      const response = await fetch('http://192.168.1.118:3000/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoPath: selectedVideo }),
      })
  
      if (response.ok) {
        console.log('Video playback started');
      } else {
        console.error('Error starting video playback');
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Image style={styles.logo} source={require('./Gray.png')}></Image>
      </View>
      <View style={styles.content}>
        <View style={styles.inner}>
          <FlatList
            data={videos}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} title="Select Video" onPress={handleVideoUpload}>
        <Text style={styles.buttonText}>Video Yükle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} title="Play Video" onPress={handlePlay}>
        <Text style={styles.buttonText}>Videoyu Oynat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VideoUploader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black'
  },
  logo: {
    width: 270,
    height: 150,
  },
  content: {
    marginTop: 120
  },
  item: {
    backgroundColor: '#7A98BF',
    width: 324,
    height: 39,
    borderRadius: 6,
    marginBottom: 9,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  itemText: {
    marginLeft: 30,
    fontSize: 14,
    fontWeight: '500',
    color: 'white'
  },
  button: {
    height: 56,
    width: 206,
    borderRadius: 28,
    backgroundColor: '#1E5479',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  inner: {
    height: 200
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white'
  }
});
