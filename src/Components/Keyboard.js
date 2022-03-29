import React, { useState, useEffect } from 'react';
import { Grid, Label } from 'semantic-ui-react';
import _ from 'lodash';

export const Keyboard = (props) => {

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<'.split('');
    const [colorMap, setColorMap] = useState([]);

    useEffect(() => {
        let temp = new Map();
        temp.set('GREY', 'grey');
        temp.set('YELLOW', '#E1D328');
        temp.set('GREEN', '#6aaa64');
        setColorMap(temp);
    }, []);

    const keys = _.times(3, (rowNo) => (
        <Grid.Row columns={9} key={rowNo} style={{ border: "none" }}>
            {_.times(9, (colNo) => (
                <Grid.Column key={colNo}>
                    <Label basic style={{
                        backgroundColor: props.alphabetColormap.has(alphabet[rowNo*9+colNo]) ? colorMap.get(props.alphabetColormap.get(alphabet[rowNo*9+colNo])) : 'white',
                        color: props.alphabetColormap.has(alphabet[rowNo*9+colNo]) ? 'white' : 'black',
                        paddingLeft: '10px'
                    }}
                    onClick={e => props.handleCellChange(e)}>{alphabet[rowNo*9+colNo]}</Label>
                </Grid.Column>
            ))}
        </Grid.Row>
    ))

    return (
        <div className='mg-top-50'>
            <Grid>
                {keys}
            </Grid>
        </div>
    );
}