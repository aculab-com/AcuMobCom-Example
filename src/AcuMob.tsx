import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { styles, COLOURS } from './styles';
import { RTCView } from 'react-native-webrtc';
import {
  AcuMobCom,
  turnOnSpeaker,
  deleteSpaces,
} from 'react-native-aculab-client';
import { MenuButton } from './components/MenuButton';
import { KeypadButton } from './components/KeypadButton';
import { CallButton } from './components/CallButton';
import { RoundButton } from './components/RoundButton';
import { useNavigation } from '@react-navigation/native';

interface AcuMobProps {
  acuMob: AcuMob;
}

const MainCallButtons = (props: AcuMobProps) => {
  return (
    <View style={styles.callButtonsContainer}>
      <CallButton
        title={'Hang up'}
        colour={COLOURS.RED}
        onPress={() => props.acuMob.stopCall()}
      />
      <CallButton
        title={'Speaker'}
        colour={COLOURS.SPEAKER_BUTTON}
        onPress={() =>
          props.acuMob.setState(
            { speakerOn: !props.acuMob.state.speakerOn },
            () => turnOnSpeaker(props.acuMob.state.speakerOn),
          )
        }
      />
    </View>
  );
};

const DialKeypad = (props: AcuMobProps) => {
  return (
    <View style={styles.dialKeypad}>
      {props.acuMob.state.callState === 'calling' ||
      props.acuMob.state.callState === 'ringing' ? (
        <View>
          <Text style={styles.callingText}>
            Calling {props.acuMob.state.serviceName}
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.callingText}>
            Service {props.acuMob.state.serviceName}
          </Text>
        </View>
      )}
      <View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'1'}
            onPress={() => props.acuMob.sendDtmf('1')}
          />
          <KeypadButton
            title={'2'}
            onPress={() => props.acuMob.sendDtmf('2')}
          />
          <KeypadButton
            title={'3'}
            onPress={() => props.acuMob.sendDtmf('3')}
          />
        </View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'4'}
            onPress={() => props.acuMob.sendDtmf('4')}
          />
          <KeypadButton
            title={'5'}
            onPress={() => props.acuMob.sendDtmf('5')}
          />
          <KeypadButton
            title={'6'}
            onPress={() => props.acuMob.sendDtmf('6')}
          />
        </View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'7'}
            onPress={() => props.acuMob.sendDtmf('7')}
          />
          <KeypadButton
            title={'8'}
            onPress={() => props.acuMob.sendDtmf('8')}
          />
          <KeypadButton
            title={'9'}
            onPress={() => props.acuMob.sendDtmf('9')}
          />
        </View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'*'}
            onPress={() => props.acuMob.sendDtmf('*')}
          />
          <KeypadButton
            title={'0'}
            onPress={() => props.acuMob.sendDtmf('0')}
          />
          <KeypadButton
            title={'#'}
            onPress={() => props.acuMob.sendDtmf('#')}
          />
        </View>
      </View>
    </View>
  );
};

const ButtonsIncoming = (props: AcuMobProps) => {
  return (
    <View style={styles.callButtonsContainer}>
      <CallButton
        title={'Reject'}
        colour={COLOURS.RED}
        onPress={() => props.acuMob.reject()}
      />
      <CallButton
        title={'Accept'}
        colour={COLOURS.GREEN}
        onPress={() => props.acuMob.answer()}
      />
    </View>
  );
};

const ClientCallButtons = (props: AcuMobProps) => {
  var videoIcon: string = '';
  var audioIcon: string = '';
  if (!props.acuMob.state.camera) {
    videoIcon = 'eye-off-outline';
  } else {
    videoIcon = 'eye-outline';
  }
  if (!props.acuMob.state.mic) {
    audioIcon = 'mic-off-outline';
  } else {
    audioIcon = 'mic-outline';
  }
  return (
    <View style={styles.callButtonsContainer}>
      <RoundButton
        iconName={'camera-reverse-outline'}
        onPress={() => props.acuMob.swapCam()}
      />
      <RoundButton
        iconName={videoIcon}
        onPress={() =>
          props.acuMob.setState({ camera: !props.acuMob.state.camera }, () =>
            props.acuMob.mute(),
          )
        }
      />
      <RoundButton
        iconName={audioIcon}
        onPress={() =>
          props.acuMob.setState({ mic: !props.acuMob.state.mic }, () =>
            props.acuMob.mute(),
          )
        }
      />
    </View>
  );
};

const CallOutComponent = (props: AcuMobProps) => {
  return (
    <View style={styles.inputContainer}>
      <View>
        <Text style={styles.basicText}>Service Name</Text>
        <TextInput
          style={styles.input}
          placeholder={'example: --15993377'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text =>
            props.acuMob.setState({
              serviceName: deleteSpaces(text),
            })
          }
          value={props.acuMob.state.serviceName}
          keyboardType={'ascii-capable'}
        />
        <MenuButton
          title={'Call Service'}
          onPress={() => props.acuMob.callService()}
        />
      </View>
      <View>
        <Text style={styles.basicText}>Client ID</Text>
        <TextInput
          style={styles.input}
          placeholder={'example: anna123'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text =>
            props.acuMob.setState({
              callClientId: deleteSpaces(text),
            })
          }
          value={props.acuMob.state.callClientId}
        />
        <MenuButton
          title={'Call Client'}
          onPress={() => props.acuMob.callClient()}
        />
      </View>
    </View>
  );
};

