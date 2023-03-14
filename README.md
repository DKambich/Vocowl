# Vocowl

![Vocowl](./docs/Vocowl%20Header.png "Vocowl")

The idea of Vocowl came about from a simple question, "How do I pick where to eat?" Built using Svelte and utilizing the Google Maps API, Vocowl let's you select nearby restaurants and enter your own favorites then picks one at random. By settling this question, Vocowl is perfect for people who are not vocal or indecisive about their food opinions and pays homage to the wisdom of owls.

## Instructions

Vocowl is hosted right here on GitHub. Visit https://dkambich.github.io/Vocowl/ to get started.

## Building the Project Locally

### Installation:

```bash
git clone https://github.com/DKambich/Vocowl.git
npm install
```

**NOTE: Before running the project locally, you will need to replace the Google Maps API key stored in `credentials.ts`. The API key must be configured for both the base [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview) and the [Google Places API](https://developers.google.com/maps/documentation/javascript/places). Google Maps and Google Place Search related functionality will not work if this is not done. Specifically, you will need to enable the Geocoding API, Maps Javascript API, and Place API**

### Running:

```bash
npm run dev
```

### Building:

```bash
npm run build
```

This will create the `dist` folder that contains the compiled Svelte app and resources
