import React, {useState} from 'react';
import { Text, View, Image,StyleSheet,ScrollView } from 'react-native';
import { Card, ListItem, Button, Icon, Avatar } from 'react-native-elements'

export default CardView = (props) => {
 return (
   <View style={styles.container}>
      <View style={styles.card}>
      <ScrollView>
        <Card>
        <Card.Title>{props.NFTname}</Card.Title>
        <Card.Divider/>
        <Image source={props.image} 
            style={{
              resizeMode: "contain",
              height: 250,
              width: 350,
              marginBottom: 20
            }}/>
        <Card.Divider/>
        <ScrollView>
        <Text style={{marginBottom: 10}}>
              {props.NFTinfo}
        </Text>
        </ScrollView>
        <Card.Divider/>
      </Card>
      </ScrollView>
    </View>
        <View style={styles.buttons}>
        <Button
            buttonStyle={styles.Btn}
            title='ADD TO WISHLIST' 
            onPress = {() => props.saveToWishlist(props.NFTname,props.NFTinfo)}
            />
             <Button
            buttonStyle={styles.Btn}
            title='Go Back'
            onPress = {props.takeAnotherPicture} 
            />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  card:{
    flex:3,
  },
  buttons:{
    position:'relative',
    flex:1,

  },
  Btn:{
    alignSelf:'center', 
    width:"80%",
    backgroundColor:"#453750",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginBottom: 20,
    marginTop: 15,

  },
  
});


