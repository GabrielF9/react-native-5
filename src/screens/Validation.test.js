import React from 'react';
import axios from 'axios';
import renderer from 'react-test-renderer';
import { ActivityIndicator, AsyncStorage } from 'react-native';

import Login from './Login';
import Acceleration from './Acceleration';
import Profile from './Profile';
import AccelerationItem from '../components/AccelerationItem';


describe('Login', () => {
  let getItemResponse = null;
  const props = {
    navigation: {
      navigate: jest.fn(() => {})
    }
  }

  beforeEach(() => {
    AsyncStorage.getItem = jest.fn(() => Promise.resolve(JSON.stringify(getItemResponse)));
    AsyncStorage.setItem = jest.fn(() => Promise.resolve());

    axios.post = jest.fn(() => Promise.resolve({ data: { token: '123' } }))
  });

  it('Should get the user data from AsyncStorage', () => {
    const asyncSpy = jest.spyOn(AsyncStorage, 'getItem');

    renderer.create(<Login {...props} />).root;

    expect(asyncSpy).toHaveBeenCalledWith('user')
  });

  it('Should have an input to set the user email', done => {
    const instance = renderer.create(<Login {...props} />).root;

    setTimeout(() => {
      expect(instance.findByProps({className: 'email-input'}).props.autoCompleteType).toBe('email')
      expect(instance.findByProps({className: 'email-input'}).props.keyboardType).toBe('email-address')
      done();
    });
  });

  it('Should have an input to set the user password', done => {
    const instance = renderer.create(<Login {...props} />).root;

    setTimeout(() => {
      expect(instance.findByProps({className: 'password-input'}).props.autoCompleteType).toBe('password')
      expect(instance.findByProps({className: 'password-input'}).props.secureTextEntry).toBe(true)
      done();
    });
  });

  it('Should have a button to submit the form', done => {
    const instance = renderer.create(<Login {...props} />).root;

    setTimeout(() => {
      expect(instance.findByProps({className: 'submit-login'}).props.disabled).toBe(true)
      expect(instance.findByProps({className: 'submit-login'}).props.title).toBe('Entrar')
      done();
    });
  });

  it('Should have a button to submit the form', done => {
    const instance = renderer.create(<Login {...props} />).root;

    setTimeout(() => {
      expect(instance.findByProps({className: 'submit-login'}).props.disabled).toBe(true)
      expect(instance.findByProps({className: 'submit-login'}).props.title).toBe('Entrar')
      done();
    });
  });

  it('Should enable the submit button when email and password are valid', done => {
    const instance = renderer.create(<Login {...props} />).root;

    instance.findByProps({className: 'email-input'}).props.onChangeText('rafael@gmail.com')
    instance.findByProps({className: 'password-input'}).props.onChangeText('123')

    setTimeout(() => {
      expect(instance.findByProps({className: 'submit-login'}).props.disabled).toBe(false)
      done();
    });
  });

  it('Should disable the submit button when the email are invalid', done => {
    const instance = renderer.create(<Login {...props} />).root;

    instance.findByProps({className: 'email-input'}).props.onChangeText('rafael@gmail.c')
    instance.findByProps({className: 'password-input'}).props.onChangeText('123')

    setTimeout(() => {
      expect(instance.findByProps({className: 'submit-login'}).props.disabled).toBe(true)
      done();
    });
  });

  it('Should disable the submit button when the password are empty', done => {
    const instance = renderer.create(<Login {...props} />).root;

    instance.findByProps({className: 'email-input'}).props.onChangeText('rafael@gmail.c')
    instance.findByProps({className: 'password-input'}).props.onChangeText('123')

    setTimeout(() => {
      expect(instance.findByProps({className: 'submit-login'}).props.disabled).toBe(true)
      done();
    });
  });

  it('Should make a request when click on submit-login with the valid data', done => {
    const postSpy = jest.spyOn(axios, 'post')

    const instance = renderer.create(<Login {...props} />).root;

    instance.findByProps({className: 'email-input'}).props.onChangeText('rafael@gmail.com')
    instance.findByProps({className: 'password-input'}).props.onChangeText('123')

    setTimeout(() => {
      instance.findByProps({className: 'submit-login'}).props.onPress();

      expect(postSpy).toHaveBeenCalledWith('https://api.codenation.dev/v1/user/auth', {
        email: 'rafael@gmail.com',
        password: '123'
      });
      done();
    });
  });

  it('Should authenticate when click on submit-login with the valid data', done => {
    const postSpy = jest.spyOn(axios, 'post')
    const asyncSpy = jest.spyOn(AsyncStorage, 'setItem')
    const navigateSpy = jest.spyOn(props.navigation, 'navigate')

    const instance = renderer.create(<Login {...props} />).root;

    instance.findByProps({className: 'email-input'}).props.onChangeText('rafael@gmail.com')
    instance.findByProps({className: 'password-input'}).props.onChangeText('123')

    setTimeout(() => {
      instance.findByProps({className: 'submit-login'}).props.onPress();

      expect(postSpy).toHaveBeenCalledWith('https://api.codenation.dev/v1/user/auth', {
        email: 'rafael@gmail.com',
        password: '123'
      });

      setTimeout(() => {
        expect(asyncSpy).toHaveBeenCalledWith('user', JSON.stringify({token: '123'}));
        expect(navigateSpy).toHaveBeenCalledWith('Acceleration');
        done();
      });
    });
  });

  it('Should go to accelerations page when user is logged', done => {
    getItemResponse = { token: "123teste" };
    const asyncSpy = jest.spyOn(props.navigation, 'navigate');

    renderer.create(<Login {...props} />).root;

    setTimeout(() => {
      expect(asyncSpy).toHaveBeenCalledWith('Acceleration');
      done();
    });
  });
});

