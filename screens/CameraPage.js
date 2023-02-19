import React from "react";
import Constants from 'expo-constants';
import * as ImageManipulator from "expo-image-manipulator";
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Alert, Text, View,StyleSheet, Platform } from "react-native";
import { BottomBar,TopBar,SelectedPicture } from "../components/Camera";
import * as google from "../api/google";

const flashModeOrder = {
  off: "on",
  on: "auto",
  auto: "torch",
  torch: "off"
};
export default class CameraPage extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    flash: "off",
    type: "back",
    zoom: 0,
    ratio: "16:9",
    newPhotos: false,
    returning:false,
    permissionsGranted: false,
    pictureSize: undefined,
    pictureSizes: [],
    pictureSizeId: 0,
    loading: false,
  };


  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === "granted" });
    FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "photos"
    ).catch(e => {
      console.log(e, "Directory exists");
    });
    console.log("you've created a file directory");

  }

  takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({
        onPictureSaved: this.onPictureSaved,
        base64: true
      });
    }
  };

  toggleFacing = () =>
    this.setState({ type: this.state.type === "back" ? "front" : "back" });

  toggleFlash = () =>
    this.setState({ flash: flashModeOrder[this.state.flash] });

  onRetake = () => this.setState({ newPhotos: false });

  onConfirm = async () => {
    const { picture } = this.state;
    this.setState({ loading: false });

    const image = await ImageManipulator.manipulateAsync(
      picture.uri,
      [{ resize: { width: 860 } }],
      {
        format: "png",
        base64: true
      }
    );
    let nftInfo = await google.detectNFT(image.base64);
    console.log("nftInfo: ", nftInfo);
    if (!nftInfo || !nftInfo.tokenID || !nftInfo.contractAddress) {
      this.throwAlert();
    } else {
      const { tokenID, contractAddress } = nftInfo;
      const text = `${contractAddress}_${tokenID}`;
      this.props.navigation.navigate("Detail", { picture, text });
    }
  };

  handleMountError = ({ message }) => console.error(message);

  onPictureSaved = async picture => {
    this.setState({ picture, newPhotos: true });
  };

  collectPictureSizes = async () => {
    if (this.camera) {
      const pictureSizes = await this.camera.getAvailablePictureSizesAsync(
        this.state.ratio
      );
      let pictureSizeId = 0;
      if (Platform.OS === "ios") {
        pictureSizeId = pictureSizes.indexOf("High");
      } else {
        // returned array is sorted in ascending order - default size is the largest one
        pictureSizeId = pictureSizes.length - 1;
      }
      this.setState({
        pictureSizes,
        pictureSizeId,
        pictureSize: pictureSizes[pictureSizeId]
      });
    }
  };

  throwAlert = () => {
    Alert.alert(
      "Sorry we just failed",
      "We were not able to identify your NFTs",
      [
        {
          text: "Try anothe picture",
          onPress: () => this.setState({ newPhotos: false }),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };

  renderPicture = () => (
    <SelectedPicture
      loading={this.state.loading}
      picture={this.state.picture}
      onRetake={this.onRetake}
      onConfirm={this.onConfirm}
    />
  );

  renderNoPermissions = () => (
    <View style = {styles.permissionStyle}>
      <Text style={{ color: "white" }}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>

  );
  renderBottomBar = () => (
    <BottomBar
      takePicture={this.takePicture}
    />
  );

  renderTopBar = () => (
    <TopBar
      flash={this.state.flash}
      toggleFacing={this.toggleFacing}
      toggleFlash={this.toggleFlash}
    />
  );

  renderCamera = () => (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        ref={ref => {
          this.camera = ref;
        }}
        onCameraReady={this.collectPictureSizes}
        zoom={this.state.zoom}
        type={this.state.type}
        flashMode={this.state.flash}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        pictureSize={this.state.pictureSize}
        onMountError={this.handleMountError}
      >
        {this.renderTopBar()}
        {this.renderBottomBar()}

      </Camera>
    </View>
  );

  render() {
    const { photo, newPhotos, loading } = this.state;

    const cameraPageContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
    const content = newPhotos ? this.renderPicture() : cameraPageContent;
    return (
      <View style = {{flex:1}}>
        {loading && null}
        {content}
      </View>
    
    );
  }
}

const styles = StyleSheet.create({
  permissionStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding:10
  },
});