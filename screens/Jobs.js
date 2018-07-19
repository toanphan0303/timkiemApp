import React, { Component } from 'react';
import {
  StyleSheet,
  Text, View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageStore
} from 'react-native';
import { LinearGradient } from 'expo';
import { material } from 'react-native-typography';
import _ from 'lodash';
import { Icon, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import ImageBrowser from '../components/ImageUpload/ImageBrowser';
import ImageDisplay from '../components/HOC/withImageDeleteIcon';
import { storagePermission } from '../services/permissions';
import * as actions from '../actions';

const SCREEN_WIDTH = Dimensions.get('window').width;
class PostImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageBrowserOpen: false,
      photos: [],
      loading: false,
      max: 4,
      component: ''
    };
  }

  componentWillMount = async() => {
    const roomDetail = this.props.roomDetail.Items[0];
    const photos = this.getArrayImage(roomDetail.images);
    await storagePermission();
    this.setState({
      photos
    });
  }
  getArrayImage(images) {
    return _.map(images, 'Location');
  }
  imageBrowserCallback = (callback) => {
    callback.then((photos) => {
      const remain = 4 - this.state.photos - photos.length;
      this.setState({
        imageBrowserOpen: false,
        photos: [...this.state.photos, ...photos],
        max: remain
      });
    }).catch((e) => console.log(e));
  }
  convertImageToBase64(photos){
    const yourBase64Icon = 'data:image/png;base64,';
    return Promise.all(photos.map(async (item) => {
      return new Promise(resolve => {
        ImageStore.getBase64ForTag(item.file, (data) => {
          return resolve(yourBase64Icon + data);
        }, e => console.log('erorr convert image to base64: ', e));
      });
    }));
  }

  uploadImageToS3 = async() => {
    console.log('this.props.roomDetail ', this.props.roomDetail);
    this.setState({ loading: true });
    const { id, zip } = this.props.roomDetail.Items[0];
    const { email } = this.props.user;
    const { photos } = this.state;
    const data = await this.convertImageToBase64(photos);
    Promise.all(data.map(async(item) => {
      return await this.props.uploadImage(id, zip, email, item);
    }))
     .then(() => {
       this.setState({ loading: false });
     });
  }

  renderImage(item, i) {
    console.log('this.state.photos', this.state.photos)
    console.log('item', item)
    return (
      <ImageDisplay
        imageUrl={item.file}
        pos={i}
        key={i}
      />
    );
  }
  render() {
    if (this.state.imageBrowserOpen) {
      return (<ImageBrowser max={this.state.max} callback={this.imageBrowserCallback} />);
    }
    return (
      <ScrollView style={{ flex: 1}}>
        <View tyle={styles.container}>
          <Text style={[material.button, {fontWeight: 'bold'}]}>Please up load some image</Text>
          <LinearGradient
            colors={['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#6536FF', '#8000FF']}
            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
            style={[styles.LinearGradientSyle, { height: 48, width: 200}]}
          >
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.setState({ imageBrowserOpen: true })}
            >
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ marginLeft: 40, paddingLeft: 70, paddingTop: 7 }}>
                    <Icon color='#4C64FF' name='paperclip' type='font-awesome' size={25} />
                  </View>
                  <Text style={styles.buttonText}>
                      ATTACH IMAGES
                  </Text>
                </View>
            </TouchableOpacity>
          </LinearGradient>
        <Text>If you do not need to upload rooms images. Click skip to finish post your room</Text>
        <TouchableOpacity>
          <Text>SKIP</Text>
        </TouchableOpacity>
        <Button
          title='Upload'
          loading={this.state.loading}
          onPress={this.uploadImageToS3.bind(this)}
          backgroundColor='#1E90FF'
        />
        </View>
        <View style={{ marginTop: 50, flexDirection: 'row', width: SCREEN_WIDTH, flexWrap: 'wrap' }}>
          {this.state.photos.map((item, i) => this.renderImage(item, i))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
      width: 190,
      height: 40,
      alignItems: 'center',
      backgroundColor: 'white',
  },
  buttonText: {
      textAlign: 'center',
      color: '#4C64FF',
      padding: 10,
      marginLeft: -10,
      paddingRight: 20,
      marginRight: 50,
      width: 200
  },
  imageStyle: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'white'
  },
  LinearGradientSyle: {
     alignItems: 'center',
     justifyContent: 'center'
  }
});
const mapStateToProps = ({ user, roomDetail }) => {
  return { user, roomDetail };
};
export default connect(mapStateToProps, actions)(PostImage);
