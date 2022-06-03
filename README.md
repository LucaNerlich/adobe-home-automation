# (Adobe) Home Automation Assessment

> Start: 2022-06-03
> End: 2022-06-13
> Contact: M. Voss

## Assigment

### Task

> [...] provide the following: A JavaScript application simulating house automation: pressing a button on a control
> panel would visually turn on a light, change the temperature or close the curtains.
> Plain JavaScript / TypeScript only.
> Clientside Scripts only.
> Make it extensible and write Documentation.
> Bonus Points for Test Cases

### Interpretation

## How to run

**Note, I've copied the "final" production build fragments to `/assignment`.**
I'm fully aware that build-fragments should not be added to version control in a "regular" project.

> Development

1. `$ npm run build`
2. Open `/index.html` in any modern browser
    1. Alternatively, run `$ npm run watch` to listen for changes and auto-compile in the background

> Production

1. `$ npm run build-prod`
2. Open `/index.html` in any modern browser
    1. index.html references the built scripts and stylesheets.
    2. Everything runs self-contained

## ToDos

- [x] Initial Repository Setup
- [x] Build and Development Setup
    - [x] Integrate EsBuild
    - [x] Setup Typescript
    - [x] ~~Integrate SASS~~ lets keep it simple
    - [x] Ensure that the production build works and runs independently of this project
- [ ] Add Jest for script unit tests 
- [ ] Setup skeleton div structure
- [ ] Copy "final" build files to `/assignment`

## Documentation

## References

- <https://esbuild.github.io/>
- <https://dev.to/marcinwosinek/esbuild-in-a-simple-html-js-usecase-h1d>
