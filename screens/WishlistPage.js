import React, {useState,useEffect} from 'react';
import { Alert } from 'react-native';
import { Text, View, ScrollView } from 'react-native';
import { Card, ListItem, Button, Icon, Avatar, Overlay } from 'react-native-elements'
import WishlistCard from "../components/Card/wishlist";


const WishlistPage= () => {
  const [wishlistItems, setwishlistItems] = useState(null);
  const [user,setUser] = useState(null);


  useEffect(() => {
     function _loadData (){
      getCurrentUser().then(item =>{
      setUser(item);
      getWishlistItems(item).then(obj => {
      setwishlistItems(obj)
      })
      })
    }
   _loadData();
  },[]);


  useEffect(() => {
 },[wishlistItems]);

  const toggleOverlay = (value) => {
    deleteWishlistItem(value).then(response=>{
      Alert.alert(response.requestMsg);
    });   
   };
  return (
    <View>
      <ScrollView>
  {
    wishlistItems === null ? <Text>Hello This is where your wishlist items are stored!</Text> : 
        <View>
        {
          wishlistItems.map((item, i) => (
            <View key ={i}>
            <Card>
            <Card.Title>{item.NFTname}</Card.Title>
            <Card.Divider/>
            <ListItem bottomDivider>
              <ListItem.Content>
                <ScrollView><Text>{item.NFTinfo}</Text></ScrollView>
              </ListItem.Content>
              <Icon name={'delete-outline'} onPress={() =>toggleOverlay([item.NFTname,user])}/>
            </ListItem>
            </Card>
            </View>
          ))}
          </View>
      }
      </ScrollView>
    </View>
  )
}
export default WishlistPage;