import _ from "lodash";

export const formatGoogleTextData = data => {
  let text = _.get(
    data,
    "responses[0].textAnnotations[0].description",
    null
  );

  if (!text) {
    return [];
  }

  // Split the text data into an array of lines
  const lines = text.split('\n');
  
  return lines;
};