describe('Acceleration', () => {
  const accelerations = [{
    "slug": "reactnative-online-1",
    "name": "React Native",
    "is_disabled": false,
    "subscription_start_at": "2019-07-08T00:00:00-03:00",
    "subscription_finish_at": "2019-07-28T23:59:59-03:00",
    "start_at": "2019-08-17T00:00:00-03:00",
    "finish_at": "2019-11-03T00:00:00-03:00",
    "location": "Online",
    "banner_url": "https://s3-us-west-1.amazonaws.com/acceleration-assets-highway/reactnative-online-1/banner.jpg",
    "home_banner_url": "",
    "color_scheme": "7800FF",
    "company_count": 1
  }]

  beforeEach(() => {
    AsyncStorage.getItem = jest.fn(() => Promise.resolve(JSON.stringify({
      token: '123',
      picture: 'photo'
    })));

    axios.get = jest.fn(() => Promise.resolve({ data: accelerations }));
  })

  it('Should get the user data from local storage', () => {
    const asyncSpy = jest.spyOn(AsyncStorage, 'getItem');

    const instance = renderer.create(<Acceleration />).root;

    expect(asyncSpy).toHaveBeenCalledWith('user')
  })

  it('Should get the accelerations', () => {
    const asyncSpy = jest.spyOn(axios, 'get');

    const instance = renderer.create(<Acceleration />).root;

    expect(asyncSpy).toHaveBeenCalledWith('https://api.codenation.dev/v1/acceleration')
  })

  it('Should have a loading waiting for the accelerations to be loaded', done => {
    const instance = renderer.create(<Acceleration />).root;

    expect(instance.findAllByType(ActivityIndicator).length).toBe(1)

    setTimeout(() => {
      expect(instance.findAllByType(AccelerationItem).length).toBe(1)
      done()
    })
  })

  it('Should have a loading waiting for the accelerations to be loaded', done => {
    const instance = renderer.create(<Acceleration />).root;

    expect(instance.findAllByType(ActivityIndicator).length).toBe(1)

    setTimeout(() => {
      expect(instance.findByType(AccelerationItem).props.item).toEqual(accelerations[0])
      done()
    })
  })

  it('Should set the user image as the loaded from AsyncStorage', done => {
    const instance = renderer.create(<Acceleration />).root;

    setTimeout(() => {
      expect(instance.findAllByType('Image')[1].props.source).toEqual({ uri: "photo" })
      done()
    })
  })
})

describe('Profile', () => {
  const profile = {
    "acl": {},
    "address": {
      "ComplementaryAddress": "",
      "Number": "",
      "Street": "",
      "ZipCode": "",
      "id": "",
    },
    "birthday": "1993-04-27T00:00:00-03:00",
    "challenge_submission_hash": "",
    "company": [],
    "created_at": "2019-06-30T13:20:43.084-03:00",
    "documents": null,
    "education_level": 0,
    "email": "rafael@gmail.com",
    "first_name": "Rafael",
    "gender": 1,
    "github": "http://github.com/rafacianci",
    "id": "5d18e15b822dfd2b28",
    "interest": null,
    "language": [
      "Português - PT",
      "Inglês - EN",
      "Japonês - JA",
    ],
    "last_name": "Fuzifaru Cianci",
    "linkedin": "https://www.linkedin.com/in/rafaelcianci",
    "name": "local test",
    "nickname": "Sturgeon 3a5",
    "onboarding": null,
    "phone": "(48) 99120-3585",
    "picture": "photo",
    "programming_level": "",
    "token": "",
    "type": 2,
    "type_name": "Talent",
    "university": null,
    "updated_at": "2019-07-13T11:02:24.065-03:00",
    "validated_at": "2019-06-30T13:20:43.211-03:00",
  }

  beforeEach(() => {
    AsyncStorage.getItem = jest.fn(() => Promise.resolve(JSON.stringify({
      token: '123'
    })));

    axios.get = jest.fn(() => Promise.resolve({ data: profile }));
  })

  it('Should get the user data from local storage', () => {
    const asyncSpy = jest.spyOn(AsyncStorage, 'getItem');

    const instance = renderer.create(<Profile />).root;

    expect(asyncSpy).toHaveBeenCalledWith('user')
  })

  it('Should get the profile', done => {
    const asyncSpy = jest.spyOn(axios, 'get');

    const instance = renderer.create(<Profile />).root;

    setTimeout(() => {
      expect(asyncSpy).toHaveBeenCalledWith('https://api.codenation.dev/v1/me/profile', {
        headers: {
          Authorization: '123'
        }
      })
      done();
    })
  })

  it('Should have a loading waiting for the profile to be loaded', done => {
    const instance = renderer.create(<Profile />).root;

    expect(instance.findAllByType(ActivityIndicator).length).toBe(1)

    setTimeout(() => {
      expect(instance.findByProps({ className: 'profile-name' }).children[0].children[0]).toBe('local test')
      done()
    })
  })
})
