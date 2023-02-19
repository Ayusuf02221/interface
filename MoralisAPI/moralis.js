import { detectNFT } from "../api/google";

const moralisApi = 'https://deep-index.moralis.io/api/v2/nft/';
const apiKey = '9jb0MX37P02tT2LMTQKvdeVM06p7WFHqE78XZZdXVX536uLmcZCnSpPNwUM6w263';
const fetchNFTInfo = async (contractAddress, tokenID) => {

  const apiUrl = `${moralisApi}/nft/${contractAddress}/${tokenID}`;
  const res = await fetch(apiUrl, {
    headers: {
      'X-API-Key': apiKey,
    },
  });
  const nftInfo = await res.json();
  return nftInfo;
};


export const useNFTInfo = async (base64) => {
  const { tokenID, contractAddress } = await detectNFT(base64);
  console.log('Detected NFT with tokenID:', tokenID, 'and contractAddress:', contractAddress);

  const nftInfo = await fetchNFTInfo(contractAddress, tokenID);

  return nftInfo;
};
