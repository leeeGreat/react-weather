/**
 * @flow
 */

'use strict';

import StatusBar from 'StatusBar';
import React, {
  Component,
  StyleSheet,
  View,
  Animated,
  Dimensions
} from 'react-native';

import { connect } from 'react-redux';
import Swiper from './dependencies/swiper';

import Header from './components/header';
import Forecast from './components/forecast';

import { getAllWeather } from './actions';
import { WeatherModel } from './models/view'

const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
  dispatch: any;
  isLoading: bool;
  weather: Array<WeatherModel>;
};

type State = {
  shift: Animated.Value;
  current: Animated.Value;
};

class App extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      shift: new Animated.Value(0),
      current: new Animated.Value(0)
    };

    (this: any).onScroll = this.onScroll.bind(this);
    (this: any).renderPagination = this.renderPagination.bind(this);
    (this: any).onSelectedIndexChange = this.onSelectedIndexChange.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getAllWeather());
  }

  render() {
    if (this.props.isLoading === true) {
      return (
        <View style={styles.loadingView}></View>
      );
    }

    var forecastItems = this.props.weather.map((item, index) => {
      return (
        <Forecast key={`forecast-${index}`} forecast={item.forecast} />
      );
    });

    var swiper = (
      <Swiper
        showsPagination={true}
        loop={false}
        onScroll={this.onScroll}
        renderPagination={this.renderPagination}
        onSelectedIndexChange={this.onSelectedIndexChange}
        scrollEventThrottle={30}>
        { forecastItems }
      </Swiper>
    );

    return (
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor='transparent' barStyle='light-content'/>
          <Header offset={this.state.shift} current={this.state.current}>
            { swiper }
          </Header>
      </View>
    );
  }

  onSelectedIndexChange(index, offset) {
    // this is not curently used
    this.state.current.setValue(index);
  }

  renderPagination(index, state, context) {
    return null;
  }

  onScroll(e) {
    var value = (e.nativeEvent.contentOffset.x % SCREEN_WIDTH);
    this.state.shift.setValue(e.nativeEvent.contentOffset.x);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9'
  },
  loadingView: {
    height: 290,
    backgroundColor: '#589BC7'
  }
});

function select(store): Props {
  return {
    isLoading: store.weather.isLoading,
    weather: store.weather.data,
  };
}

module.exports = connect(select)(App);
