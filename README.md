# 3D French Bulldog & Owner Scene

An interactive 3D scene featuring a detailed French Bulldog and its owner in a park setting, built with Three.js.

## Features

- Detailed 3D models of a French Bulldog and its owner
- Interactive animations including:
  - Dog jumping
  - Dog spinning
  - Petting interaction between owner and dog
- Beautiful park environment with trees, benches, and pathway
- Responsive design for different screen sizes
- Camera controls for orbit, zoom, and pan

## Live Demo

[View Live Demo](https://your-vercel-url.vercel.app) (Replace with your actual URL after deployment)

## Technologies Used

- Three.js for 3D rendering
- Vanilla JavaScript
- Node.js for development server
- HTML5 & CSS3

## Deployment

This project is configured for easy deployment on Vercel.

### Deploy with Vercel

1. Make sure you have the [Vercel CLI](https://vercel.com/download) installed:
   ```
   npm i -g vercel
   ```

2. Login to your Vercel account:
   ```
   vercel login
   ```

3. Deploy from the project directory:
   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments.

### Manual Deployment Steps

1. Fork or clone this repository
2. Push to your own GitHub repository
3. Connect your repository to Vercel
4. Deploy

## Local Development

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/3d-model-project.git
   cd 3d-model-project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `index.html` - Main application entry point
- `js/` - JavaScript files
  - `models/` - 3D model classes (DogModel.js, OwnerModel.js)
  - `environment/` - Environment setup (ParkSceneCreator.js)
  - `utils/` - Utility functions
- `textures/` - Texture files
- `sounds/` - Sound files
- `public/` - Static assets and favicons

## Interaction Guide

- **Pet the Dog**: Click the "Pet the Dog" button to have the owner pet the dog
- **Make Dog Jump**: Click the "Make Dog Jump" button to make the dog jump
- **Make Dog Spin**: Click the "Make Dog Spin" button to make the dog spin
- **View Controls**: Use dropdown menu to select which character to view
- **Camera Controls**: Use mouse to orbit, zoom, and pan around the scene

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js for the amazing 3D library
- Vercel for hosting capabilities

## Project Structure

```
project/
├── models/             # Main 3D models directory
│   ├── dog/            # French Bulldog models
│   │   ├── base/       # Base mesh for the dog
│   │   ├── components/ # Individual detailed parts (eyes, ears, etc.)
│   │   ├── textures/   # Dog-specific textures
│   │   └── reference/  # Reference images for the dog
│   └── owner/          # Owner models
│       ├── base/       # Base mesh for the owner
│       ├── components/ # Individual detailed parts (face, hands, etc.)
│       ├── textures/   # Owner-specific textures
│       └── reference/  # Reference images for the owner
├── textures/           # Shared textures
├── scenes/             # Scene files with both characters
├── exports/            # Exported models in various formats
├── documentation/      # Project documentation
├── js/                 # JavaScript code
│   ├── models/         # Model classes
│   └── utils/          # Utility classes
└── scripts/            # Scripts for automation
```

## French Bulldog Model Features

The French Bulldog model has the following characteristics:

- Black coat color for realistic appearance
- Detailed head with accurate Frenchie features
- Body with proper muscle definition
- Posable ears, tail, and limbs
- Various components that can be viewed separately:
  - Full model
  - Base mesh
  - Head
  - Body
  - Ears
  - Eyes
  - Nose
  - Mouth
  - Paws
  - Tail

## Owner Model Features

The owner model has been enhanced with:

- Realistic proportions with detailed head, torso, limbs
- Facial features including eyes and a smile
- Hair with appropriate texture
- Fully articulated arms and hands
- Clothing with separate materials for tops and bottoms
- Various components that can be viewed separately:
  - Full model
  - Base mesh
  - Head
  - Body
  - Face
  - Hands
  - Feet
  - Hair
  - Clothing

## Park Scene Environment

The project now features a park environment instead of a simple grid, including:

- Grassy ground with natural terrain
- Trees with trunks and foliage
- Decorative bushes
- Stone pathway
- Park benches
- Sky backdrop
- Proper lighting with shadows

## Technical Implementation

This project uses Three.js to create and display 3D models in a web browser. Key features:

- Modular code structure with separate model classes
- Procedural model generation for testing without model files
- Park scene generated programmatically with customizable options
- Interactive controls for viewing and manipulating models
- Debug mode for development with enhanced visualization tools
- Customizable materials and textures

## Running the Project

### Prerequisites

- Node.js (version 12 or higher)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/3d-model-project.git
   cd 3d-model-project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

### Viewing the Models

- Use the dropdown menus to select which model to view (Dog, Owner, or Both)
- Select specific components to view (Full Model, Base, Head, etc.)
- Click "Load Model" to display the selected model
- Controls:
  - Left mouse button: Rotate the model
  - Middle mouse button: Pan the view
  - Mouse wheel: Zoom in/out
  - Wireframe checkbox: Toggle wireframe display
  - Axes checkbox: Toggle axes display
  - Bounding Box checkbox: Toggle bounding box display

### Debug Mode

For development and troubleshooting, the project includes a debug mode (debug.html) with additional features:

- Enhanced logging in the debug panel
- Visual indicators for orientation and position
- Ability to toggle park scene elements
- Test object creation
- Visualizing axes, bounding boxes, and model origins

## Documentation

The project includes comprehensive documentation to guide the modeling process:

- **[Technical Requirements](documentation/technical_requirements.md)**: Hardware and software requirements
- **[Workflow Guide](documentation/workflow_guide.md)**: Step-by-step workflow for creating the models
- **[Naming Conventions](documentation/naming_conventions.md)**: File naming standards
- **[Reference Checklist](documentation/reference_checklist.md)**: Guide for collecting reference materials
- **[Material Library](documentation/material_library.md)**: Material specifications and organization
- **[Quality Assurance](documentation/quality_assurance.md)**: QA process and checklists
- **[Park Scene Guidelines](scenes/park_scene_guidelines.md)**: Guidelines for park scene development

## Scripts

The project includes utility scripts to help with file management and exports:

- **[File Manager](scripts/file_manager.py)**: Script for versioning, backups, and exports

## Future Enhancements

Planned future improvements include:

- Animated dog and owner interactions
- Advanced fur rendering for the dog
- More detailed facial expressions
- Additional park scene elements (water features, playground, etc.)
- Weather effects (rain, snow, wind)

## Contributing

When contributing to this project, please follow the established naming conventions and file organization. Use the file manager script to create versions and document your changes.

## License

This project and its assets are proprietary and may not be used without permission.
