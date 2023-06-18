import React, { useEffect, useState } from 'react';
import { View, Button, SafeAreaView, StyleSheet,FlatList,Text, Image, Touchable, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import path from 'path';


const VideoUploader = () => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
    const [videos, setVideos] = useState([]);
  
    useEffect(() => {
     try {
      fetchVideos();
     } catch (error) {
      console.log(error.message)
     }
      

    }, []);
  
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://192.168.1.118:3000/videos');
        const data = await response.json();
        const filteredVideos = data.filter(video => !video.includes('.DS_Store'));
        const videoNames = filteredVideos.map(video => path.basename(video));

        setVideos(videoNames);
        console.log(videos)
      } catch (error) {
        console.error(error);
      }
    };
 
  
  const Item = ({item}) => (
    <View style={style.item}>
      <Text style={style.itemText}> {item}</Text>
    </View>
  );
  const handleVideoUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
console.log(res)
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

      // Handle the response from the server
      console.log(response);
      fetchVideos();
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.logo}>
        <Image style={style.logo} source={require('./Gray.png')}></Image>
      </View>
      <View style={style.content}>
     <View style={style.inner}>
      
      <FlatList
        data={videos}
        renderItem={({item}) => <Item item={item} />}
        keyExtractor={(item, index) => index.toString()}

      />
    </View>

      </View>
      <TouchableOpacity style={style.buton} title="Select Video" onPress={handleVideoUpload}><Text style={style.butonText}>Video Yükle</Text></TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default VideoUploader;

const style=StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    backgroundColor:'black'
  },
  logo:{
    width:270,
    height:150,
  },
  content:{
    marginTop:200
  },
  item: {
    backgroundColor: '#7A98BF',
    width:324,
    height:39,
    borderRadius:6,
    marginBottom:9,
    alignItems:'flex-start',
    justifyContent:'center'
  },
  itemText:{
    marginLeft:30,
    fontSize:14,
    fontWeight:500,
    color:'white'

  },
 buton:{
height:56,
width:206,
borderRadius:28,
backgroundColor:'#1E5479',
justifyContent:'center',
alignItems:'center',
marginTop:15
 },
  inner:{
   
    height:200

  },
  butonText:{
fontSize:18,
fontWeight:500,
color:'white'
  }
})
