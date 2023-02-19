import config from "../config.json";
import { formatGoogleTextData } from "../utilities/format";

export const detectNFT = async base64 => {

  try {
    const requestBody = {
      requests: [
        {
          image: {
            content: base64
          },
          features: [
            {
              type: "TEXT_DETECTION",
              maxResults: 1
            }
          ]
        }
      ]
    };
    
    console.log("Request body:", JSON.stringify(requestBody));
    
    const res = await fetch(config.googleCloud.api + config.googleCloud.apiKey, {
      method: "POST",
      body: JSON.stringify(requestBody)
    });
    

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();

    console.log("detectNFT response:", data);

    const processedData = formatGoogleTextData(data);
    console.log("processedData:", processedData);

    let tokenID = null, contractAddress = null;

    if (processedData) {
      for (let i = 0; i < processedData.length; i++) {
        if (processedData[i].startsWith("Token ID:")) {
          tokenID = processedData[i].substring(9).trim();
          console.log("the tokenID: ", tokenID);
        } else if (processedData[i].startsWith("Contract Address:")) {
          contractAddress = processedData[i].substring(18).trim();
          console.log("the contractAddress: ", contractAddress);
        }
      }
    }

    return { tokenID, contractAddress };
  } catch (error) {
    console.error("detectNFT error:", error);
    throw error;
  }
};
