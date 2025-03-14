# 3D Model Project: French Bulldog and Owner

This project contains 3D models of a realistic French Bulldog and its owner in a park scene. The project is structured to maintain high-quality, detailed models with proper organization.

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

This project and its assets are proprietary and may not be used without permission. #   F r e n c h i e - A n d - O w n e r  
 