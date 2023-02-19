import React, {useState} from 'react';
import { Text, View, Image,StyleSheet,ScrollView } from 'react-native';
import { Card, ListItem, Button, Icon, Avatar } from 'react-native-elements'

export default WishlistCard = (props) => {
 return (
   <View style={styles.container}>
    <Card>
        <Card.Title>{props.NFTname}</Card.Title>
        <Card.Divider/>
        <ScrollView>
        <Text style={{marginBottom: 10}}>
              {props.NFTinfo}
        </Text>
        </ScrollView>
        <Card.Divider/>
    </Card>
    </View>
    );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
});


