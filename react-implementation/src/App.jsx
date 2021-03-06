import './styles/App.css'
import React, {useState} from 'react'
import Consumer from './components/Consumer'
import {SmartHomeContext} from './util/SmartHomeContext'

function App() {

    const [providers, setProviders] = useState({
        name: 'lightswitch',
    })

    // const providerValue = useMemo(() => ({providers, setProviders}), [providers, setProviders()])

    /*
     * TODO
     *  add react-router-dom
     * <Router>
     * <Route/> -> Provider
     * <Route/> -> Consumer
     * </Router
     *
     * use useContext(SmartHomeContext)
     * maybe map of topic -> DataProvider?
     *
     * context should be a state
     * create services -> ConsumerService, ProviderService
     */

    return (
        <div className='App'>
            <div>
                <h2>Provider</h2>
                <button onClick={() => {
                    setProviders({
                        name: 'Fabian',
                    })
                }}>Change Name 1
                </button>
            </div>

            <div>
                <h2>Consumer</h2>
                <SmartHomeContext.Provider value={{providers, setProviders}}>
                    <Consumer providerKey='light1' />
                    <Consumer providerKey='light1' />
                </SmartHomeContext.Provider>
            </div>
        </div>
    )
}

export default App
