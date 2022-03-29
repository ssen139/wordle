import React from 'react';
import { Message, Transition } from 'semantic-ui-react';

export const ResultPanel = (props) => {

    return (
        <div className='mg-top-50'>
            <div style={{ display: props.gameStatus === 'IN_PROGRESS' ? 'block' : 'none' }} >
                <input type="button" tabIndex="-1" className='mg-top-50 button-css' value='SUBMIT' onClick={() => props.handleSubmit()} />
            </div>

            <Transition visible={props.gameStatus === 'SUCCESS'} animation='scale' duration={500}>
                <div>
                    <Message size='mini' info header={props.tryCount===1?'Flawless!!':props.tryCount>=5?'Phew!!':'Splendid!!'} content='You guessed it' icon='thumbs up' />
                </div>
            </Transition>

            <Transition visible={props.gameStatus === 'FAILURE'} animation='scale' duration={500}>
                <div>
                    <Message size='mini' warning header='Out of tries!!' content={'Correct word was: '+ props.correctWord} icon='exclamation' />
                </div>
            </Transition>
        </div >
    );
}