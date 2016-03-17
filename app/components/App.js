/**
 * Created by orel- on 06/Dec/15.
 */
import React from 'react';
import Navbar from './Navbar';

class App extends React.Component {
    render() {
        return (
            <div>
                <Navbar history={this.props.history} />
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default App;