# (Adobe) Home Automation Assessment

> First Commit: 2022-06-03
> Last Commit: 2022-06-13
> Contact: M. Voss

- [Assigment](#assigment)
    - [Task](#task)
    - [Interpretation](#interpretation)
- [How to run](#how-to-run)
- [Documentation](#documentation)
    - [Demo Content](#demo-content)
- [ToDos](#todos)
    - [Known Issues](#known-issues)
- [References](#references)

## Assigment

### Task

> [...] provide the following: A JavaScript application simulating house automation: pressing a button on a control
> panel would visually turn on a light, change the temperature or close the curtains.
> Plain JavaScript / TypeScript only.
> Clientside Scripts only.
> Make it extensible and write Documentation.
> Bonus Points for Test Cases

### Interpretation

Write JavaScript that enables the (browser) pages visitor to add new (smart home) devices of type X, where X can be
anything such as a light switch, heating or window blinds.
To facilitate this generic approach, the implemented logic should be able to handle multiple kind of input/output types.

The simplest example is the "on / off (boolean value)" state for any electric circuit (e.g lightswitch).
This could be extended by adding multiple light sources to the same switch.
Additionally, one could imagine that the light itself is dimmamble -> the app needs to handle float values now.

I am envisioning a dashboard that consists of three different panes.
A form to add a new device.
A panel to control such added devices, as well as a panel that visualizes each device's state.

The communication between the "hub" (control dashboard) and its devices is a "publish / subscribe" architecture.
In larger applications, this would be handled by a messsage queue, such as Apache Kafka or RabbitMQ.
However, due to the size and constrains of this app, I will try to build something similar, but simplified.

The "configuration"
panel publishes state changes for a topic and all devices that subscribe to this topic consume that update.

On a side note, I am keeping any frontend styling to a minimum and simple,
since I want to focus on the underlying logic and not "waste" time.

## How to run

**Note, I've copied the "final" production build fragments to `/assignment`.**
I'm fully aware that build-fragments should not be added to version control in a "regular" project.

> Development

1. `$ npm run build`
2. Serve `/index.html` from HTTP server and open in any modern browser
    1. e.g `$ npm run serve` to use esbuild built in development server
    2. Alternatively, run `$ npm run watch` to listen for changes and auto-compile in the background

> Production

1. `$ npm run build-prod`
2. Open `/index.html` in any modern browser
    1. index.html references the scripts and stylesheets.
    2. Everything runs self-contained when served from an HTTP server

> Run pre-built '/assignment' artifacts

1. `$ npm run serve-prod`
    1. This uses esbuild built-in HTTP server to 'serve' the built files.
    2. The path is hardcoded to `/assignment` to where I've manually copied the latest built artifacts

## Documentation

> Testing

I've written jest unit tests for most of the backend functionality and element creation.
Additionally, e2e tests are being run heedlessly for chrome and firefox using CypressIO.

Jest test cases run on dev and prod builds. Cypress e2e tests only during production builds.

> Production Artifacts

- Entry-file Html: `assignment/index.html`
- Entry-file Scripts: `assignment/index.js`
- Entry-file Stylesheets: `assignment/index.css`

This project uses [esbuild](https://esbuild.github.io/) to bundle and transpile the typescript code into a single,
portable `index.js`.
This script is being referenced by the `index.html`, which additionally loads all stylesheets via a single `index.css`.
I've opted out of adding any SASS Plugins to keep this setup as simple as possible.

The app is broken down into three main sections.

- Form Container to create new Provider and Consumer
- Control Dashboard to emit Events
- Visualization Panel of Consumers and their event handling

### Demo Content

![demo-screenshot](./assets/demo.png)

The app comes with a set of demo providers and consumers already added.
Remove the following line in `/index.ts`, to disable this behaviour:

```javascript
// Load Demo Content
document.getElementById('load-demo-button')?.click()
```

You are now able to manually load the demo content via a button click.

## ToDos

- [x] Initial Repository Setup
- [x] Build and Development Setup
    - [x] Integrate esbuild
    - [x] Setup Typescript
    - [x] ~~Integrate SASS~~ lets keep it simple
    - [x] Ensure that the production build works and runs independently of this project
- [x] Add Jest Setup for unit tests
- [x] create "dummy" provider element + event
- [x] create "dummy" consumer element
- [x] create generic provider
- [x] create generic consumer
- [x] start with a device creation form
    - independently create provider and consumer
    - [x] form validation do not allow duplicate topic
    - [ ] ~~wrap each input/label line in div and style it~~
- [x] dynamically create provider
- [x] dynamically create consumer
    - setup listeners during creation
    - ensure that multiple consumers are able to listen to the same event topic
- [x] investigate how the strategy pattern could be used
- Must have Device Types / Strategies
    - [x] boolean -> light on/off, blinds open/closed
    - [x] float 0-1 -> e.g dimmable light
    - [x] float -> heating
- Nice to have Device Types
    - [ ] color (picker/value) -> rgb lights
    - [ ] set timer for X -> close blinds at 12pm
- [x] Setup skeleton div structure
- [ ] ~~add localStorage "cache" / "state" to preserve *something* during page refresh~~
    - [x] add "load demo state" button instead?
- [ ] add jest testcases
- [ ] add updated Demo Screenshot to README
- [x] add table of contents to README
- [ ] record short demo video
- [ ] Copy "final" build files to `/assignment`
    - index.html
    - index.js
    - index.css
    - /css/*.css

### Known Issues / Future Extensions

- Consumer Form tries to submit twice. However, validation correctly blocks the second submission.
- When adding a new consumer, it does not automatically grab the current state of its corresponding provider
- Currently, not possible to delete a consumer or a topic, once added.
- Add more test cases, especially for the event listeners, although this is quite tricky.

## References

- <https://esbuild.github.io/>
- <https://dev.to/marcinwosinek/esbuild-in-a-simple-html-js-usecase-h1d>
- <https://css-tricks.com/lets-create-a-lightweight-native-event-bus-in-javascript/>
- <https://pierfrancesco-soffritti.medium.com/create-a-simple-event-bus-in-javascript-8aa0370b3969>
- <https://www.w3schools.com/html/html_forms.asp>
- <https://www.dofactory.com/javascript/design-patterns/strategy>
- <https://refactoring.guru/design-patterns/strategy/typescript/example>
- <https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events>
- <https://medium.com/geekculture/html-event-handling-in-typescript-b9ca7178d912>
- <https://www.freecodecamp.org/news/form-validation-with-html5-and-javascript/>
