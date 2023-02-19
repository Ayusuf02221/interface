import React, { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import CardView from '../components/Card/index';
import { getCurrentUser, addToWishlist } from '../helperFunctions/index';
import { useNFTInfo } from '../MoralisAPI/moralis';

const DetailPage = ({ route, navigation }) => {
  const { token, contract } = route.params;
  const [nftInfo, setNftInfo] = useState({});

  useEffect(() => {
    const fetchNFTInfo = async () => {
      try {
        const nftInfo = await useNFTInfo(token, contract);
        setNftInfo({
          name: nftInfo.name,
          owner: nftInfo.owner,
          creator: nftInfo.creator,
          price: nftInfo.sell_orders && nftInfo.sell_orders.length > 0
            ? `${nftInfo.sell_orders[0].current_price} ${nftInfo.sell_orders[0].payment_token.symbol}`
            : 'Not for sale',
          description: nftInfo.description,
          image_url: nftInfo.image_url,
          id: nftInfo.id,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchNFTInfo();
  }, [token, contract]);

  const takeAnotherPicture = () => {
    navigation.goBack();
  };

  const saveToWishlist = () => {
    getCurrentUser().then(user => {
      addToWishlist(user, nftInfo).then(response => {
        if (response.success === false) {
          Alert.alert(response.requestMsg);
        } else {
          Alert.alert(response.requestMsg);
          navigation.navigate('Wishlist');
        }
      });
    });
  };

  return (
    <CardView
      NFTName={nftInfo.name}
      NFTOwner={nftInfo.owner}
      NFTCreator={nftInfo.creator}
      NFTPrice={nftInfo.price}
      NFTInfo={nftInfo.description}
      image={nftInfo.image_url}
      ID={nftInfo.id}
      takeAnotherPicture={takeAnotherPicture}
      saveToWishlist={saveToWishlist}
    />
  );
};

export default DetailPage;
