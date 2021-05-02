import './App.css';
import {Route, Switch, Redirect} from 'react-router-dom';
import ShopPage from './pages/shop/Shop';
import Header from './components/header/Header';
import SignInAndSignUp from './pages/signIn-signUp/SignIn-SignUp';

import HomePage from './pages/homepage/HomePage';

import {auth, createUserProfileDocument} from './firebase/firebase.utils';
import {Component} from 'react';
import {connect} from 'react-redux';
import {UserActionTypes} from './redux/user/user.types';

class App extends Component {

    unsubscribeFromAuth = null;

    componentDidMount() { //register to the subscription that firebase provides
        this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {

            if (userAuth) { //when user logs in, create document if doesn't exist in createUserProfileDocument and listen to any changes on userRef using onSnapShot
                const userRef = await createUserProfileDocument(userAuth);

                // used onSnapshot just so that we get all the data related to that user and store in state
                // 1
                userRef.onSnapshot(snapShot => {
                    this.props.setCurrentUser({
                            id: snapShot.id,
                            ...snapShot.data()
                        });
                });
            } else {
                // if user logs out, userAuth is null this.props.setCurrentUser calls the
                // dispatch function in mapDispatchToProps()
                this.props.setCurrentUser(userAuth);
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribeFromAuth();
    }

    render() {
        return (
            <div>
                <Header/>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path='/shop' component={ShopPage}/>
                    <Route
                        exact
                        path='/signin'
                        render={() => this.props.currentUser // 5
                        ? (<Redirect to='/'/>)
                        : (<SignInAndSignUp/>)}/>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    // 4
    return {currentUser: state.user.currentUser}
}

const mapDispatchToProps = dispatch => {
    return {
        // 2 (3 in user-reducer)
        setCurrentUser: user => {
            dispatch({type: UserActionTypes.SET_CURRENT_USER, payload: user})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
