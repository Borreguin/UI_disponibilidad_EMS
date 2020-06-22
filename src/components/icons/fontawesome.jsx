import { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

class IconLibrary extends Component {
    state = {  }
    render() { 
        return ( 
            library
         );
    }
}
 
export default IconLibrary;