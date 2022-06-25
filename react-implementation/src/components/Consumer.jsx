import React from 'react'
import {SmartHomeContext} from '../util/SmartHomeContext'

export default function Consumer(props) {
    const providerKey = props.providerKey

    const {providers, setProvider} = React.useContext(SmartHomeContext)

    return (
        <div>
            <h2>Provider: {providerKey}</h2>
            Consumer Value: {providers.name}
        </div>
    )
}