const DisplayClientCall = (props: AcuMobProps) => {
  if (
    props.acuMob.state.outboundCall &&
    props.acuMob.state.callState !== 'connected'
  ) {
    return (
      <View style={styles.center}>
        <Text style={styles.callingText}>
          Calling {props.acuMob.state.callClientId}
        </Text>
      </View>
    );
  } else if (
    props.acuMob.state.inboundCall &&
    props.acuMob.state.callState !== 'connected'
  ) {
    return (
      <View style={styles.center}>
        <Text style={styles.callingText}>
          Calling {props.acuMob.state.incomingCallClientId}
        </Text>
      </View>
    );
  } else {
    if (props.acuMob.state.remoteStream && props.acuMob.state.localStream) {
      switch (true) {
        case props.acuMob.state.localVideoMuted &&
          !props.acuMob.state.remoteVideoMuted:
          return (
            <View style={styles.vidview}>
              <RTCView
                // @ts-ignore
                streamURL={props.acuMob.state.remoteStream.toURL()}
                style={styles.rtcview}
              />
            </View>
          );
        case !props.acuMob.state.localVideoMuted &&
          props.acuMob.state.remoteVideoMuted:
          return (
            <View style={styles.vidview}>
              <Image
                source={require('./media/video_placeholder.png')}
                style={styles.videoPlaceholder}
              />
              <View style={styles.videoPlaceholder}>
                <Text style={styles.basicText}>NO VIDEO</Text>
              </View>
              <View style={styles.rtc}>
                <RTCView
                  // @ts-ignore
                  streamURL={props.acuMob.state.localStream.toURL()}
                  style={styles.rtcselfview}
                />
              </View>
            </View>
          );
        case props.acuMob.state.localVideoMuted &&
          props.acuMob.state.remoteVideoMuted:
          return (
            <View>
              <Image
                source={require('./media/video_placeholder.png')}
                style={styles.videoPlaceholder}
              />
              <View style={styles.videoPlaceholder}>
                <Text style={styles.basicText}>NO VIDEO</Text>
              </View>
            </View>
          );
        default:
          return (
            <View style={styles.vidview}>
              <RTCView
                // @ts-ignore
                streamURL={props.acuMob.state.remoteStream.toURL()}
                style={styles.rtcview}
              />
              <View style={styles.rtc}>
                <RTCView
                  // @ts-ignore
                  streamURL={props.acuMob.state.localStream.toURL()}
                  style={styles.rtcselfview}
                />
              </View>
            </View>
          );
      }
    } else {
      return <View />;
    }
  }
};

const CallDisplayHandler = (props: AcuMobProps) => {
  switch (props.acuMob.state.calling) {
    case 'client':
      return <DisplayClientCall acuMob={props.acuMob} />;
    case 'service':
      return <DialKeypad acuMob={props.acuMob} />;
    default:
      if (props.acuMob.state.inboundCall) {
        // incoming call display
        return (
          <View style={styles.center}>
            <Text style={styles.callingText}>Incoming Call</Text>
            <Text style={styles.callingText}>
              {props.acuMob.state.incomingCallClientId}
            </Text>
          </View>
        );
      } else {
        // idle display
        return (
          <ScrollView>
            <CallOutComponent acuMob={props.acuMob} />
          </ScrollView>
        );
      }
  }
};

const CallButtonsHandler = (props: AcuMobProps) => {
  if (
    props.acuMob.state.inboundCall &&
    props.acuMob.state.callState === 'incoming call'
  ) {
    //incoming call
    return <ButtonsIncoming acuMob={props.acuMob} />;
  } else if (
    props.acuMob.state.inboundCall ||
    props.acuMob.state.outboundCall
  ) {
    if (
      props.acuMob.state.calling === 'client' &&
      props.acuMob.state.callState === 'connected'
    ) {
      // client call connected
      return (
        <View>
          <ClientCallButtons acuMob={props.acuMob} />
          <MainCallButtons acuMob={props.acuMob} />
        </View>
      );
    } else {
      // client call not connected or service call
      return <MainCallButtons acuMob={props.acuMob} />;
    }
  } else {
    // idle state
    return <View />;
  }
};

const RegisterButton = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.registrationButton}>
      <RoundButton
        iconName={'cog-outline'}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

class AcuMob extends AcuMobCom {
  componentDidMount() {
    this.register();
  }

  componentWillUnmount() {
    this.unregister();
  }

  CallHeadComponent = (): any => {
    return (
      <View style={styles.row}>
        <View style={styles.callHead}>
          <Text style={styles.basicText}>Aculab - AcuMobCom Demo</Text>
          {this.state.client !== null ? (
            <View>
              <Text style={styles.basicText}>
                Registered as {this.props.registerClientId}
              </Text>
              <Text style={styles.basicText}>
                State: {this.state.callState}
              </Text>
            </View>
          ) : (
            <Text style={styles.warningText}>
              Please Use Correct Registration Credentials
            </Text>
          )}
        </View>
        {this.state.callState === 'idle' ? <RegisterButton /> : <View />}
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.height100}>
        <this.CallHeadComponent />
        <View>
          <CallDisplayHandler acuMob={this} />
        </View>
        <View style={styles.bottom}>
          <CallButtonsHandler acuMob={this} />
        </View>
      </SafeAreaView>
    );
  }
}

export default AcuMob;
