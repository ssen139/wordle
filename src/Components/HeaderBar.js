import React from 'react';
import { Image, Label } from 'semantic-ui-react';
import pic from '../Assets/w-logo.png';

export const HeaderBar = () => {

    return (
        <div className='border-line'>
            <div className="header-css">
                <Image src={pic} wrapped ui={true} size='medium' centered />
            </div>
            <div className='subheader-css'>
                <Label basic color='green' size='large'>Basic</Label>
            </div>
        </div>
    );
}