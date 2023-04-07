# Vocowl

![Vocowl](./docs/Vocowl%20Header.png "Vocowl")

The idea of Vocowl came about from a simple question, "How do I pick where to eat?" Built using Svelte and utilizing the Leaflet and the HERE API, Vocowl let's you select nearby restaurants and enter your own favorites, then picks one at random. By settling this question, Vocowl is perfect for people who are not vocal and indecisive about their food opinions and pays homage to the wisdom of owls. Currently, Vocowl is meant to be a US based service. In the future, support for other countries may be added.

## Instructions

Vocowl is hosted right here on GitHub. Visit https://dkambich.github.io/Vocowl/ to get searching.

## Building the Project Locally

### Installation:

```bash
git clone https://github.com/DKambich/Vocowl.git
npm install
```

**NOTE: Before running the project locally, you will need create and replace the [HERE API](https://developer.here.com/) key stored in `credentials.ts`. Restaurant search functionality will not work if this is not done.**

### Running:

```bash
npm run dev
```

### Building:

```bash
npm run build
```

This will create the `dist` folder that contains the compiled Svelte app and resources
